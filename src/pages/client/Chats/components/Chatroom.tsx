import React, { useState, useEffect, useRef } from 'react';
import { useParams, Redirect } from 'react-router-dom';
import { useQuery } from 'react-query';
import { API } from 'services/api';
import {
  Box,
  Grid,
  Textarea,
  IconButton,
  Icon,
  Flex,
  Text,
} from '@chakra-ui/react';
import { Loader, TooltipAvatar } from 'components';
import { FaPaperPlane } from 'react-icons/fa';
import { Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io-client/build/typed-events';
import moment from 'moment';
import { DATE_TIME } from 'resources/constants';

type TMessage = {
  id: number;
  chatroomId: number;
  userId: number;
  chatroomName: string;
  userEmail: string;
  userFullName: string;
  sendTime: string;
  content: string;
};

type TChatroomProps = {
  userId: number;
  socket: Socket<DefaultEventsMap, DefaultEventsMap>;
};

const Chatroom = ({ userId, socket }: TChatroomProps): JSX.Element => {
  const [limit, setLimit] = useState(10);
  const [message, setMessage] = useState('');

  const chatRef = useRef<HTMLDivElement>();

  const { chatroomId }: { chatroomId: string } = useParams();
  const { isLoading: chatroomLoading, data: chatroom } = useQuery(
    `/chatrooms/${chatroomId}`,
    () => API.get(`/chatrooms/${chatroomId}`),
  );
  const {
    isLoading: messagesLoading,
    data: messages,
    refetch: refetchMessages,
  } = useQuery(`/chatrooms/messages/${chatroomId}?limit=${limit}`, () =>
    API.get(`/chatrooms/messages/${chatroomId}?limit=${limit}`),
  );

  useEffect(() => {
    if (socket)
      socket.on('message', () => {
        refetchMessages();
      });
  }, [socket]);

  useEffect(() => {
    if (!messagesLoading && messages?.data) {
      chatRef?.current?.scrollIntoView({
        behavior: 'smooth',
      });
    }
  }, [messagesLoading, messages]);

  const onSend = () => {
    if (!message?.trim()) return;

    socket.emit('message', { userId, chatroomId, content: message });
    setMessage('');
    refetchMessages();
  };

  if (!userId) {
    return <Redirect to="/client/chats" />;
  }

  return (
    <Box>
      {chatroomLoading && messagesLoading ? (
        <Loader />
      ) : (
        <Grid templateColumns={['1fr']}>
          <Grid templateColumns="1fr" height="90%" overflowY="auto">
            {[]
              .concat(messages?.data?.data ?? [])
              .reverse()
              ?.map((m: TMessage) => (
                <Flex
                  wrap="wrap"
                  key={m.id}
                  align="center"
                  justify={userId === m.userId ? 'flex-end' : 'flex-start'}>
                  <Flex
                    w="60%"
                    my={1}
                    p={2}
                    align="center"
                    borderRadius="lg"
                    background={userId === m.userId ? 'cyan.600' : 'cyan.100'}
                    color={userId === m.userId ? 'white' : 'black'}>
                    <TooltipAvatar size="sm" name={m.userFullName} mx={1} />
                    <Text>{m.content}</Text>
                  </Flex>
                  <Text
                    fontSize="xs"
                    w="100%"
                    textAlign={userId === m.userId ? 'right' : 'left'}>
                    {moment(m.sendTime).format(DATE_TIME.DATE_TIME)}
                  </Text>
                </Flex>
              ))}
            <Flex h="0%" opacity="0" ref={chatRef} />
          </Grid>

          <form id="send-message-form" onSubmit={onSend}>
            <Grid
              pos="fixed"
              bottom="0"
              right="0"
              p={4}
              w="85%"
              minH="120px"
              templateColumns="1fr 0.25fr"
              gap="0.5rem">
              <Textarea
                value={message}
                onChange={event => setMessage(event.target.value)}
                placeholder="Type your message and press ENTER to send"
                h="100%"
                resize="none"
                onKeyDown={event => {
                  if (event.key === 'Enter') onSend();
                }}
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
          </form>
        </Grid>
      )}
    </Box>
  );
};

export default Chatroom;
