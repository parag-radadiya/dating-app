import ApiError from 'utils/ApiError';
import httpStatus from 'http-status';
import { User, Friend } from 'models';
import _ from 'lodash';
import { notificationService } from './index';
import enumModel from '../models/enum.model';

export async function getUserById(id, options = {}) {
  const user = await User.findById(id, options.projection, options);
  return user;
}

export async function getOne(query, options = {}) {
  const user = await User.findOne(query, options.projection, options);
  return user;
}

export async function getUserList(filter, options = {}) {
  const user = await User.find(filter, options.projection, options);
  return user;
}

export async function findExistingFollower(filter) {
  const friend = await Friend.findOne(filter);
  return friend;
}

export async function incrementCoinInUser(filter, incNum) {
  const updatedUser = await User.findOneAndUpdate(
    filter,
    {
      $inc: {
        coin: incNum,
      },
    },
    {
      new: true,
    }
  );
  return updatedUser;
}

export async function sendFollowingRequest(body) {
  const friend = await Friend.create(body);
  return friend;
}

export async function sendUnfollowingRequest(filter, body) {
  return Friend.findOneAndUpdate(filter, body, { new: true });
}

export async function findFrdDetails(filter) {
  return Friend.find(filter);
}

export async function getFollowingUsers(body) {
  const friend = await Friend.find({
    user: body.userId,
    status: enumModel.EnumOfFriends.FOLLOWING,
  })
    .populate('friend')
    .populate('user')
    .exec();
  return friend;
}

export async function getCountForFollowerAndFollowing(body) {
  const getFollowingDetails = await Friend.countDocuments({
    user: body.user,
    status: enumModel.EnumOfFriends.FOLLOWING,
  });

  const getFollowerDetails = await Friend.countDocuments({
    friend: body.user,
    status: enumModel.EnumOfFriends.FOLLOWING,
  });

  return { getFollowingDetails, getFollowerDetails };
}

export async function geFollowerUsers(body) {
  const friend = await Friend.find({
    friend: body.userId,
    status: enumModel.EnumOfFriends.FOLLOWING,
  })
    .populate('friend')
    .populate('user')
    .exec();
  return friend;
}

export async function getUserListWithPagination(filter, options = {}) {
  const user = await User.paginate(filter, options);
  return user;
}

export async function createUser(body) {
  const userData = await getOne({ mobileNumber: body.mobileNumber }, {});

  // if (userData.userRegistered) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, 'user already registered');
  // }

  let user;
  if (userData) {
    // throw new ApiError(httpStatus.BAD_REQUEST, 'Mobile number already taken');
    if (body.nickName) {
      const userDataForCheckNickName = await getOne({ nickName: body.nickName }, {});
      if (userDataForCheckNickName) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'nick name is already present');
      }

      // eslint-disable-next-line no-use-before-define
      user = updateUser({ mobileNumber: body.mobileNumber }, body, { userRegistered: true });
    }
  } else {
    user = await User.create(body);
  }
  return user;
}

export async function updateUser(filter, body, options = {}) {
  const userData = await getOne(filter, {});
  if (!userData) {
    throw new ApiError(httpStatus.NOT_FOUND, 'user not found');
  }
  // if (body.email && (await User.isEmailTaken(body.email, userData.id))) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  // }
  const user = await User.findOneAndUpdate(filter, body, options);
  return user;
}

export async function updateManyUser(filter, body, options = {}) {
  const user = await User.updateMany(filter, body, options);
  return user;
}

export async function removeUser(filter) {
  const user = await User.findOneAndRemove(filter);
  return user;
}

export async function removeManyUser(filter) {
  const user = await User.deleteMany(filter);
  return user;
}

export async function addDeviceToken(user, body) {
  const { deviceToken, platform } = body;
  const isFCMValid = notificationService.verifyFCMToken(deviceToken);
  if (!isFCMValid) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'The FCM Token is invalid!');
  }
  const deviceTokenList = user.deviceTokens.map((data) => data.deviceToken);
  if (_.indexOf(deviceTokenList, deviceToken) === -1) {
    user.deviceTokens.push({ deviceToken, platform });
    const updatedUser = await updateUser({ _id: user._id }, user);
    return updatedUser;
  }
}
