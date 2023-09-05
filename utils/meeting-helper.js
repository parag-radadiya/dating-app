import httpStatus from 'http-status';
import { logger } from 'config/logger';
import { MeetingPayloadEnum } from '../models/enum.model';
import { roomService } from '../services';
import ApiError from './ApiError';

export function sendMessage(socket, payload) {
  socket.send(JSON.stringify(payload));
}

export async function broadcastUsers(roomId, socket, meetingServer, payload) {
  socket.broadcast.emit('message', JSON.stringify(payload));
}

export async function addUser(socket, { roomId, userId }) {
  const room = await roomService.getRoomById(roomId);
  if (!room) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'no room found with this id');
  }

  if (room.isRoomTypeIsVideoCall) {
    // we have to check available member in call and if available member is more the two then use can not join this video call
    // todo : we have to check this one and update according to our requirement
    // if (room.users.length >= 2) {
    //   throw new ApiError(httpStatus.BAD_REQUEST, 'video call has already two user. please join another call');
    // }
    // we have to make function for join user in meeting. currently we are doing code in below
  }

  // if user already in room then we to throw error and user endTime is not available
  // eslint-disable-next-line eqeqeq
  const result = room.users.find((data) => data.userId == userId.toString());
  if (result) {
    logger.info('user already part of meet');
    return room;
  }

  console.log(' === variable === userId ==> ', userId);

  return roomService.updateRoom(
    { _id: roomId },
    {
      $addToSet: { users: { userId, userCallStartTime: Date.now() } },
    }
  );
}

export async function joinRoom(roomId, socket, meetingServer, payload) {
  const { userId, name } = payload.data;

  const room = await roomService.isRoomPresent(roomId);

  if (!room) {
    sendMessage(socket, {
      type: MeetingPayloadEnum.NOT_FOUND,
    });
  }

  const result = await addUser(socket, { roomId, userId });
  if (result) {
    sendMessage(socket, {
      type: MeetingPayloadEnum.JOIN_MEETING,
      data: {
        userId,
      },
    });

    broadcastUsers(roomId, socket, meetingServer, {
      type: MeetingPayloadEnum.USER_JOINED,
      data: {
        userId,
        name,
        ...payload.data,
      },
    });
  }
}

export async function forwardConnectionRequest(roomId, socket, meetingServer, payload) {
  const { userId, name } = payload.data;
  const room = await roomService.getRoomById(roomId);
  if (!room) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'no room found with this id');
  }
  const sendPayload = JSON.stringify({
    type: MeetingPayloadEnum.CONNECTION_REQUEST,
    data: {
      userId,
      name,
      ...payload.data,
    },
  });

  meetingServer.to(room.socketId).emit('message', sendPayload);
}

export async function forwardIceCandidate(roomId, socket, meetingServer, payload) {
  const { userId, candidate } = payload.data;
  const room = await roomService.getRoomById(roomId);
  if (!room) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'no room found with this id');
  }
  const sendPayload = JSON.stringify({
    type: MeetingPayloadEnum.ICECANDIDATE,
    data: {
      userId,
      candidate,
    },
  });

  meetingServer.to(room.socketId).emit('message', sendPayload);
}

export async function forwardOfferSDP(roomId, socket, meetingServer, payload) {
  const { userId, sadp } = payload.data;
  const room = await roomService.getRoomById(roomId);
  if (!room) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'no room found with this id');
  }
  const sendPayload = JSON.stringify({
    type: MeetingPayloadEnum.OFFER_SDP,
    data: {
      userId,
      sadp,
    },
  });

  meetingServer.to(room.socketId).emit('message', sendPayload);
}

export async function forwardAnswerSDP(roomId, socket, meetingServer, payload) {
  const { userId, sadp } = payload.data;
  const room = await roomService.getRoomById(roomId);
  if (!room) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'no room found with this id');
  }
  const sendPayload = JSON.stringify({
    type: MeetingPayloadEnum.ANSWER_SDP,
    data: {
      userId,
      sadp,
    },
  });

  meetingServer.to(room.socketId).emit('message', sendPayload);
}

export async function userLeft(roomId, socket, meetingServer, payload) {
  const { userId } = payload.data;

  broadcastUsers(roomId, socket, meetingServer, {
    type: MeetingPayloadEnum.USER_LEFT,
    data: {
      userId,
    },
  });
}

export async function endMeeting(roomId, socket, meetingServer, payload) {
  const { userId } = payload.data;

  broadcastUsers(roomId, socket, meetingServer, {
    type: MeetingPayloadEnum.END_MEETING,
    data: {
      userId,
    },
  });

  const room = await roomService.getRoomById(roomId);
  if (!room) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'no room found with this id');
  }

  // eslint-disable-next-line
  room.users.map((userData) => {
    meetingServer.socket.connected[room.socketId].disconnect();
  });
}

export async function forwardEvent(roomId, socket, meetingServer, payload) {
  const { userId } = payload.data;

  broadcastUsers(roomId, socket, meetingServer, {
    type: payload.type,
    data: {
      userId,
      ...payload.data,
    },
  });

  const room = await roomService.getRoomById(roomId);
  if (!room) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'no room found with this id');
  }

  // eslint-disable-next-line
  room.users.map((userData) => {
    meetingServer.socket.connected[room.socketId].disconnect();
  });
}
