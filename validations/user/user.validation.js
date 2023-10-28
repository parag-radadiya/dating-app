import Joi from 'joi';
import enumFields from 'models/enum.model';

Joi.objectId = require('joi-objectid')(Joi);

const codesEmbed = Joi.object().keys({
  code: Joi.string(),
  expirationDate: Joi.date(),
  used: Joi.bool(),
  codeType: Joi.string().valid(...Object.values(enumFields.EnumCodeTypeOfCode)),
});
const facebookProviderEmbed = Joi.object().keys({
  id: Joi.string(),
  token: Joi.string(),
});
const googleProviderEmbed = Joi.object().keys({
  id: Joi.string(),
  token: Joi.string(),
});
const appleProviderEmbed = Joi.object().keys({
  id: Joi.string(),
  token: Joi.string(),
});
const githubProviderEmbed = Joi.object().keys({
  id: Joi.string(),
  token: Joi.string(),
});
export const createUser = {
  body: Joi.object().keys({
    name: Joi.string(),
    email: Joi.string().email(),
    role: Joi.string().valid(...Object.values(enumFields.EnumRoleOfUser)),
    codes: Joi.array().items(codesEmbed),
    password: Joi.string(),
    bio: Joi.string(),
    facebookProvider: facebookProviderEmbed,
    googleProvider: googleProviderEmbed,
    appleProvider: appleProviderEmbed,
    githubProvider: githubProviderEmbed,
    appLanguage: Joi.string().valid(...Object.values(enumFields.EnumAppLanguage)),
  }),
};

export const updateUser = {
  body: Joi.object().keys({
    name: Joi.string(),
    email: Joi.string().email(),
    role: Joi.string().valid(...Object.values(enumFields.EnumRoleOfUser)),
    codes: Joi.array().items(codesEmbed),
    password: Joi.string(),
    facebookProvider: facebookProviderEmbed,
    googleProvider: googleProviderEmbed,
    appleProvider: appleProviderEmbed,
    githubProvider: githubProviderEmbed,
    bio: Joi.string(),
    appLanguage: Joi.string().valid(...Object.values(enumFields.EnumAppLanguage)),
  }),
  params: Joi.object().keys({
    userId: Joi.objectId().required(),
  }),
};

export const getUserById = {
  params: Joi.object().keys({
    userId: Joi.objectId().required(),
  }),
};

export const sendFollowingRequest = {
  body: Joi.object().keys({
    friend: Joi.objectId().required(),
    user: Joi.objectId().required(),
    status: Joi.string().valid(...Object.values(enumFields.EnumOfFriends)),
  }),
};

export const sendUnfollowingRequest = {
  body: Joi.object().keys({
    user: Joi.objectId().required(),
  }),
};

export const getFollowingUsers = {
  params: Joi.object().keys({
    userId: Joi.objectId().required(),
  }),
};

export const checkUserFollowingEachOther = {
  body: Joi.object().keys({
    friend: Joi.objectId().required(),
    user: Joi.objectId().required(),
  }),
};

export const geFollowerUsers = {
  params: Joi.object().keys({
    userId: Joi.objectId().required(),
  }),
};

export const deleteUserById = {
  params: Joi.object().keys({
    userId: Joi.objectId().required(),
  }),
};

export const getUser = {
  body: Joi.object().keys({}).unknown(true),
};

export const getAvailableTrainerForMeet = {
  body: Joi.object().keys({}).unknown(true),
  params: Joi.object().keys({
    userId: Joi.objectId().required(),
  }),
};
export const paginatedUser = {
  body: Joi.object().keys({}).unknown(true),
  query: Joi.object()
    .keys({
      page: Joi.number().default(1),
      limit: Joi.number().default(10).max(100),
    })
    .unknown(true),
};
