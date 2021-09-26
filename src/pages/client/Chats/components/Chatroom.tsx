import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { API } from 'services/api';
import { Box, Grid, Textarea, IconButton, Icon } from '@chakra-ui/react';
import { Loader } from 'components';
import { FaPaperPlane } from 'react-icons/fa';
import { Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io-client/build/typed-events';

type TChatroomProps = {
  userId: number;
  socket: Socket<DefaultEventsMap, DefaultEventsMap>;
};

const Chatroom = ({ userId, socket }: TChatroomProps): JSX.Element => {
  const [limit, setLimit] = useState(10);
  const [message, setMessage] = useState('');

  const { chatroomId }: { chatroomId: string } = useParams();
  const { isLoading: chatroomLoading, data: chatroom } = useQuery(
    `/chatrooms/${chatroomId}`,
    () => API.get(`/chatrooms/${chatroomId}`),
  );
  const { isLoading: messagesLoading, data: messages } = useQuery(
    `/chatrooms/messages/${chatroomId}?limit=${limit}`,
    () => API.get(`/chatrooms/messages/${chatroomId}?limit=${limit}`),
  );

  const onSend = () => {
    socket.emit('message', { userId, chatroomId, content: message });
    setMessage('');
  };

  return (
    <Box>
      {chatroomLoading && messagesLoading ? (
        <Loader />
      ) : (
        <Grid templateColumns={['1fr']}>
          <Grid
            p={4}
            w="100%"
            minH="120px"
            templateColumns="1fr 0.25fr"
            gap="0.5rem">
            <Textarea
              value={message}
              onChange={event => setMessage(event.target.value)}
              placeholder="Type your message and press ENTER to send"
              h="100%"
              resize="none"
            />
            <IconButton
              colorScheme="cyan"
              aria-label="Send"
              rounded="md"
              h="100%"
              icon={<Icon as={FaPaperPlane} color="white" />}
              onClick={onSend}
            />
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default Chatroom;
