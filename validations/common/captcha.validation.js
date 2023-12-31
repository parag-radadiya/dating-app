const Joi = require('joi');
const validateCaptcha = require('../../config/captcha');
/**
 * https://joi.dev/api/?v=17.6.1#extendextensions
 * @param value
 * @returns {Promise<*>}
 */
const captchaValidate = async (value) => {
  return validateCaptcha(value)
    .then((response) => {
      if (!response) {
        throw new Error('Invalid Captcha');
      }
      return value;
    })
    .catch((error) => {
      throw new Joi.ValidationError(
        error.message,
        [
          {
            message: error.message,
          },
        ],
        {}
      );
    });
};
module.exports = {
  captchaValidate,
};
