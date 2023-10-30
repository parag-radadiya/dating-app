import httpStatus from 'http-status';
import { messageService, roomService, userService } from 'services';
import { catchAsync } from 'utils/catchAsync';
import { pick } from '../../utils/pick';
import ApiError from '../../utils/ApiError';

const axios = require('axios');

export const get = catchAsync(async (req, res) => {
  const { roomId } = req.params;
  const filter = {
    _id: roomId,
  };
  const options = {};
  const room = await roomService.getOne(filter, options);
  return res.status(httpStatus.OK).send({ results: room });
});

export const getMessage = catchAsync(async (req, res) => {
  const { loginUser, otherUser } = req.body;
  const sendMessage = await messageService.getLastHundreadMessageList(
    {
      from: { $in: [loginUser, otherUser] },
      to: { $in: [loginUser, otherUser] },
      messageDeletedAll: false,
    },
    { sort: 'createdAt', limit: 100 }
  );
  return res.status(httpStatus.OK).send({ results: sendMessage });
});

export const list = catchAsync(async (req, res) => {
  const filter = {};
  const options = {};
  const room = await roomService.getRoomList(filter, options);
  return res.status(httpStatus.OK).send({ results: room });
});

export const getRoomHistory = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const filter = {
    users: {
      $elemMatch: {
        userId,
      },
    },
  };
  const room = await roomService.getRoomWithPopulateUserData(filter);
  return res.status(httpStatus.OK).send({ results: room });
});

export const updateMessage = catchAsync(async (req, res) => {
  const { body } = req;
  const { messageId } = req.params;
  const filter = {
    _id: messageId,
  };

  const options = { new: true };
  const message = await messageService.updateMessage(filter, body, options);
  return res.status(httpStatus.OK).send({ results: message });
});

export const getAllUser = catchAsync(async (req, res) => {
  const { userId } = req.params;

  const filter = { _id: { $ne: userId } };

  const user = await userService.getUserList(filter);

  return res.status(httpStatus.OK).send({ results: user });
});

export const deleteMessage = catchAsync(async (req, res) => {
  const { isDeleteTypeAll, userId } = req.body;
  const { messageId } = req.body;
  console.log('message id ===', messageId);
  const filter = {
    _id: messageId,
  };
  const body = {
    messageDeleted: true,
    ...(isDeleteTypeAll && {
      $addToSet: {
        deleteMessageFromUser: userId,
      },
    }),
  };
  // find id and add true field che
  if (isDeleteTypeAll) {
    body.messageDeleted = true;
    body.messageDeletedAll = true;
    if (!userId) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'user id required for delete for all message');
    }
    await messageService.updateMessage(filter, body);
  } else {
    await messageService.updateMessage(filter, body);
  }

  return res.status(httpStatus.OK).send({ results: 'ok' });
});
export const getAvailableAudioRoomForMeet = catchAsync(async (req, res) => {
  // const { isRoomTypeIsVideoCall } = req.query;
  const filter = {
    roomEndTime: { $exists: false },
  };
  // if (isRoomTypeIsVideoCall) {
  //   filter.isRoomTypeIsVideoCall = isRoomTypeIsVideoCall;
  // } else {
  //   filter.isRoomTypeIsVideoCall = false;
  // }
  const room = await roomService.getRoomWithPopulateUserData(filter);
  return res.status(httpStatus.OK).send({ results: room });
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
  const room = await roomService.getRoomListWithPagination(filter, options);
  return res.status(httpStatus.OK).send({ results: room });
});

export const create = catchAsync(async (req, res) => {
  const { body } = req;
  // body.createdBy = req.user;
  // body.updatedBy = req.user;

  const user = await userService.getOne({ mobileNumber: body.mobileNumber });

  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'no user found with this id');
  }

  if (user.availableForMeet && !user.availableForMeet) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'user is not available for meet');
  }

  const channelName = `${user._id}-${Date.now()}`; // Replace 'your_channel_name' with the desired channel name

  // create channel name here
  const apiUrl = `https://agora-node-tokenserver.testingdata.repl.co/access_token?channelName=${channelName}`;
  const agoraToken = await axios.get(apiUrl);

  const createRoomObj = {
    updatedBy: user.id,
    createdBy: user.id,
    isRoomTypeIsVideoCall: body.isRoomTypeIsVideoCall,
    roomType: body.roomType,
    userIdThatStartCall: user.id,
    agoraToken: agoraToken.data.token,
    channelName,
    users: [
      {
        userId: user.id,
        mobileNumber: user.mobileNumber,
        userCallStartTime: new Date(),
      },
    ],
  };

  const room = await roomService.createRoom(createRoomObj);

  const getUpdatedUser = await userService.updateUser(
    { mobileNumber: body.mobileNumber },
    {
      availableForMeet: false,
    }
  );
  return res.status(httpStatus.CREATED).send({
    results: {
      room,
      user: getUpdatedUser,
    },
  });
});

export const update = catchAsync(async (req, res) => {
  const { body } = req;
  body.updatedBy = req.user;
  const { roomId } = req.params;
  const filter = {
    _id: roomId,
  };
  const options = { new: true };
  const room = await roomService.updateRoom(filter, body, options);
  return res.status(httpStatus.OK).send({ results: room });
});

export const joinRoom = catchAsync(async (req, res) => {
  const { roomId } = req.params;

  const room = await roomService.getRoomById(roomId);
  if (!room) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'no room found with this id');
  }

  const user = await userService.getOne({ mobileNumber: req.body.mobileNumber });
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'no user found with this id');
  }

  if (room.isRoomTypeIsVideoCall) {
    // we have to check available member in call and if available member is more the two then use can not join this video call
    if (room.users.length >= 2) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'video call has already two user. please join another call');
    }
    // we have to make function for join user in meeting. currently we are doing code in below
  }

  // if user already in room then we to throw error and user endTime is not available
  // eslint-disable-next-line eqeqeq
  const result = room.users.find((data) => user.id.toString() == data.userId && !user.userCallEndTime);

  if (result) {
    throw new Error('user already part of meet');
  }

  const getUpdateRoom = await roomService.updateRoom(
    { _id: roomId },
    {
      roomStartTime: Date.now(),
      $addToSet: { users: { userId: user.id, userCallStartTime: Date.now(), mobileNumber: user.mobileNumber } },
    },
    {
      new: true,
      populate: {
        path: 'users.userID',
        model: 'User',
      },
    }
  );

  await userService.updateUser(
    { mobileNumber: req.body.mobileNumber },
    {
      availableForMeet: false,
    }
  );

  return res.status(httpStatus.OK).send({ results: getUpdateRoom });
});
export const remove = catchAsync(async (req, res) => {
  const { roomId } = req.params;
  const filter = {
    _id: roomId,
  };
  const room = await roomService.removeRoom(filter);
  return res.status(httpStatus.OK).send({ results: room });
});
