import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  SimpleGrid,
  Heading,
  AvatarGroup,
  HStack,
  IconButton,
  Icon,
  Flex,
} from '@chakra-ui/react';
import { useQuery } from 'react-query';
import { API } from 'services/api';
import { createPeerConnection } from 'services/calls';
import { useParams } from 'react-router-dom';
import { TooltipAvatar } from 'components';
import {
  FaExpand,
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash,
} from 'react-icons/fa';
import { TAuthProviderState, TAuthState, useAuth } from 'services/Auth/Auth';

const senders: RTCRtpSender[] = [];
const peerVideoConnection = createPeerConnection();

const Call = (): JSX.Element => {
  const auth: TAuthProviderState = useAuth();
  const authState: TAuthState = auth.getCurrentState();

  const { callId }: { callId: string } = useParams();
  const [connectedUsers, setConnectedUsers] = useState<string[]>([]);
  const [userMediaStream, setUserMediaStream] = useState<MediaStream>();
  // const [displayMediaStream, setDisplayMediaStream] = useState(null);
  const [isFullScreen, setFullScreen] = useState(false);
  const [startTimer, setStartTimer] = useState(false);
  const [isMuted, setMuted] = useState(true);
  const [isVideoOff, setVideoOff] = useState(true);

  const { data: call } = useQuery(`/calls/uuid/${callId}`, () =>
    API.get(`/calls/uuid/${callId}`),
  );

  const localRef = useRef<HTMLVideoElement>(null);
  const [remoteStreams, setRemoteStreams] = useState<MediaStream[]>([]);

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
          track.enabled = false;
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
      setConnectedUsers((oldUsers: string[]) =>
        oldUsers.filter(user => user !== socketId),
      ),
    );
    peerVideoConnection.onUserListUpdate((updatedUsers: string[]) =>
      setConnectedUsers(updatedUsers),
    );
    peerVideoConnection.onAnswer((socket: number) => {
      peerVideoConnection.callUser(socket);
    });
    peerVideoConnection.onCallRejected((data: { socket: string }) =>
      // eslint-disable-next-line no-alert
      alert(`User: "Socket: ${data.socket}" rejected your call.`),
    );
    peerVideoConnection.onTrack((stream: MediaStream) => {
      setRemoteStreams((prevState: MediaStream[]) => [...prevState, stream]);
    });

    peerVideoConnection.setOnConnected(() => {
      setStartTimer(true);
    });
    peerVideoConnection.setOnDisconnected(() => {
      setStartTimer(false);
      // TODO just for testing, in finished version should filter out user who disconnected
      setRemoteStreams([]);
    });

    return () => {
      peerVideoConnection.socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (call?.data) {
      call?.data?.users?.forEach(user => {
        if (user.email === authState.email) return;

        peerVideoConnection.callUser(user.id);
      });
    }
  }, [call]);

  const enterFullScreen = () => {
    document.body.requestFullscreen();
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

  const toggleAudio = () => {
    userMediaStream?.getAudioTracks()?.forEach(track => {
      track.enabled = !track.enabled;
    });
    setMuted(!isMuted);
  };

  const toggleVideo = () => {
    userMediaStream?.getVideoTracks()?.forEach(track => {
      track.enabled = !track.enabled;
    });
    setVideoOff(!isVideoOff);
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
      <SimpleGrid columns={[1, 1, 2]} gap={2} p={4}>
        <Flex flexFlow="row wrap" justifyContent="center">
          <video ref={localRef} autoPlay style={{ width: '100%' }} />
          <HStack justifyContent="center" w="100%" p={4}>
            <IconButton
              aria-label="Toggle audio"
              onClick={toggleAudio}
              icon={<Icon as={isMuted ? FaMicrophoneSlash : FaMicrophone} />}
              colorScheme="cyan"
              rounded="md"
              color="white"
            />
            <IconButton
              aria-label="Toggle video"
              onClick={toggleVideo}
              icon={<Icon as={isVideoOff ? FaVideoSlash : FaVideo} />}
              colorScheme="cyan"
              rounded="md"
              color="white"
            />
            <IconButton
              aria-label="Toggle fullscreen"
              onClick={toggleFullScreen}
              icon={<Icon as={FaExpand} />}
              colorScheme="cyan"
              rounded="md"
              color="white"
            />
          </HStack>
        </Flex>
        {remoteStreams.map(stream => (
          <Flex key={stream.id} flexFlow="row wrap" justifyContent="center">
            <video src={URL.createObjectURL(stream)} autoPlay />
          </Flex>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default Call;
