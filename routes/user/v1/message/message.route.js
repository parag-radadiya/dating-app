import express from 'express';
import { roomController } from 'controllers/user';
import { roomValidation } from 'validations/user';
import validate from 'middlewares/validate';

const router = express.Router();

router.route('/delete-message').post(validate(roomValidation.deleteMessageById), roomController.deleteMessage);

router.route('/update-message/:messageId').post(validate(roomValidation.updateMessage), roomController.updateMessage);

router.route('/message-user/:userId').post(validate(roomValidation.getAllMessageUser), roomController.getAllUser);
export default router;
