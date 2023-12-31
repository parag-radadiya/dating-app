import fs from 'fs';
import path from 'path';
import httpStatus from 'http-status';
import AWS from 'aws-sdk';
import mongoose from 'mongoose';
import axios from 'axios';
import jimp from 'jimp';
import { asyncForEach } from 'utils/common';
import ApiError from 'utils/ApiError';
import { TempS3 } from 'models';
import config from 'config/config';
import allowedContentType from 'utils/content-type.json';

AWS.config = new AWS.Config({
  accessKeyId: config.aws.accessKeyId, // stored in the .env file
  secretAccessKey: config.aws.secretAccessKey, // stored in the .env file
  region: process.env.AWS_BUCKET_REGION, // This refers to your bucket configuration.
});
// AWS.config.update({ region: 'us-east-1' });
const s3 = new AWS.S3({ apiVersion: '2006-03-01', signatureVersion: 'v4' });
export const getSignedUrl = (key) => {
  const signedURL = {
    Bucket: config.aws.bucket,
    Key: key,
    Expires: 7200,
  };
  return s3.getSignedUrl('getObject', signedURL);
};

export const getSignedUrlPutObject = async (key, contentType, isPublic) => {
  const signedURL = {
    Bucket: config.aws.bucket,
    ContentType: contentType,
    Key: key,
    Expires: 3600,
  };
  if (isPublic) {
    signedURL.ACL = 'public-read';
  }
  return s3.getSignedUrlPromise('putObject', signedURL);
};

export const validateExtensionForPutObject = async (preSignedReq, user) => {
  const ssExtensionsContentType = allowedContentType.map((ele) => ele.mimeType);
  const ssExtensions = allowedContentType.map((ele) => ele.key);
  // this is the number of unwanted file that is not used in system but uploaded in server
  const maxTanglingFilesAllowed = 100;
  let extensionOfKey = preSignedReq.key.split('.');
  extensionOfKey = extensionOfKey[extensionOfKey.length - 1];
  if (!extensionOfKey) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'invalid key');
  }
  if (ssExtensionsContentType.includes(preSignedReq.contentType) && ssExtensions.includes(extensionOfKey)) {
    Object.assign(preSignedReq, {
      key: `users/${user._id}/${mongoose.Types.ObjectId()}/${preSignedReq.key}`,
    });
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, 'invalid content-type');
  }
  const dumpFilesCount = await TempS3.find({ active: false }).count();
  if (dumpFilesCount > maxTanglingFilesAllowed) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Maximum upload size exceed');
  }
  const url = await getSignedUrlPutObject(preSignedReq.key, preSignedReq.contentType, true);
  const tempS3Body = {
    user: user._id,
    url: url.split('?')[0],
    key: preSignedReq.key,
  };
  const tempS3 = new TempS3(tempS3Body);
  await tempS3.save();
  return { url, key: preSignedReq.key };
};

export const deleteObjects = async (keys) => {
  return s3.deleteObjects({ Bucket: config.aws.bucket, Delete: { Objects: keys } }).promise();
};

export const uploadFileToS3 = async (url, key) => {
  return axios.get(url, { responseType: 'arraybuffer', responseEncoding: 'binary' }).then(async (response) => {
    const params = {
      ContentType: response.headers['content-type'],
      ContentLength: response.data.length.toString(), // or response.header["content-length"] if available for the type of file downloaded
      Bucket: config.aws.bucket,
      Body: response.data,
      Key: key,
      ACL: 'public-read',
    };
    await s3.putObject(params).promise();
    return `https://${config.aws.bucket}.s3.amazonaws.com/${key}`;
  });
};

/**
 * Upload file from server to s3
 * @param filepath
 * @param user
 * @param file
 * @returns {Promise<String>}
 */
export const uploadFileToS3bucket = async ({ filepath, uploadpath, ContentType, ContentLength }) => {
  const stream = await fs.createReadStream(filepath);
  const params = {
    ContentType,
    ContentLength,
    Bucket: config.aws.bucket,
    Body: stream,
    Key: uploadpath,
    ACL: 'public-read',
  };
  return new Promise((resolve, reject) => {
    return s3.putObject(params, function (err) {
      if (err) return reject(err);
      return resolve(`https://${config.aws.bucket}.s3.amazonaws.com/${uploadpath}`);
    });
  });
};

/**
 * this is promise function to crate file and upload file
 * @param file
 * @param user
 * @param dirPath
 * @param filePath
 * @param key
 * @returns {Promise<[]>}
 */
