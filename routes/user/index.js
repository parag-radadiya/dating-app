import express from 'express';
import userRoutes from './v1/user/user.route';
import testRoutes from './v1/test/test.route';
import authRoutes from './v1/auth/auth.route';
import roomRoutes from './v1/room/room.route';
import emojiRoutes from './v1/emoji/emoji.route';

const router = express.Router();
router.use('/user', userRoutes);
router.use('/test', testRoutes);
router.use('/auth', authRoutes);
router.use('/room', roomRoutes);
router.use('/emoji', emojiRoutes);

module.exports = router;
