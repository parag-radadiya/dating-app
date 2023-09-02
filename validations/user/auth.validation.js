import Joi from 'joi';
import enumFields from 'models/enum.model';
import config from '../../config/config';

export const register = {
  body: Joi.object().keys({
    // email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string(),
    nickName: Joi.string().required(),
    dateOfBirth: Joi.string(),
    mobileNumber: Joi.number().required(),
    gender: Joi.string(),
  }),
};

export const login = {
  body: Joi.object().keys({
    mobileNumber: Joi.number().required(),
    password: Joi.string().required(),
    deviceToken: Joi.string().allow(''),
  }),
};

export const verifyEmail = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

export const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

export const verifyOtp = {
  body: Joi.object().keys({
    mobileNumber: Joi.number().required(),
    otp: Joi.number().required(),
  }),
};

// Token-based Verification when user select forgotPassword
export const verifyCode = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    code: Joi.string().length(config.jwt.resetPasswordCodeSize).required(),
  }),
};

export const addTokensToUser = {
  body: Joi.object().keys({
    accessToken: Joi.string().required(),
    refreshToken: Joi.string().required(),
  }),
};

export const resetPassword = {
  body: Joi.object().keys({
    password: Joi.string().required(),
    email: Joi.string().email().required(),
    code: Joi.string().required(),
  }),
};

export const resetPasswordOtp = {
  body: Joi.object().keys({
    password: Joi.string().required(),
    email: Joi.string().email().required(),
    otp: Joi.number().required(),
  }),
};

export const resetPasswordOtpVerify = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    otp: Joi.number().required(),
  }),
};

// Token-based resetPassword validation
export const resetPasswordToken = {
  body: Joi.object().keys({
    password: Joi.string().required(),
    email: Joi.string().email().required(),
    code: Joi.string().length(config.jwt.resetPasswordCodeSize).required(),
  }),
};

export const changePassword = {
  body: Joi.object().keys({
    password: Joi.string().required(),
  }),
};

export const sendVerifyEmail = {
  body: Joi.object().keys({
    mobileNumber: Joi.number().required(),
  }),
};

export const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

export const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
    deviceToken: Joi.string(),
  }),
};

export const googleLogin = {
  body: Joi.object().keys({
    access_token: Joi.string().required(),
  }),
};

export const faceBookLogin = {
  body: Joi.object().keys({
    access_token: Joi.string().required(),
  }),
};

export const appleLogin = {
  body: Joi.object().keys({
    access_token: Joi.string().required(),
  }),
};

export const githubLogin = {
  body: Joi.object().keys({
    access_token: Joi.string().required(),
  }),
};

export const createDeviceToken = {
  body: Joi.object().keys({
    deviceToken: Joi.string(),
    platform: Joi.string().valid(...Object.values(enumFields.EnumPlatformOfDeviceToken)),
  }),
};

export const updateDeviceToken = {
  body: Joi.object().keys({
    deviceToken: Joi.string().required(),
  }),
};
