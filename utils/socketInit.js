import httpStatus from 'http-status';
import { logger } from '../config/logger';
import { roomService, userService } from '../services';
import ApiError from './ApiError';

// eslint-disable-next-line import/prefer-default-export
export function initMeetingServerBase(server) {
  try {
    // eslint-disable-next-line global-require
    const IO = require('socket.io')(server);

    IO.use((socket, next) => {
      if (socket.handshake.query) {
        const { callerId } = socket.handshake.query;
        // eslint-disable-next-line
        socket.user = callerId;
        next();
      }
    });

    IO.on('connection', (socket) => {
      console.log(socket.user, 'Connected');
      socket.join(socket.user);

      socket.on('makeCall', (data) => {
        console.log(' === makeCall room id data ===> ', data);
        const { calleeId, roomId, sdpOffer } = data;
        socket.to(calleeId).emit('newCall', {
          callerId: socket.user,
          sdpOffer,
          roomId,
        });
      });

      socket.on('answerCall', async (data) => {
        const { callerId, roomId, mobileNumber } = data;
        logger.info(`socket answerCall for roomId = ${roomId} and caller id ${callerId}`);
        const room = await roomService.getRoomById(roomId);
        if (!room) {
          throw new ApiError(httpStatus.BAD_REQUEST, 'no room found with this id');
        }
        const user = await userService.getOne({ mobileNumber });
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
        const result = room.users.find((userData) => user.id.toString() == userData.userId && !user.userCallEndTime);

        if (result) {
          throw new Error('user already part of meet');
        }

        await roomService.updateRoom(
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
          { mobileNumber },
          {
            availableForMeet: false,
          }
        );
        logger.info(`user data and room data updated for callerId:${callerId}`);

        const { sdpAnswer } = data;

        socket.to(callerId).emit('callAnswered', {
          callee: socket.user,
          sdpAnswer,
        });
      });

      socket.on('IceCandidate', (data) => {
        const { calleeId } = data;
        const { iceCandidate } = data;

        socket.to(calleeId).emit('IceCandidate', {
          sender: socket.user,
          iceCandidate,
        });
      });

      socket.on('endMeeting', async (data) => {
        const { callerId, roomId } = data;
        logger.info(`socket end meeting for roomId = ${roomId} and caller id ${callerId}`);
        socket.to(callerId).emit('userEndedMeeting', {
          callee: socket.user,
          callerId: data.callerId,
        });
        const room = await roomService.updateRoom(
          { _id: roomId },
          {
            roomEndTime: Date.now(),
          }
        );
        // todo : we have to update room user for availableForMeet true.
        await room.users.map(async (userDate) => {
          await userService.updateUser(
            { _id: userDate.userId },
            {
              availableForMeet: true,
            }
          );
        });
        logger.info('all user of this room updated for available for live video call');
      });
    });
  } catch (e) {
    console.log(' === error from server ===> ', e);
  }
}
