import express from 'express';
import validate from 'middlewares/validate';
import { authValidation } from 'validations/user';
import { authController } from 'controllers/user';

const router = express.Router();
/**
 * If User is successfully signup and Verified OTP then can login with Credential.
 */
router.post('/login', validate(authValidation.login), authController.login);

module.exports = router;
