import { Text, useBreakpointValue } from '@chakra-ui/react';
import { WideContentPage } from 'components';
import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { TAuthProviderState, TAuthState, useAuth } from 'services/Auth/Auth';
import ChatList from './components/ChatList';

const Chats = (): JSX.Element => {
  const auth: TAuthProviderState = useAuth();
  const authState: TAuthState = auth.getCurrentState();

  const exact = useBreakpointValue([true, true, false]);

  const { path } = useRouteMatch();

  return (
    <WideContentPage title="Chats">
      <Text mb={6}>
        Send messages to users in your chatrooms or create new ones
      </Text>
      <Switch>
        <Route exact={exact} path={path}>
          <ChatList />
        </Route>
        <Route path={`${path}/chatroom/:chatroomId`}>chatroom</Route>
      </Switch>
    </WideContentPage>
  );
};

export default Chats;
