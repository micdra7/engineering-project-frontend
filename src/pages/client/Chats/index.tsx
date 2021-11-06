import { Text, useBreakpointValue, Grid } from '@chakra-ui/react';
import { WideContentPage } from 'components';
import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { API } from 'services/api';
import {
  LocalStorageAuthKey,
  TAuthProviderState,
  TAuthState,
  useAuth,
} from 'services/Auth/Auth';
import { io, Socket } from 'socket.io-client';
import ChatList from './components/ChatList';
import Chatroom from './components/Chatroom';

const getToken = (): string => {
  if (localStorage.getItem(LocalStorageAuthKey)) {
    return JSON.parse(
      localStorage.getItem(LocalStorageAuthKey) ?? '{ "accessToken": "" }',
    )?.accessToken;
  }

  return '';
};

const Chats = (): JSX.Element => {
  const auth: TAuthProviderState = useAuth();
  const authState: TAuthState = auth.getCurrentState();

  const exact = useBreakpointValue([true, true, true, false]);
  const { path } = useRouteMatch();

  const [socket] = useState<Socket>(
    io(`${process.env.REACT_APP_WS_URL}`, {
      extraHeaders: {
        authorization: `Bearer ${getToken()}`,
      },
    }),
  );

  const [userId, setUserId] = useState(0);
  const [currentChatroomId, setCurrentChatroomId] = useState(0);

  const { isLoading: chatListLoading, data: chatList } = useQuery(
    '/chatrooms?page=1&limit=9999',
    () => API.get('/chatrooms?page=1&limit=9999'),
  );

  useEffect(() => {
    if (socket.disconnected) {
      socket.connect();
    }

    if (userId) {
      socket.emit('joinAll', { userId });
    }

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  useEffect(() => {
    if (!chatListLoading && chatList?.data) {
      setUserId(
        chatList?.data?.data
          ?.map(item => item.users)
          ?.flat()
          ?.find(user => user.email === authState.email)?.id,
      );
    }
  }, [chatListLoading, chatList]);

  return (
    <WideContentPage title="Chats">
      <Text mb={6}>
        Send messages to users in your chatrooms or create new ones
      </Text>
      <Switch>
        <Grid
          templateColumns={[
            '1fr',
            '1fr',
            '1fr',
            currentChatroomId ? '0.5fr 1fr' : '1fr',
          ]}
          columnGap="4"
        >
          <Route exact={exact} path={path}>
            <ChatList currentChatroomId={currentChatroomId} />
          </Route>
          <Route path={`${path}/chatroom/:chatroomId`}>
            <Chatroom
              userId={userId}
              socket={socket}
              setCurrentChatroomId={setCurrentChatroomId}
            />
          </Route>
        </Grid>
      </Switch>
    </WideContentPage>
  );
};

export default Chats;
