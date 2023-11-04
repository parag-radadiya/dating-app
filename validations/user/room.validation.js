import Joi from 'joi';
import enumFields from '../../models/enum.model';

Joi.objectId = require('joi-objectid')(Joi);

export const createRoom = {
  // todo : add validation here after creating proper api for calling functionality
  body: Joi.object().keys({
    mobileNumber: Joi.number().required(),
    isRoomTypeIsVideoCall: Joi.boolean().required(),
    roomType: Joi.string().valid(...Object.values(enumFields.EnumRoomType)),
  }),
};

export const getRoom = {
  // todo : add validation here after creating proper api for calling functionality
  params: Joi.object().keys({
    isRoomTypeIsVideoCall: Joi.boolean(),
  }),
};

export const getRoomHistory = {
  // todo : add validation here after creating proper api for calling functionality
  params: Joi.object().keys({
    userId: Joi.objectId().required(),
  }),
};

export const joinRoom = {
  // todo : add validation here after creating proper api for calling functionality
  body: Joi.object().keys({
    mobileNumber: Joi.number().required(),
  }),
  query: Joi.object().keys({
    roomId: Joi.objectId().required(),
  }),
};

export const getRoomById = {
  // todo : add validation here after creating proper api for calling functionality
  params: Joi.object().keys({
    roomId: Joi.objectId().required(),
  }),
};

export const updateRoom = {
  // todo : add validation here after creating proper api for calling functionality
  params: Joi.object().keys({
    roomId: Joi.objectId().required(),
  }),
  body: Joi.object().keys({
    userId: Joi.objectId(),
    roomStartTime: Joi.date(),
    roomEndTime: Joi.date(),
    bothUserJoined: Joi.boolean(),
  }),
};

export const getMessageById = {
  // todo : add validation here after creating proper api for calling functionality
  body: Joi.object().keys({
    loginUser: Joi.objectId().required(),
    otherUser: Joi.objectId().required(),
  }),
};

export const deleteMessageById = {
  body: Joi.object().keys({
    userId: Joi.objectId().required(),
    isDeleteTypeAll: Joi.boolean(),
    messageId: Joi.objectId().required(),
  }),
};

export const getAllMessageUser = {
  body: Joi.object().keys({
    userId: Joi.objectId().required(),
  }),
};

export const updateMessage = {
  body: Joi.object().keys({}),
};
