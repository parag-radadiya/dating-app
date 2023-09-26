import express from 'express';
import { emojiController } from 'controllers/user';
import { emojiValidation } from 'validations/user';
import validate from 'middlewares/validate';

const router = express.Router();

router.post('/', validate(emojiValidation.createEmoji), emojiController.create);

router.get('/', validate(emojiValidation.getEmoji), emojiController.list);

export default router;
