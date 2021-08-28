import { Text } from '@chakra-ui/react';
import { WideContentPage } from 'components';
import React from 'react';

const Chats = (): JSX.Element => (
  <WideContentPage title="Chats">
    <Text mb={6}>
      Send messages to users in your chatrooms or create new ones
    </Text>
  </WideContentPage>
);

export default Chats;
