import { Flex } from '@chakra-ui/react';
import React from 'react';

type TVideoProps = {
  videoRef?: React.RefObject<HTMLVideoElement>;
  stream?: MediaStream;
  usersCount: number;
};

const Video = ({ videoRef, stream, usersCount }: TVideoProps): JSX.Element => {
  const videoStyle: React.CSSProperties = {
    width: '100%',
    maxHeight: '100%',
  };

  return (
    <Flex maxH="100vh">
      {videoRef ? (
        <video ref={videoRef} autoPlay muted style={videoStyle} />
      ) : (
        <video
          ref={element => {
            if (element && stream) element.srcObject = stream;
          }}
          autoPlay
          style={videoStyle}
        />
      )}
    </Flex>
  );
};
export default Video;
