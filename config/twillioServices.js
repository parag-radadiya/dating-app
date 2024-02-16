import config from './config';

const twilio = require('twilio');

const accountSid = config.twillio.sid;
const { authToken } = config.twillio;

const client = twilio(accountSid, authToken);

// +14254032633
const sendSms = async (phone, message) => {
  return client.messages.create({
    body: message,
    from: '+18287616963',
    to: `+91${phone}`,
  });
};

module.exports = sendSms;
