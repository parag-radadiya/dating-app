import httpStatus from 'http-status';
import { coinPalnService, traansactionService, userService } from 'services';
import { catchAsync } from 'utils/catchAsync';
import { pick } from '../../utils/pick';
import enumModel, { EnumRoleOfUser, EnumTransactionType } from '../../models/enum.model';
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

export const sendBlockRequest = catchAsync(async (req, res) => {
  const options = {};
  const { user, friend } = req.body;
  const getExistingFriendOrNot = await userService.findExistingFollower({
    user,
    friend,
  });
  let getFriend;
  if (getExistingFriendOrNot) {
    getFriend = await userService.sendUnfollowingRequest(
      {
        _id: getExistingFriendOrNot._id,
      },
      {
        status: enumModel.EnumOfFriends.BLOCKED,
      }
    );
  }
  getFriend = await userService.sendFollowingRequest(req.body, options);
  return res.status(httpStatus.OK).send({ results: getFriend });
});

export const blockedByUser = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const friend = await userService.findFrdDetails({
    user: userId,
    status: enumModel.EnumOfFriends.BLOCKED,
  });
  return res.status(httpStatus.OK).send({ results: friend });
});

export const blockedByOtherUser = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const friend = await userService.findFrdDetails({
    friend: userId,
    status: enumModel.EnumOfFriends.BLOCKED,
  });
  return res.status(httpStatus.OK).send({ results: friend });
});

export const getCoinPlan = catchAsync(async (req, res) => {
  const getPlans = await coinPalnService.getCoinPlanList({});
  return res.status(httpStatus.OK).send({ results: getPlans });
});

export const addCoinPlans = catchAsync(async (req, res) => {
  const createPlan = await coinPalnService.createCoinPlan(req.body);
  return res.status(httpStatus.OK).send({ results: createPlan });
});

export const getTransaction = catchAsync(async (req, res) => {
  const { userId } = req.params;

  const getTransactions = await traansactionService.getTransactionList(
    {
      $or: [{ receiverUserId: userId }, { senderUserId: userId }],
    },
    { sort: 'createdAt', limit: 50 }
  );
  return res.status(httpStatus.OK).send({ results: getTransactions });
});

export const withdrawalTransaction = catchAsync(async (req, res) => {
  const { userId } = req.params;

  const createTransactions = await traansactionService.createTransaction({
    coinAmount: req.body.coinAmount,
    createdBy: userId,
    updatedBy: userId,
    transactionType: EnumTransactionType.SUBMIT_WITHDRAWAL_REQUEST,
  });
  return res.status(httpStatus.OK).send({ results: createTransactions });
});

export const addCoinToUser = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const { amount } = req.body;
  const updateCoinInUser = await userService.incrementCoinInUser({ _id: userId }, amount);
  return res.status(httpStatus.OK).send({ results: updateCoinInUser });
});

export const sendUnfollowingRequest = catchAsync(async (req, res) => {
  const { user, friend } = req.body;
  const getExistingFriendOrNot = await userService.findExistingFollower({
    user,
    friend,
  });

  if (!getExistingFriendOrNot || getExistingFriendOrNot.status !== enumModel.EnumOfFriends.FOLLOWING) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'users are not following each other');
  }
  const getFriend = await userService.sendUnfollowingRequest(
    {
      user,
      friend,
    },
    {
      status: enumModel.EnumOfFriends.UNFOLLOW,
    }
  );
  return res.status(httpStatus.OK).send({ results: getFriend });
});

export const getFollowingFollowerCount = catchAsync(async (req, res) => {
  const { user } = req.body;
  const followingDetails = await userService.getCountForFollowerAndFollowing({
    user,
    status: enumModel.EnumOfFriends.FOLLOWING,
  });
  return res.status(httpStatus.OK).send({ results: followingDetails });
});

export const getFollowingUsers = catchAsync(async (req, res) => {
  const options = {};
  const friend = await userService.getFollowingUsers(req.params, options);
  return res.status(httpStatus.OK).send({ results: friend });
});
export const checkUserFollowingEachOther = catchAsync(async (req, res) => {
  const friend = await userService.findFrdDetails(req.body);
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

export const getWithdrawalRequestController = catchAsync(async (req, res) => {
  const Withdrawal = await traansactionService.submitWithdrawalRequest();
  return res.status(httpStatus.OK).send({ results: Withdrawal });
});
