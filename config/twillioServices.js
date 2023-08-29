const twilio = require('twilio');
require('dotenv').config();

const accountSid = 'AC2601211d5cc249b20ef965d097d1b8ab';
const authToken = '35c0ef6c90b8c9379615e612e132ecaa';

const client = twilio(accountSid, authToken);

// +14254032633
const sendSms = (phone, message) => {
  client.messages
    .create({
      body: message,
      from: '+14254032633',
      to: `+91${phone}`,
    })
    .then((data) => console.log('message.sid ===', data.sid));
};

module.exports = sendSms;
