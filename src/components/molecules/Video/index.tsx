import { Flex, FlexProps } from '@chakra-ui/react';
import React from 'react';

type TVideoProps = {
  videoRef?: React.RefObject<HTMLVideoElement>;
  stream?: MediaStream;
  usersCount: number;
  containerStyle?: FlexProps;
};

const Video = ({
  videoRef,
  stream,
  usersCount,
  containerStyle,
}: TVideoProps): JSX.Element => {
  const videoStyle: React.CSSProperties = {
    width: '100%',
    maxHeight: '100%',
  };

  return (
    <Flex maxH="100vh" p={2} {...containerStyle}>
      {videoRef ? (
        <video
          ref={videoRef}
          autoPlay
          muted
          style={
            usersCount === 1
              ? videoStyle
              : { ...videoStyle, boxShadow: '0 0 2px #fff' }
          }
        />
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
