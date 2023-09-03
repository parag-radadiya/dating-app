import { MeetingPayloadEnum } from '../models/enum.model';

const meetingHelper = require('./meeting-helper');

export function parsesMessage(message) {
  try {
    const payload = JSON.parse(message);
    return payload;
  } catch (e) {
    return { type: MeetingPayloadEnum.UNKNOWN };
  }
}

export async function handleMessage(roomId, socket, message, meetingServer) {
  let payload = '';

  if (typeof message === 'string') {
    payload = parsesMessage(message);
  } else {
    payload = message;
  }
  switch (payload.type) {
    case MeetingPayloadEnum.JOIN_MEETING:
      meetingHelper.joinRoom(roomId, socket, meetingServer, payload);
      break;
    case MeetingPayloadEnum.CONNECTION_REQUEST:
      meetingHelper.forwardConnectionRequest(roomId, socket, meetingServer, payload);
      break;
    case MeetingPayloadEnum.OFFER_SDP:
      meetingHelper.forwardOfferSDP(roomId, socket, meetingServer, payload);
      break;
    case MeetingPayloadEnum.ICECANDIDATE:
      meetingHelper.forwardIceCandidate(roomId, socket, meetingServer, payload);
      break;
    case MeetingPayloadEnum.LEAVE_MEETING:
      meetingHelper.userLeft(roomId, socket, meetingServer, payload);
      break;
    case MeetingPayloadEnum.END_MEETING:
      meetingHelper.endMeeting(roomId, socket, meetingServer, payload);
      break;
    case MeetingPayloadEnum.VIDEO_TOGGLE:
    case MeetingPayloadEnum.AUDIO_TOGGLE:
      meetingHelper.forwardEvent(roomId, socket, meetingServer, payload);
      break;
    case MeetingPayloadEnum.UNKNOWN:
      break;
    default:
      break;
  }
}

export function listenMessage(roomId, socket, meetingServer) {
  socket.on('message', (message) => handleMessage(roomId, socket, message, meetingServer));
}

export function initMeetingServer(server) {
  // eslint-disable-next-line global-require
  const meetingServer = require('socket.io')(server);

  meetingServer.on('connection', (socket) => {
    const roomId = socket.handshake.query.id;
    listenMessage(roomId, socket, meetingServer);
  });
}
