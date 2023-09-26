import Joi from 'joi';

Joi.objectId = require('joi-objectid')(Joi);

export const createEmoji = {
  body: Joi.object().keys({
    emojiUrl: Joi.string().required(),
    coin: Joi.number().required(),
  }),
};

export const getEmoji = {
  body: Joi.object().keys({}).unknown(true),
};
