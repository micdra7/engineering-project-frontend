import { Text } from '@chakra-ui/react';
import { WideContentPage } from 'components';
import React from 'react';
import { TAuthProviderState, TAuthState, useAuth } from 'services/Auth/Auth';
import ChatList from './components/ChatList';

const Chats = (): JSX.Element => {
  const auth: TAuthProviderState = useAuth();
  const authState: TAuthState = auth.getCurrentState();

  return (
    <WideContentPage title="Chats">
      <Text mb={6}>
        Send messages to users in your chatrooms or create new ones
      </Text>
      <ChatList />
    </WideContentPage>
  );
};

export default Chats;
