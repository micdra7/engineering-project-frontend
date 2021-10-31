import { Flex, HStack, IconButton, Icon } from '@chakra-ui/react';
import React from 'react';
import {
  FaExpand,
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash,
} from 'react-icons/fa';

type TVideoProps = {
  videoRef?: React.RefObject<HTMLVideoElement>;
  stream?: MediaStream;
  isMuted?: boolean;
  isVideoOff?: boolean;
  toggleAudio?: () => void;
  toggleVideo?: () => void;
  toggleFullscreen?: () => void;
};

const Video = ({
  videoRef,
  stream,
  isMuted,
  isVideoOff,
  toggleAudio,
  toggleVideo,
  toggleFullscreen,
}: TVideoProps): JSX.Element => (
  <Flex pos="relative" flexFlow="row wrap" justifyContent="center">
    {videoRef ? (
      <video
        ref={videoRef}
        autoPlay
        muted
        style={{ width: '100%', maxHeight: '40vh' }}
      />
    ) : (
      <video
        ref={element => {
          if (element && stream) element.srcObject = stream;
        }}
        autoPlay
        style={{ width: '100%', maxHeight: '40vh' }}
      />
    )}

    {videoRef && (
      <HStack pos="absolute" bottom="0" justifyContent="center" w="100%" p={4}>
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
          onClick={toggleFullscreen}
          icon={<Icon as={FaExpand} />}
          colorScheme="cyan"
          rounded="md"
          color="white"
        />
      </HStack>
    )}
  </Flex>
);
export default Video;
