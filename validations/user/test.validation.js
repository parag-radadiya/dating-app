import Joi from 'joi';

Joi.objectId = require('joi-objectid')(Joi);

export const createTest = {
  body: Joi.object().keys({}),
};

export const updateTest = {
  body: Joi.object().keys({}),
  params: Joi.object().keys({
    testId: Joi.objectId().required(),
  }),
};

export const getTestById = {
  params: Joi.object().keys({
    testId: Joi.objectId().required(),
  }),
};

export const deleteTestById = {
  params: Joi.object().keys({
    testId: Joi.objectId().required(),
  }),
};

export const getTest = {
  body: Joi.object().keys({}).unknown(true),
};

export const paginatedTest = {
  body: Joi.object().keys({}).unknown(true),
  query: Joi.object()
    .keys({
      page: Joi.number().default(1),
      limit: Joi.number().default(10).max(100),
    })
    .unknown(true),
};
