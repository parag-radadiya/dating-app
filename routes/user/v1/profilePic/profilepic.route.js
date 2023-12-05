import express from 'express';
import { profileValidation } from 'validations/user';
import { profileController } from 'controllers/user';
import validate from 'middlewares/validate';

const router = express.Router();

router.route('/Creat-profilepic').post(validate(profileValidation.createProfilepic), profileController.create);

router.route('/get-profilepic').get(validate(profileValidation.getprofilrpic), profileController.list);

export default router;
