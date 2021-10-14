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
import { useParams } from 'react-router-dom';
import { TooltipAvatar } from 'components';
import {
  FaExpand,
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash,
} from 'react-icons/fa';
import { LocalStorageAuthKey } from 'services/Auth/Auth';
import { io, Socket } from 'socket.io-client';
import Peer from 'peerjs';

const getToken = (): string => {
  if (localStorage.getItem(LocalStorageAuthKey)) {
    return JSON.parse(
      localStorage.getItem(LocalStorageAuthKey) ?? '{ "accessToken": "" }',
    )?.accessToken;
  }

  return '';
};

const Call = (): JSX.Element => {
  const { callId }: { callId: string } = useParams();
  const [socket] = useState<Socket>(
    io(`${process.env.REACT_APP_WS_URL}`, {
      extraHeaders: {
        authorization: `Bearer ${getToken()}`,
      },
    }),
  );
  const [localId, setLocalId] = useState<string>();
  const [, setPeers] = useState<{ id: string; call: Peer.MediaConnection }[]>(
    [],
  );

  const [userMediaStream, setUserMediaStream] = useState<MediaStream>();
  const [isFullScreen, setFullScreen] = useState(false);
  const [isMuted, setMuted] = useState(true);
  const [isVideoOff, setVideoOff] = useState(true);

  const { data: call } = useQuery(
    `/calls/uuid/${callId}`,
    () => API.get(`/calls/uuid/${callId}`),
    {
      refetchOnWindowFocus: false,
    },
  );

  const localRef = useRef<HTMLVideoElement>(null);
  const [remoteStreams, setRemoteStreams] = useState<
    { stream: MediaStream; id: string }[]
  >([]);

  const createRemoteStream = (userCall: Peer.MediaConnection) => {
    userCall.on('stream', userStream => {
      setRemoteStreams(prevState => {
        if (prevState.find(item => item.id === userCall.peer)) return prevState;

        return [...prevState, { id: userCall.peer, stream: userStream }];
      });
    });
    userCall.on('close', () => {
      setRemoteStreams(prevState =>
        prevState.filter(item => item.id !== userCall.peer),
      );
    });
  };

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
  }, []);

  useEffect(() => {
    if (!userMediaStream) return () => {};

    if (socket.disconnected) {
      socket.connect();
    }

    const peer = new Peer();
    // const peer = new Peer(undefined, {
    //   port: +`${process.env.REACT_APP_PEER_PORT}`,
    //   host: process.env.REACT_APP_HOST,
    //   path: '/peer',
    // });

    peer.on('open', id => {
      setLocalId(id);
      socket.emit('joinRoom', { room: callId, id });
    });

    peer.on('call', userCall => {
      userCall.answer(userMediaStream);
      createRemoteStream(userCall);
    });

    socket.on('user-connected', ({ user }) => {
      if (!userMediaStream) return;

      const userCall = peer.call(user, userMediaStream);

      createRemoteStream(userCall);

      setPeers(prevPeers => {
        if (prevPeers.find(item => item.id === user)) return prevPeers;

        return [...prevPeers, { id: user, call: userCall }];
      });
    });

    socket.on('user-disconnected', ({ user }) => {
      let currentPeers: { id: string; call: Peer.MediaConnection }[] = [];

      setPeers(prevState => {
        currentPeers = prevState;
        return prevState;
      });

      if (currentPeers?.length > 0) {
        const remotePeer = currentPeers.find(item => item.id === user);
        if (remotePeer) {
          remotePeer.call.close();
        }
      }
    });

    return () => {
      socket.emit('leaveRoom', { room: callId, id: localId });
      peer.destroy();
      socket.disconnect();
    };
  }, [userMediaStream]);

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
    <Box w="100%" minH="100vh" bg="cyan.800">
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
        <Flex pos="relative" flexFlow="row wrap" justifyContent="center">
          <video
            ref={localRef}
            autoPlay
            muted
            style={{ width: '100%', maxHeight: '40vh' }}
          />
          <HStack
            pos="absolute"
            bottom="0"
            justifyContent="center"
            w="100%"
            p={4}>
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
        {remoteStreams.map(item => (
          <Flex key={item.id} flexFlow="row wrap" justifyContent="center">
            <video
              ref={videoRef => {
                if (videoRef) videoRef.srcObject = item.stream;
              }}
              autoPlay
              style={{ width: '100%', maxHeight: '40vh' }}
            />
          </Flex>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default Call;
