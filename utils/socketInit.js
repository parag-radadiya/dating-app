let IO;
// eslint-disable-next-line import/prefer-default-export
export function initMeetingServerBase(server) {
  try {
    // eslint-disable-next-line global-require
    IO = require('socket.io')(server);

    IO.use((socket, next) => {
      if (socket.handshake.query) {
        const { callerId } = socket.handshake.query;
        // eslint-disable-next-line
        socket.user = callerId;
        next();
      }
    });

    IO.on('connection', (socket) => {
      console.log(socket.user, 'Connected');
      socket.join(socket.user);

      socket.on('makeCall', (data) => {
        const { calleeId } = data;
        const { sdpOffer } = data;

        socket.to(calleeId).emit('newCall', {
          callerId: socket.user,
          sdpOffer,
        });
      });

      socket.on('answerCall', (data) => {
        const { callerId } = data;
        const { sdpAnswer } = data;

        socket.to(callerId).emit('callAnswered', {
          callee: socket.user,
          sdpAnswer,
        });
      });

      socket.on('IceCandidate', (data) => {
        const { calleeId } = data;
        const { iceCandidate } = data;

        socket.to(calleeId).emit('IceCandidate', {
          sender: socket.user,
          iceCandidate,
        });
      });

      socket.on('endMeeting', (data) => {
        const { callerId } = data;

        socket.to(callerId).emit('userEndedMeeting', {
          callee: socket.user,
          callerId: data.callerId,
        });
        // socket.disconnect();
      });
    });
  } catch (e) {
    console.log(' === error from server ===> ', e);
  }
}
