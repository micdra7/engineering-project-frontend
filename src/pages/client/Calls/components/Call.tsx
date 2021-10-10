import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  SimpleGrid,
  Button,
  Heading,
  AvatarGroup,
  Text,
} from '@chakra-ui/react';
import { useQuery } from 'react-query';
import { API } from 'services/api';
import { createPeerConnection } from 'services/calls';
import { useParams } from 'react-router-dom';
import { TooltipAvatar } from 'components';

const senders: RTCRtpSender[] = [];
const peerVideoConnection = createPeerConnection();

const Call = (): JSX.Element => {
  const { callId }: { callId: string } = useParams();
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [userMediaStream, setUserMediaStream] = useState<MediaStream>();
  // const [displayMediaStream, setDisplayMediaStream] = useState(null);
  const [isFullScreen, setFullScreen] = useState(false);
  const [startTimer, setStartTimer] = useState(false);

  const { data: call } = useQuery(`/calls/uuid/${callId}`, () =>
    API.get(`/calls/uuid/${callId}`),
  );

  const contentRef = useRef<HTMLDivElement>(null);
  const localRef = useRef<HTMLVideoElement>(null);
  const remoteRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const createMediaStream = async () => {
      if (!userMediaStream) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        if (localRef?.current) {
          localRef.current.srcObject = stream;
        }

        stream.getTracks().forEach(track => {
          senders.push(
            peerVideoConnection.peerConnection.addTrack(track, stream),
          );
        });

        setUserMediaStream(stream);
      }
    };

    createMediaStream();

    return () => {
      userMediaStream?.getTracks()?.forEach(track => {
        track?.stop();
      });
    };
  }, [userMediaStream]);

  useEffect(() => {
    if (peerVideoConnection.socket.disconnected) {
      peerVideoConnection.socket.connect();
    }

    peerVideoConnection.joinRoom(callId);
    peerVideoConnection.onUserRemove(socketId =>
      setConnectedUsers((oldUsers: any) =>
        oldUsers.filter(user => user !== socketId),
      ),
    );
    peerVideoConnection.onUserListUpdate((updatedUsers: any) =>
      setConnectedUsers(updatedUsers),
    );
    peerVideoConnection.onAnswer((socket: any) =>
      peerVideoConnection.callUser(socket),
    );
    peerVideoConnection.onCallRejected((data: any) =>
      // eslint-disable-next-line no-alert
      alert(`User: "Socket: ${data.socket}" rejected your call.`),
    );
    peerVideoConnection.onTrack((stream: any) => {
      if (remoteRef?.current) remoteRef.current.srcObject = stream;
    });

    peerVideoConnection.setOnConnected(() => {
      setStartTimer(true);
    });
    peerVideoConnection.setOnDisconnected(() => {
      setStartTimer(false);
      if (remoteRef?.current) remoteRef.current.srcObject = null;
    });

    return () => {
      peerVideoConnection.socket.disconnect();
    };
  }, []);

  const enterFullScreen = () => {
    contentRef?.current?.requestFullscreen();
  };

  const exitFullScreen = () => {
    document.exitFullscreen();
  };

  const toggleFullScreen = () => {
    const currentFullScreenState = isFullScreen;
    setFullScreen(!isFullScreen);

    if (currentFullScreenState) {
      exitFullScreen();
    } else {
      enterFullScreen();
    }
  };

  return (
    <Box w="100%" h="100vh" bg="cyan.800">
      <Heading textAlign="center" color="white">
        {call?.data?.name}
      </Heading>
      <Heading size="md" color="white" p={4}>
        Users:
      </Heading>
      <AvatarGroup size="sm" max={5} p={4}>
        {call?.data?.users?.map(user => (
          <TooltipAvatar
            key={user.id}
            size="sm"
            color="white"
            name={`${user.firstName} ${user.lastName}`}
          />
        ))}
      </AvatarGroup>
      <SimpleGrid columns={2} gap={2} ref={contentRef}>
        <video ref={localRef} autoPlay />
        <video ref={remoteRef} autoPlay muted />
      </SimpleGrid>
      <SimpleGrid columns={2} gap={2}>
        <Button onClick={() => toggleFullScreen}>Fullscreen</Button>
      </SimpleGrid>
    </Box>
  );
};

export default Call;
