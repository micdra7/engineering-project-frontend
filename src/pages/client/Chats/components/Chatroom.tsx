import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { API } from 'services/api';
import { Box, Grid } from '@chakra-ui/react';
import { Loader } from 'components';

const Chatroom = (): JSX.Element => {
  const { chatroomId }: { chatroomId: string } = useParams();
  const { isLoading: chatroomLoading, data: chatroom } = useQuery(
    `/chatrooms/${chatroomId}`,
    () => API.get(`/chatrooms/${chatroomId}`),
  );
  const { isLoading: messagesLoading, data: messages } = useQuery(
    `/chatrooms/messages/${chatroomId}`,
    () => API.get(`/chatrooms/messages/${chatroomId}`),
  );

  return (
    <Box>
      {chatroomLoading && messagesLoading ? <Loader /> : <Grid>xd</Grid>}
    </Box>
  );
};

export default Chatroom;
