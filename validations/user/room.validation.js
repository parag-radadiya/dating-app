import Joi from 'joi';

Joi.objectId = require('joi-objectid')(Joi);

export const createRoom = {
  // todo : add validation here after creating proper api for calling functionality
  body: Joi.object().keys({
    mobileNumber: Joi.number().required(),
    isRoomTypeIsVideoCall: Joi.boolean().required(),
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

export const getMessageById = {
  // todo : add validation here after creating proper api for calling functionality
  body: Joi.object().keys({
    loginUser: Joi.objectId().required(),
    otherUser: Joi.objectId().required(),
  }),
};
