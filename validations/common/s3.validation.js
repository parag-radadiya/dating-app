import Joi from 'joi';

Joi.objectId = require('joi-objectid')(Joi);
// eslint-disable-next-line import/prefer-default-export
export const preSignedPutUrl = {
  body: Joi.object().keys({
    key: Joi.string().required(),
    contentType: Joi.string().required(),
  }),
};

export const uploadS3image = {
  body: Joi.object().keys({
    url: Joi.string().required(),
    key: Joi.string().required(),
  }),
};
