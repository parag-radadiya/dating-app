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
  body: Joi.object().keys({}).unknown(true),
};

export const joinRoom = {
  // todo : add validation here after creating proper api for calling functionality
  body: Joi.object().keys({
    mobileNumber: Joi.number().required(),
  }),
  params: Joi.object().keys({
    roomId: Joi.objectId().required(),
  }),
};
