import express from 'express';
import { userController } from 'controllers/user';
import { userValidation } from 'validations/user';
import validate from 'middlewares/validate';

const router = express.Router();
router
  .route('/')
  /**
   * createUser
   * */
  .post(validate(userValidation.createUser), userController.create)
  /**
   * getUser
   * */
  .get(validate(userValidation.getUser), userController.list);
router
  .route('/paginated')
  /**
   * getUserPaginated
   * */
  .get(validate(userValidation.paginatedUser), userController.paginate);
router
  .route('/get-available-trainer-for-meet/:userId')
  /**
   * get-available-trainer-for-meet
   * */
  .get(validate(userValidation.getAvailableTrainerForMeet), userController.getAvailableTrainerForMeet);
router
  .route('/:userId')
  /**
   * updateUser
   * */
  .put(validate(userValidation.updateUser), userController.update)
  /**
   * deleteUserById
   * */
  .delete(validate(userValidation.deleteUserById), userController.remove)
  /**
   * getUserById
   * */
  .get(validate(userValidation.getUserById), userController.get);

router
  .route('/send-following-request')
  .post(validate(userValidation.sendFollowingRequest), userController.sendFollowingRequest);

router
  .route('/send-unfollowing-request')
  .post(validate(userValidation.sendUnfollowingRequest), userController.sendUnfollowingRequest);

router
  .route('/get-follower-following-count')
  .post(validate(userValidation.sendUnfollowingRequest), userController.getFollowingFollowerCount);

router
  .route('/get-following-users/:userId')
  .get(validate(userValidation.getFollowingUsers), userController.getFollowingUsers);

router
  .route('/check-user-following-each-other')
  .post(validate(userValidation.checkUserFollowingEachOther), userController.checkUserFollowingEachOther);

router
  .route('/get-follower-users/:userId')
  .get(validate(userValidation.geFollowerUsers), userController.geFollowerUsersController);
export default router;
