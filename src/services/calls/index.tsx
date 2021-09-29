import { Socket } from 'socket.io-client';

export class PeerConnection {
  socket: Socket;
  peerConnection: RTCPeerConnection;

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
}
