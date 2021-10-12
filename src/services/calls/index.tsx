import { LocalStorageAuthKey } from 'services/Auth/Auth';
import { io, Socket } from 'socket.io-client';

export type TConnection = {
  id: string;
  connection: RTCPeerConnection;
};

const createConnection = async (): Promise<{
  connection: RTCPeerConnection;
  offer: RTCSessionDescriptionInit;
}> => {
  const newConnection = new RTCPeerConnection({
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
  });
  const offer = await newConnection.createOffer();

  await newConnection.setLocalDescription(new RTCSessionDescription(offer));

  return { connection: newConnection, offer };
};

export class PeerManager {
  socket: Socket;
  connections: TConnection[];
  roomName: string;

  private isCalling = false;
  private isInCall = false;

  private onTrackCallback?: (stream: MediaStream) => void;

  constructor(socket: Socket, roomName: string) {
    this.socket = socket;
    this.roomName = roomName;

    this.connections = [];
  }

  joinRoom(callback: (stream: MediaStream) => void): void {
    this.socket.emit('joinRoom', { room: this.roomName });
    this.onTrackCallback = callback;
  }

  async call(to: string, stream: MediaStream): Promise<void> {
    const { connection, offer } = await createConnection();

    stream.getTracks().forEach(track => {
      console.log('track: ', track);
      connection.addTrack(track, stream);
    });
    connection.ontrack = ({ streams: [newStream] }) =>
      this.onTrackCallback?.(newStream);

    this.connections.push({ connection, id: to });
    this.socket.emit('call', { to, offer });
  }

  onCallOffer(): void {
    this.socket.on('call-offer', async data => {
      if (this.isInCall) {
        this.socket.emit('call-reject', { from: data.socket });
        return;
      }

      let connection: TConnection = this.connections.filter(
        conn => conn.id === data.socket,
      )?.[0];

      if (!connection) {
        const { connection: newConnection } = await createConnection();
        newConnection.ontrack = ({ streams: [newStream] }) =>
          this.onTrackCallback?.(newStream);
        connection = { connection: newConnection, id: data.socket };
        this.connections.push(connection);
      }

      await connection.connection.setRemoteDescription(
        new RTCSessionDescription(data.offer),
      );

      const answer = await connection.connection.createAnswer();
      await connection.connection.setLocalDescription(
        new RTCSessionDescription(answer),
      );

      this.socket.emit('call-answer', { answer, to: data.socket });
      this.isInCall = true;
    });
  }

  onCallAnswer(callback?: (socketId: string) => void): void {
    this.socket.on('call-answer-made', async data => {
      const connection = this.connections.find(conn => conn.id === data.socket);

      await connection?.connection.setRemoteDescription(
        new RTCSessionDescription(data.answer),
      );

      if (!this.isCalling) {
        callback?.(data.socket);
        this.isCalling = true;
      }
    });
  }

  onCallReject(callback: (data: { socket: string }) => void): void {
    this.socket.on('call-reject-made', data => {
      callback(data);
    });
  }

  onTrack(callback: (stream: MediaStream) => void, id: string): void {
    const connection = this.connections.find(conn => conn.id === id);

    if (connection) {
      connection.connection.ontrack = ({ streams: [stream] }) => {
        console.log('stream: ', stream);
        callback(stream);
      };
    }
  }

  onUserRemove(callback: (socketId: string) => void): void {
    this.socket.on(`${this.roomName}-remove-user`, ({ socketId }) => {
      callback(socketId);
    });
  }

  onUserListUpdate(callback: (users: string[]) => void): void {
    this.socket.on(`${this.roomName}-update-user-list`, ({ users }) => {
      callback(users);
    });
  }
}

// export class PeerConnection {
//   socket: Socket;
//   peerConnection: RTCPeerConnection;
//   room = '';

//   private isCalling = false;
//   private isInCall = false;

//   private onConnected: (event: Event) => void = () => {};
//   private onDisconnected: (event: Event) => void = () => {};

//   constructor(socket: Socket, peerConnection: RTCPeerConnection) {
//     this.socket = socket;
//     this.peerConnection = peerConnection;

//     this.peerConnection.addEventListener('connectionstatechange', event => {
//       // eslint-disable-next-line default-case
//       switch (this.peerConnection.connectionState) {
//         case 'connected':
//           this.onConnected?.(event);
//           break;
//         case 'disconnected':
//           this.onDisconnected?.(event);
//           break;
//       }
//     });
//     this.onCallMade();
//   }

//   async callUser(to: string): Promise<void> {
//     const offer = await this.peerConnection.createOffer();
//     await this.peerConnection.setLocalDescription(
//       new RTCSessionDescription(offer),
//     );

//     this.socket.emit('call', { to, offer });
//   }

//   setOnConnected(callback: (event: Event) => void): void {
//     this.onConnected = callback;
//   }

//   setOnDisconnected(callback: (event: Event) => void): void {
//     this.onDisconnected = callback;
//   }

//   joinRoom(room: string): void {
//     this.room = room;
//     this.socket.emit('joinRoom', { room });
//   }

//   onCallMade(): void {
//     this.socket.on('call-offer', async data => {
//       if (this.isInCall) {
//         this.socket.emit('call-reject', { from: data.socket });
//         return;
//       }

//       await this.peerConnection.setRemoteDescription(
//         new RTCSessionDescription(data.offer),
//       );
//       const answer = await this.peerConnection.createAnswer();
//       await this.peerConnection.setLocalDescription(
//         new RTCSessionDescription(answer),
//       );

//       this.socket.emit('call-answer', { answer, to: data.socket });
//       this.isInCall = true;
//     });
//   }

//   onUserRemove(callback: (socketId: string) => void): void {
//     this.socket.on(`${this.room}-remove-user`, ({ socketId }) => {
//       callback(socketId);
//     });
//   }

//   onUserListUpdate(callback: (users: string[]) => void): void {
//     this.socket.on(`${this.room}-update-user-list`, ({ users }) => {
//       callback(users);
//     });
//   }

//   onAnswer(callback: (socketId: string) => void): void {
//     this.socket.on('call-answer-made', async data => {
//       if (data.answer.socket === this.socket.id) return;

//       await this.peerConnection.setRemoteDescription(
//         new RTCSessionDescription(data.answer),
//       );

//       if (!this.isCalling) {
//         callback(data.socket);
//         this.isCalling = true;
//       }
//     });
//   }

//   onCallRejected(callback: (data: { socket: string }) => void): void {
//     this.socket.on('call-reject-made', data => {
//       callback(data);
//     });
//   }

//   onTrack(callback: (stream: MediaStream) => void): void {
//     this.peerConnection.ontrack = ({ streams: [stream] }) => {
//       callback(stream);
//     };
//   }
// }

// const getToken = (): string => {
//   if (localStorage.getItem(LocalStorageAuthKey)) {
//     return JSON.parse(
//       localStorage.getItem(LocalStorageAuthKey) ?? '{ "accessToken": "" }',
//     )?.accessToken;
//   }

//   return '';
// };

// const socket = io(
//   `${process.env.REACT_APP_WS_URL}:${process.env.REACT_APP_CALL_PORT}`,
//   {
//     extraHeaders: {
//       authorization: `Bearer ${getToken()}`,
//     },
//   },
// );

// export const createPeerConnection = (): PeerConnection => {
//   const peerConnection = new RTCPeerConnection({
//     iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
//   });

//   return new PeerConnection(socket, peerConnection);
// };