const createAndUploadFile = (file, user, dirPath, filePath, key) => {
  return new Promise((resolve, reject) => {
    const pathString = dirPath + file.name;
    file.mv(path, (err) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      const uploadFilePath = `user/${user._id}/${filePath}/${key}/${mongoose.Types.ObjectId()}/${file.name}`;
      uploadFileToS3bucket({
        filepath: pathString,
        user,
        uploadpath: uploadFilePath,
        ContentLength: file.data.toString().length,
        ContentType: file.mimetype,
      })
        .then((data) => {
          fs.unlinkSync(pathString);
          resolve(data);
        })
        .catch((e) => {
          fs.unlinkSync(pathString);
          console.log(e);
          resolve('err');
        });
    });
  });
};
/**
 * this function save files in server from multiPart request
 * @param files
 * @param user
 * @param filePath
 * @returns {Promise<{}>}
 */
export const uploadRequestedFiles = async (files, user, filePath) => {
  if (!fs.existsSync(`${__dirname}/tempFiles/`)) {
    fs.mkdirSync(`${__dirname}/tempFiles/`);
  }
  const dirPath = `${__dirname}/tempFiles/${Date.now()}/`;
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
  }
  const uploadedObj = {};
  await asyncForEach(Object.keys(files), async (key) => {
    const file = files[key];
    const createFileArray = [];
    if (Array.isArray(file)) {
      file.forEach((f) => {
        createFileArray.push(createAndUploadFile(f, user, dirPath, filePath, key));
      });
    } else {
      createFileArray.push(createAndUploadFile(file, user, dirPath, filePath, key));
    }
    const pathArray = await Promise.all(createFileArray);
    uploadedObj[key] = pathArray.length > 1 ? pathArray : pathArray[0];
  });
  fs.rmdirSync(dirPath);
  return uploadedObj;
};

/**
 * this function move given file to given destination path within s3 bucket
 * @param key
 * @param newFilePath
 * @returns {Promise<>}
 */
export const moveFile = async ({ key, newFilePath }) => {
  const params = {
    Bucket: config.aws.bucket, // bucket name
    CopySource: key, // file source path
    Key: newFilePath, // new destination path where file will be moved
    ACL: 'public-read', // access for everyone public read-only
  };
  try {
    await s3.copyObject(params).promise();
    await deleteObjects([{ Key: params.CopySource }]);
    return `https://${config.aws.bucket}.s3.amazonaws.com/${params.Key}`;
  } catch (e) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, e);
  }
};

/**
 * this functin create image thumb nails
 * @param url
 * @param resolutions
 * @returns {Promise<[]>}
 */
export const createThumbnails = async ({ url, resolutions = [] }) => {
  const name = url.split('/').pop();
  const fileNameIndex = url.indexOf(name);
  const uploadBasePath = url.substring(`https://${config.aws.bucket}.s3.amazonaws.com/`.length, fileNameIndex); // `user/${user.id}/${modelName}/${modelId}/${thumbnailField}`
  const writePath = path.join(__dirname, '../thumbnails/');
  if (!fs.existsSync(writePath)) {
    fs.mkdirSync(writePath);
  }
  const writeAndUpload = async ({ ele, fileName }) => {
    const uploadpath = `${uploadBasePath}${mongoose.Types.ObjectId()}/${ele}_${fileName}`;
    const image = await jimp.read(url);
    await image.resize(ele, ele).writeAsync(`${writePath}${ele}_${fileName}`);
    const thumbUrl = await uploadFileToS3bucket({
      filepath: `${writePath}${ele}_${fileName}`,
      ContentType: image.getMIME(),
      ContentLength: (await image.getBufferAsync(image.getMIME())).toString().length,
      uploadpath,
    });
    return thumbUrl;
  };
  const uploadArray = [];
  resolutions.map(async (ele) => {
    const fileName = name;
    uploadArray.push(writeAndUpload({ ele, fileName }));
  });
  return Promise.all(uploadArray).then((data) => {
    fs.rmdirSync(writePath, { recursive: true });
    return data;
  });
};

export const getImagesFromFolder = async (folderName) => {
  const params = {
    Bucket: config.aws.bucket,
    Prefix: folderName,
  };
  const data = await s3.listObjects(params).promise();
  let list =  data.Contents.map((ele) => `https://${config.aws.bucket}.s3.amazonaws.com/${ele.Key}`);
  list.shift()
  return list;
}
