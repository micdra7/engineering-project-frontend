import { Text } from '@chakra-ui/react';
import { WideContentPage } from 'components';
import React from 'react';
import ChatList from './components/ChatList';

const Chats = (): JSX.Element => (
  <WideContentPage title="Chats">
    <Text mb={6}>
      Send messages to users in your chatrooms or create new ones
    </Text>
    <ChatList />
  </WideContentPage>
);

export default Chats;
