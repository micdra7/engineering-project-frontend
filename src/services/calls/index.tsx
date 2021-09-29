import { LocalStorageAuthKey } from 'services/Auth/Auth';
import { io, Socket } from 'socket.io-client';

export class PeerConnection {
  socket: Socket;
  peerConnection: RTCPeerConnection;
  room = '';

  private isCalling = false;
  private isInCall = false;

  private onConnected: (event: Event) => void = () => {};
  private onDisconnected: (event: Event) => void = () => {};

  constructor(socket: Socket, peerConnection: RTCPeerConnection) {
    this.socket = socket;
    this.peerConnection = peerConnection;

    this.peerConnection.addEventListener('connectionstatechange', event => {
      // eslint-disable-next-line default-case
      switch (this.peerConnection.connectionState) {
        case 'connected':
          this.onConnected?.(event);
          break;
        case 'disconnected':
          this.onDisconnected?.(event);
          break;
      }
    });
  }

  async callUser(to: number): Promise<void> {
    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(
      new RTCSessionDescription(offer),
    );

    this.socket.emit('call', { to, offer });
  }

  setOnConnected(callback: (event: Event) => void): void {
    this.onConnected = callback;
  }

  setOnDisconnected(callback: (event: Event) => void): void {
    this.onDisconnected = callback;
  }

  joinRoom(room: string): void {
    this.room = room;
    this.socket.emit('joinRoom', room);
  }

  onCallMade(): void {
    this.socket.on('call-answer-made', async data => {
      if (!this.isInCall) {
        // eslint-disable-next-line no-alert
        const confirmed = window.confirm(
          `User ${data.socket} wants to call you. Do you accept?`,
        );

        if (!confirmed) {
          this.socket.emit('call-reject', { from: data.socket });
          return;
        }
      }

      await this.peerConnection.setRemoteDescription(
        new RTCSessionDescription(data.offer),
      );
      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(
        new RTCSessionDescription(answer),
      );

      this.socket.emit('call-answer', { answer, to: data.socket });
      this.isInCall = true;
    });
  }

  onUserRemove(callback: (socketId: string) => void): void {
    this.socket.on(`${this.room}-remove-user`, ({ socketId }) => {
      callback(socketId);
    });
  }

  onUserListUpdate(callback: (users: unknown) => void): void {
    this.socket.on(`${this.room}-update-user-list`, ({ users }) => {
      callback(users);
    });
  }

  onAnswer(callback: (socketId: string) => void): void {
    this.socket.on('call-answer-made', async data => {
      await this.peerConnection.setRemoteDescription(
        new RTCSessionDescription(data.answer),
      );

      if (!this.isCalling) {
        callback(data.socket);
        this.isCalling = true;
      }
    });
  }

  onCallRejected(callback: (data: unknown) => void): void {
    this.socket.on('call-reject-made', data => {
      callback(data);
    });
  }

  onTrack(callback: (stream: unknown) => void): void {
    this.peerConnection.ontrack = ({ streams: [stream] }) => {
      callback(stream);
    };
  }
}

const getToken = (): string => {
  if (localStorage.getItem(LocalStorageAuthKey)) {
    return JSON.parse(
      localStorage.getItem(LocalStorageAuthKey) ?? '{ "accessToken": "" }',
    )?.accessToken;
  }

  return '';
};

export const createPeerConnection = (): PeerConnection => {
  const peerConnection = new RTCPeerConnection({
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
  });

  const socket = io(process.env.REACT_APP_WS_URL as string, {
    extraHeaders: {
      authorization: `Bearer ${getToken()}`,
    },
  });

  return new PeerConnection(socket, peerConnection);
};
