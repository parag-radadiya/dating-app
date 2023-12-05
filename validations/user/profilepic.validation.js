import Joi from 'joi';

Joi.objectId = require('joi-objectid')(Joi);

export const createProfilepic = {
  body: Joi.object().keys({
    Url: Joi.string().required(),
  }),
};

export const getprofilrpic = {
  body: Joi.object().keys({}).unknown(true),
};
