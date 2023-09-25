import express from 'express';
import auth from 'middlewares/auth';
import validate from 'middlewares/validate';
import { s3Controller } from 'controllers/common';
import { s3Validation } from 'validations/common';

const router = express();
/**
 * Create pre-signed url Api
 * */
router.post('/presignedurl', auth(), validate(s3Validation.preSignedPutUrl), s3Controller.preSignedPutUrl);

router.post('/upload-s3-image', validate(s3Validation.uploadS3image), s3Controller.uploadS3Image);
module.exports = router;
