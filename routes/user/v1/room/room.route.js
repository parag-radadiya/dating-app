import express from 'express';
import { roomController } from 'controllers/user';
import { roomValidation } from 'validations/user';
import validate from 'middlewares/validate';
// import auth from 'middlewares/auth';

const router = express.Router();
router
  .route('/')
  /**
   * create room2
   * */
  .post(
    // auth('user'), // todo : add after flow completed
    validate(roomValidation.createRoom),
    roomController.create
  )
  /**
   * get all rooms
   * */
  .get(
    // auth('user'),
    validate(roomValidation.getRoom),
    roomController.list
  );

router
  .route('/getAvailableAudioRoom')
  /**
   * createTest
   * */
  .get(
    // auth('user'),
    validate(roomValidation.getRoom),
    roomController.getAvailableAudioRoomForMeet
  );

router
  .route('/join-room/:roomId')
  /**
   * createTest
   * */
  .post(
    // auth('user'), // todo : add after flow completed
    validate(roomValidation.joinRoom),
    roomController.joinRoom
  );

router
  .route('/message')
  /**
   * get last 100 messages
   * */
  .post(
    // auth('user'), // todo : add after flow completed
    validate(roomValidation.getMessageById),
    roomController.getMessage
  );

router
  .route('/:roomId')
  /**
   * createTest
   * */
  .get(
    // auth('user'), // todo : add after flow completed
    validate(roomValidation.getRoomById),
    roomController.get
  );

export default router;
