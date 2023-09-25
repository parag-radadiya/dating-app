import Joi from 'joi';

Joi.objectId = require('joi-objectid')(Joi);

export const createEmoji = {
  body: Joi.object().keys({}),
};

export const getEmoji = {
  body: Joi.object().keys({}).unknown(true),
};
