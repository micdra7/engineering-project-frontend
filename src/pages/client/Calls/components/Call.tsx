import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  SimpleGrid,
  HStack,
  IconButton,
  Icon,
  useDisclosure,
} from '@chakra-ui/react';
import { useQuery } from 'react-query';
import { API } from 'services/api';
import { useParams } from 'react-router-dom';
import { Video } from 'components';
import {
  FaExpand,
  FaInfoCircle,
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash,
} from 'react-icons/fa';
import { LocalStorageAuthKey } from 'services/Auth/Auth';
import { io, Socket } from 'socket.io-client';
import Peer from 'peerjs';
import { useLogger } from 'services/toast';
import GameSection from './GameSection';
import CallInfoDrawer from './CallInfoDrawer';

const getColumnsCount = (
  connectedUsers: number,
  gameSectionOpen: boolean,
): number[] => {
  const cols = [1, 1, 1, 1, 1];

  if (gameSectionOpen) {
    cols[2] = 1;
    cols[3] = 2;
    cols[4] = 3;
  } else {
    cols[2] = connectedUsers <= 3 ? connectedUsers : 3;
    cols[3] = connectedUsers <= 3 ? connectedUsers : 3;
    cols[4] = connectedUsers <= 4 ? connectedUsers : 4;
  }

  return cols;
};

const getToken = (): string => {
  if (localStorage.getItem(LocalStorageAuthKey)) {
    return JSON.parse(
      localStorage.getItem(LocalStorageAuthKey) ?? '{ "accessToken": "" }',
    )?.accessToken;
  }

  return '';
};

const Call = (): JSX.Element => {
  const logger = useLogger();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { callId }: { callId: string } = useParams();
  const [socket] = useState<Socket>(() =>
    io(`${process.env.REACT_APP_WS_URL}`, {
      extraHeaders: {
        authorization: `Bearer ${getToken()}`,
      },
    }),
  );
  const [localId, setLocalId] = useState<string>();
  const [peers, setPeers] = useState<
    { id: string; call: Peer.MediaConnection }[]
  >([]);

  const [userMediaStream, setUserMediaStream] = useState<MediaStream>();
  const [isFullScreen, setFullScreen] = useState(false);
  const [isMuted, setMuted] = useState(true);
  const [isVideoOff, setVideoOff] = useState(true);

  const [gameSectionVisible, setGameSectionVisible] = useState(false);
  const [gameId, setGameId] = useState(0);

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
      setPeers(prevPeers => {
        if (prevPeers.find(item => item.id === userCall.peer)) return prevPeers;

        return [...prevPeers, { id: userCall.peer, call: userCall }];
      });
    });
    userCall.on('close', () => {
      setRemoteStreams(prevState =>
        prevState.filter(item => item.id !== userCall.peer),
      );
    });
    userCall.on('error', () => {
      setRemoteStreams(prevState =>
        prevState.filter(item => item.id !== userCall.peer),
      );
    });
  };

  useEffect(() => {
    const createMediaStream = async () => {
      if (!userMediaStream) {
        try {
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
        } catch (error) {
          logger.error({
            title: 'Error',
            description: 'Could not initialize camera',
          });
        }
      }
    };

    createMediaStream();
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

        setPeers(prevState => prevState.filter(item => item.id !== user));
      }
    });

    return () => {
      socket.emit('leaveRoom', { room: callId, id: localId });
      peer.destroy();
      socket.disconnect();

      userMediaStream?.getTracks()?.forEach(track => {
        track?.stop();
      });
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

  useEffect(() => {
    socket.on('gameStart', ({ gameId: newGameId }) => {
      if (!gameId) {
        setGameId(+newGameId);
        setGameSectionVisible(true);
      }
    });
  }, []);

  useEffect(() => {
    if (!gameId) setGameSectionVisible(false);
  }, [gameId]);

  return (
    <Box w="100%" minH="100vh" maxH="100vh" bg="cyan.800">
      <IconButton
        pos="fixed"
        top={4}
        right={4}
        zIndex={10}
        aria-label="Call info"
        icon={<Icon as={FaInfoCircle} />}
        onClick={onOpen}
        colorScheme="cyan"
        color="white"
      />

      <CallInfoDrawer
        isOpen={isOpen}
        onClose={onClose}
        name={call?.data?.name ?? ''}
        userNames={
          call?.data?.users?.map(user => ({
            id: user.id,
            name: `${user.firstName} ${user.lastName}`,
          })) ?? []
        }
        onGamesClick={() => {
          setGameSectionVisible(!gameSectionVisible);
          onClose();
        }}
      />

      <SimpleGrid columns={[1, 1, gameSectionVisible ? 2 : 1]}>
        <SimpleGrid
          pos="relative"
          columns={getColumnsCount(peers?.length, gameSectionVisible)}
          placeItems={gameSectionVisible ? 'start' : 'center'}
          alignContent={gameSectionVisible ? 'start' : 'center'}
          order={[2, 2, 1]}
          maxH={['50vh', '50vh', 'initial']}
        >
          <Video
            videoRef={localRef}
            usersCount={peers?.length + 1}
            containerStyle={
              peers.length > 0
                ? {
                    pos: ['fixed', 'fixed', 'fixed'],
                    w: '40vw',
                    maxW: gameSectionVisible ? '120px' : '300px',
                    bottom: 2,
                    right: 2,
                  }
                : {}
            }
          />
          {remoteStreams.map(item => (
            <Video
              key={item.id}
              stream={item.stream}
              usersCount={peers?.length + 1}
            />
          ))}
        </SimpleGrid>

        {gameSectionVisible && (
          <GameSection
            gameId={gameId}
            setGameId={setGameId}
            room={callId}
            socket={socket}
            usersCount={peers.length}
            userPeerId={localId ?? ''}
          />
        )}
      </SimpleGrid>

      <HStack pos="fixed" bottom="0" justifyContent="center" w="100%" p={4}>
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
    </Box>
  );
};

export default Call;
