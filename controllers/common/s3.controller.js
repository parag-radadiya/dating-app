import httpStatus from 'http-status';
import { catchAsync } from 'utils/catchAsync';
import { s3Service } from 'services';
// eslint-disable-next-line import/prefer-default-export
export const preSignedPutUrl = catchAsync(async (req, res) => {
  const { body, user } = req;
  const s3PutObject = await s3Service.validateExtensionForPutObject(body, user);
  return res.status(httpStatus.OK).send({ results: s3PutObject });
});

export const uploadS3Image = catchAsync(async (req, res) => {
  // https://pngtree.com/freepng/faceless-male-profile-icon_7902585.html
  const { url, key } = req.body;

  const s3PutObject = await s3Service.uploadFileToS3(url, key);
  // const s3PutObject = await s3Service.uploadFileToS3bucket({
  //   "G:\dating-app-imoji\1.jfif"
  //   "G:\dating-app-imoji\2.jfif"
  //   "G:\dating-app-imoji\3.jfif"
  // filepath: 'G://dating-app-imoji/12.jfif',
  // uploadpath: '14',
  // ContentType: 'png',
  // });
  return res.status(httpStatus.OK).send({ results: s3PutObject });
});

export const getEmojis = catchAsync(async (req, res) => {
  // get images from emoji folder of s3 bucket
  const s3PutObject = await s3Service.getImagesFromFolder("emoji/");
  return res.status(httpStatus.OK).send({ results: s3PutObject });
});

export const getFestivalPoster = catchAsync(async (req, res) => {
  // get images from emoji folder of s3 bucket
  const s3PutObject = await s3Service.getImagesFromFolder("Festivallist/");
  return res.status(httpStatus.OK).send({ results: s3PutObject });
});

export const getFrames = catchAsync(async (req, res) => {
  // get images from emoji folder of s3 bucket
  const s3PutObject = await s3Service.getImagesFromFolder("frames/");
  return res.status(httpStatus.OK).send({ results: s3PutObject });
});
