import { Text, useBreakpointValue, Grid } from '@chakra-ui/react';
import { WideContentPage } from 'components';
import React, { useState, useEffect } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { LocalStorageAuthKey } from 'services/Auth/Auth';
import { io } from 'socket.io-client';
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

const socket = io(process.env.REACT_APP_WS_URL as string, {
  extraHeaders: {
    authorization: `Bearer ${getToken()}`,
  },
});

const Chats = (): JSX.Element => {
  const exact = useBreakpointValue([true, true, true, false]);
  const { path } = useRouteMatch();

  const [userId, setUserId] = useState(0);

  useEffect(() => {
    if (userId) {
      socket.emit('joinAll', { userId });
    }
  }, [userId]);

  return (
    <WideContentPage title="Chats">
      <Text mb={6}>
        Send messages to users in your chatrooms or create new ones
      </Text>
      <Switch>
        <Grid
          templateColumns={['1fr', '1fr', '1fr', '0.5fr 1fr']}
          columnGap="4">
          <Route exact={exact} path={path}>
            <ChatList setUserId={setUserId} />
          </Route>
          <Route path={`${path}/chatroom/:chatroomId`}>
            <Chatroom userId={userId} socket={socket} />
          </Route>
        </Grid>
      </Switch>
    </WideContentPage>
  );
};

export default Chats;
