const EnumCodeTypeOfCode = {
  RESETPASSWORD: 'resetPassword',
  LOGIN: 'login',
};
const EnumRoleOfUser = {
  USER: 'user',
  ADMIN: 'admin',
  TRAINER: 'trainer',
};

const EnumTransactionType = {
  CREDIT: 'credit',
  DEBIT: 'debit',
  CALL_AMOUNT: 'call_amount',
};

const EnumRoomType = {
  TRAINER: 'trainer',
  CHAT: 'chat',
};

const EnumPlatformOfDeviceToken = {
  ANDROID: 'android',
  IOS: 'ios',
  WEB: 'web',
};
const EnumTypeOfToken = {
  RESET_PASSWORD: 'resetPassword',
  VERIFY_EMAIL: 'verifyEmail',
  REFRESH: 'refresh',
};

const MeetingPayloadEnum = {
  JOIN_MEETING: 'join-meeting',
  JOINED_MEETING: 'joined-meeting',
  USER_JOINED: 'user-joined',
  CONNECTION_REQUEST: 'connection-request',
  INCOMING_CONNECTION_REQUEST: 'incoming-connection-request',
  OFFER_SDP: 'offer-sdp',
  ANSWER_SDP: 'answer-sdp',
  END_MEETING: 'end-meeting',
  USER_LEFT: 'user-left',
  MEETING_ENDED: 'meeting-ended',
  ICECANDIDATE: 'icecadidate',
  VIDEO_TOGGLE: 'video-toggle',
  AUDIO_TOGGLE: 'audio-toggle',
  NOT_FOUND: 'not-found',
  LEAVE_MEETING: 'leave -meeting',
  UNKNOWN: 'unknown',
};

module.exports = {
  EnumCodeTypeOfCode,
  EnumRoleOfUser,
  EnumPlatformOfDeviceToken,
  EnumTypeOfToken,
  MeetingPayloadEnum,
  EnumTransactionType,
  EnumRoomType,
};
