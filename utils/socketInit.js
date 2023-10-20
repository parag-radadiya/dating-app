import httpStatus from 'http-status';
import { logger } from '../config/logger';
import { messageService, roomService, userService } from '../services';
import ApiError from './ApiError';
// import WebSocket from "ws";
// const WebSocket = require('ws');

// eslint-disable-next-line import/prefer-default-export
export function initMeetingServerBase(server) {
  try {
    // eslint-disable-next-line global-require
    const IO = require('socket.io')(server);
    // const wss = new WebSocket.Server({ server });

    // console.log(' === variable === > ', IO);
    IO.use((socket, next) => {
      if (socket.handshake.query) {
        const { callerId } = socket.handshake.query;
        // eslint-disable-next-line
        socket.user = callerId;
        next();
      }
    });

    IO.on('connection', async (socket) => {
      logger.info(` socket user connected with mobile num ${socket}`);
      if (socket.user) {
        logger.info(`socket user ===> ${socket.user}`);
        await userService.updateUser(
          { mobileNumber: socket.user },
          {
            isUserOnline: true,
          }
        );
      }

      socket.on('socketUserOnline', async (mobileNumber) => {
        logger.info(` socket user online with mobile num ${JSON.stringify(mobileNumber.mobileNumber)}
         || ${mobileNumber.mobileNumber}`);
        if (mobileNumber) {
          await userService.updateUser(
            { mobileNumber: mobileNumber.mobileNumber },
            {
              isUserOnline: true,
            }
          );
        }
      });

      // todo : set user active in user table
      socket.join(socket.user);

      socket.on('makeCall', async (data) => {
        const { calleeId, roomId, sdpOffer, isRoomTypeIsVideoCall } = data;
        logger.info(
          `makeCall event calleeId:${calleeId} | roomId:${roomId} | sdpOffer:${sdpOffer} | isRoomTypeIsVideoCall:${isRoomTypeIsVideoCall}`
        );
        const room = await roomService.updateRoom(
          { _id: roomId },
          { sdpOffer },
          {
            new: true,
            populate: {
              path: 'users.userID',
              model: 'User',
            },
          }
        );

        const user = await userService.getOne({ mobileNumber: socket.user });

        console.log(' === calleeId === > ', calleeId);

        socket.to(calleeId).emit('newCall', {
          room,
          callerId: socket.user,
          sdpOffer,
          roomId,
          isRoomTypeIsVideoCall,
          user,
        });

        console.log(' === variable === > newCall event emitted ');
      });

      socket.on('join-another-user', async (data) => {
        const { calleeId, roomId, sdpOffer, isRoomTypeIsVideoCall } = data;
        logger.info(
          `calleeId:${calleeId} | roomId:${roomId} | sdpOffer:${sdpOffer} | isRoomTypeIsVideoCall:${isRoomTypeIsVideoCall}`
        );
        socket.to(calleeId).emit('newCall', {
          callerId: socket.user,
          sdpOffer,
          roomId,
          isRoomTypeIsVideoCall,
          ongoingCall: true,
        });
      });

      // socket.on('', async ( ) => {})

      socket.on('sendMessage', async (data) => {
        const { callerId, mobileNumber } = data;

        // check if receiving message user is active or not
        const getUserToSendMessage = await userService.getOne({ mobileNumber });
        if (!getUserToSendMessage) {
          throw new ApiError(httpStatus.NOT_FOUND, 'user not fount, please login back');
        }
        const getUserFromSendMessage = await userService.getOne({ mobileNumber: callerId });
        if (!getUserFromSendMessage) {
          throw new ApiError(httpStatus.NOT_FOUND, 'user not fount, please login back');
        }
        // create message
        const createMessageBody = {
          from: getUserFromSendMessage._id,
          to: getUserToSendMessage._id,
          message: data.message,
          sendAt: Date.now(),
        };
        await messageService.createMessage(createMessageBody);
        // get last 100 message
        const sendMessage = await messageService.getLastHundreadMessageList({
          from: { $in: [getUserToSendMessage._id, getUserFromSendMessage._id] },
          to: { $in: [getUserToSendMessage._id, getUserFromSendMessage._id] },
        });
        socket.emit('message', {
          callee: socket.user,
          sendMessage,
        });

        if (getUserToSendMessage.isUserOnline) {
          socket.to(callerId).emit('messageReceived', {
            callee: socket.user,
            sendMessage,
          });
        }
      });

      socket.on('answerCall', async (data) => {
        const { callerId, roomId, mobileNumber } = data;
        logger.info(`answerCall event callerId:${callerId} | roomId:${roomId} | mobileNumber:${mobileNumber}`);
        const room = await roomService.getRoomById(roomId);
        if (!room) {
          // throw new ApiError(httpStatus.BAD_REQUEST, 'no room found with this id');
        }
        const user = await userService.getOne({ mobileNumber });
        if (!user) {
          // throw new ApiError(httpStatus.BAD_REQUEST, 'no user found with this id');
        }

        if (room.isRoomTypeIsVideoCall) {
          // we have to check available member in call and if available member is more the two then use can not join this video call
          if (room.users.length >= 2) {
            // todo : need to handle error here
            throw new ApiError(httpStatus.BAD_REQUEST, 'video call has already two user. please join another call');
          }
          // we have to make function for join user in meeting. currently we are doing code in below
        }

        // if user already in room then we to throw error and user endTime is not available
        // eslint-disable-next-line eqeqeq
        const result = room.users.find((userData) => user.id.toString() == userData.userId && !user.userCallEndTime);

        if (!result) {
          logger.info('user already part of meet');
          // throw new Error('user already part of meet');
          await roomService.updateRoom(
            { _id: roomId },
            {
              roomStartTime: Date.now(),
              $addToSet: {
                users: {
                  userId: user.id,
                  userCallStartTime: Date.now(),
                  mobileNumber: user.mobileNumber,
                },
              },
            },
            {
              new: true,
              populate: {
                path: 'users.userID',
                model: 'User',
              },
            }
          );
        }

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

      socket.on('sendEmojiToTrainer', async (data) => {
        const { callerId, emojiData } = data;
        logger.info(`sendEmojiToTrainer event callerId:${callerId} `);

        // todo:
        socket.to(callerId).emit('sendEmojiToTrainerSide', {
          callee: socket.user,
          emojiData,
          ...data,
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

      socket.on('socketClose', async (mobileNumber) => {
        logger.info(` socket user disconnected with mobile num ${JSON.stringify(mobileNumber)}
         || ${mobileNumber.mobileNumber}`);
        if (mobileNumber) {
          await userService.updateUser(
            { mobileNumber: mobileNumber.mobileNumber },
            {
              isUserOnline: false,
            }
          );
        }
      });
    });
  } catch (e) {
    console.log(' === error from server ===> ', e);
  }
}

/*
 *  1. socket id store in user
 *  2. add active field in user table so we can check what user is active or inactive
 *  3. if user is active than we establise socket connection for both user
 *  4. user can send and recive message using socket connection and all mesaage are store in db from socket event
 *
 * */

/*
 *
 *  user last massage ( give last msg data from back end side )
 *  chat ( date and time )
 *  online and offline
 *  msg delete for every one and delete message from me
 *  nickname on call from chat
 *
 * */
