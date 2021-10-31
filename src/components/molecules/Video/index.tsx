import { Flex } from '@chakra-ui/react';
import React from 'react';

type TVideoProps = {
  videoRef?: React.RefObject<HTMLVideoElement>;
  stream?: MediaStream;
  usersCount: number;
};

const Video = ({ videoRef, stream, usersCount }: TVideoProps): JSX.Element => {
  const width = usersCount < 5 ? Math.floor(100 / usersCount) - 1 : 18;

  return (
    <Flex
      pos="relative"
      flexFlow="row wrap"
      justifyContent="center"
      w={[
        usersCount > 1 ? '50%' : '100%',
        usersCount > 1 ? '33%' : '100%',
        `${width}%`,
      ]}
      maxH="15vh">
      {videoRef ? (
        <video
          ref={videoRef}
          autoPlay
          muted
          style={{ height: '100%', maxWidth: '100%' }}
        />
      ) : (
        <video
          ref={element => {
            if (element && stream) element.srcObject = stream;
          }}
          autoPlay
          style={{ height: '100%', maxWidth: '100%' }}
        />
      )}
    </Flex>
  );
};
export default Video;
