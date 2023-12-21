import AWS from "aws-sdk";
import multer from "multer";
import multerS3 from "multer-s3";
import config from 'config/config';

AWS.config = new AWS.Config({
    accessKeyId: config.aws.accessKeyId, // stored in the .env file
    secretAccessKey: config.aws.secretAccessKey, // stored in the .env file
    region: process.env.AWS_BUCKET_REGION, // This refers to your bucket configuration.
});
const s3 = new AWS.S3({ apiVersion: '2006-03-01', signatureVersion: 'v4' });

// multer s3 setup
export const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: config.aws.bucket + "/profilepic",
        // acl: 'public-read',
        contentType: multerS3.AUTO_CONTENT_TYPE
    }),

    limits: { fileSize: 1024 * 1024 * 2, files: 10 },
});

// Error handling
export const uploadError = (error, req, res, next) => {
    console.log("->>>>error", error)
    if (error instanceof multer.MulterError) {
        console.log("error", error.code);
        if (error.code === "LIMIT_FILE_SIZE") {
            return res.status(enums.HTTP_CODES.BAD_REQUEST).send({
                status: false,
                message: "LIMIT_FILE_SIZE MAX = 2 MB",
                error: "file is too large",
            });
        }

        if (error.code === "LIMIT_FILE_COUNT") {
            return res.status(enums.HTTP_CODES.BAD_REQUEST).send({
                status: false,
                message: "LIMIT_FILE_COUNT",
                error: "maximum file upload limit",
            });
        }

        if (error.code === "LIMIT_UNEXPECTED_FILE") {
            return res.status(enums.HTTP_CODES.BAD_REQUEST).send({
                status: false,
                message: "UNEXPECTED_FILE",
                error: "file-type not supported",
            });
        }
    }
    next()
};


export const uploadBase64 = (req, res, next) => {
    if (req.body.profileImage) {
        const base64Data = new Buffer.from(
            req.body.profileImage.replace(/^data:image\/\w+;base64,/, ""),
            "base64"
        );
        const type = req.body.profileImage.split(";")[0].split("/")[1];
        const params = {
            Bucket: config.aws.bucket + "/profilepic",
            Key: `${Date.now()}.${type}`,
            Body: base64Data,
            ACL: "public-read",
            ContentEncoding: "base64",
            ContentType: `image/${type}`,
        };
        s3.upload(params, (error, data) => {
            if (error) {
                console.log("error", error);
                return res.status(enums.HTTP_CODES.BAD_REQUEST).send({
                    status: false,
                    message: "S3 UPLOAD ERROR",
                    error: error,
                });
            }
            req.file = {
                location: data.Location,
                key: data.key,
            };
            next();
        });
    } else {
        next();
    }
}