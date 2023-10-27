import httpStatus from 'http-status';
import { userService } from 'services';
import { catchAsync } from 'utils/catchAsync';
import { pick } from '../../utils/pick';
import { EnumRoleOfUser } from '../../models/enum.model';
import ApiError from '../../utils/ApiError';

export const get = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const filter = {
    _id: userId,
  };
  const options = {};
  const user = await userService.getOne(filter, options);
  return res.status(httpStatus.OK).send({ results: user });
});

export const list = catchAsync(async (req, res) => {
  const filter = {};
  const options = {};
  const user = await userService.getUserList(filter, options);
  return res.status(httpStatus.OK).send({ results: user });
});

export const sendFollowingRequest = catchAsync(async (req, res) => {
  const options = {};
  const { user, friend } = req.body;
  const getExistingFriendOrNot = await userService.findExistingFollower({
    user,
    friend,
  });
  if (getExistingFriendOrNot) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'user already following other user');
  }
  const getFriend = await userService.sendFollowingRequest(req.body, options);
  return res.status(httpStatus.OK).send({ results: getFriend });
});

export const getFollowingUsers = catchAsync(async (req, res) => {
  const options = {};
  const friend = await userService.getFollowingUsers(req.params, options);
  return res.status(httpStatus.OK).send({ results: friend });
});

export const geFollowerUsersController = catchAsync(async (req, res) => {
  const options = {};
  const friend = await userService.geFollowerUsers(req.params, options);
  return res.status(httpStatus.OK).send({ results: friend });
});

export const getAvailableTrainerForMeet = catchAsync(async (req, res) => {
  const filter = {
    role: EnumRoleOfUser.TRAINER,
    availableForMeet: true,
    _id: { $ne: req.params.userId },
  };
  const options = {};
  const user = await userService.getUserList(filter, options);
  return res.status(httpStatus.OK).send({ results: user });
});
export const paginate = catchAsync(async (req, res) => {
  const { query } = req;
  const sortingObj = pick(query, ['sort', 'order']);
  const sortObj = {
    [sortingObj.sort]: sortingObj.order,
  };
  const filter = {};
  const options = {
    sort: sortObj,
    ...pick(query, ['limit', 'page']),
  };
  const user = await userService.getUserListWithPagination(filter, options);
  return res.status(httpStatus.OK).send({ results: user });
});

export const create = catchAsync(async (req, res) => {
  const { body } = req;
  const options = {};
  const user = await userService.createUser(body, options);
  return res.status(httpStatus.CREATED).send({ results: user });
});

export const update = catchAsync(async (req, res) => {
  const { body } = req;
  const { userId } = req.params;
  const filter = {
    _id: userId,
  };
  const options = { new: true };
  const user = await userService.updateUser(filter, body, options);
  return res.status(httpStatus.OK).send({ results: user });
});

export const remove = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const filter = {
    _id: userId,
  };
  const user = await userService.removeUser(filter);
  return res.status(httpStatus.OK).send({ results: user });
});
