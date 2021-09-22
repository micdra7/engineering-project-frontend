import {
  Text,
  useDisclosure,
  HStack,
  Tooltip,
  IconButton,
  Icon,
} from '@chakra-ui/react';
import { WideContentPage } from 'components';
import React from 'react';
import { FaList } from 'react-icons/fa';
import { TAuthProviderState, TAuthState, useAuth } from 'services/Auth/Auth';
import AddChatroomModal from './components/AddChatroomModal';
import ChatList from './components/ChatList';

const Chats = (): JSX.Element => {
  const auth: TAuthProviderState = useAuth();
  const authState: TAuthState = auth.getCurrentState();

  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <WideContentPage title="Chats">
      <Text mb={6}>
        Send messages to users in your chatrooms or create new ones
      </Text>
      <HStack w="100%" alignItems="center" justifyContent="flex-end" mb={4}>
        {authState.role === 1 ? (
          <Tooltip hasArrow placement="left" label="Add chatroom" bg="cyan.500">
            <IconButton
              aria-label="Add chatroom"
              onClick={onOpen}
              icon={<Icon as={FaList} />}
              colorScheme="cyan"
              rounded="md"
              color="white"
            />
          </Tooltip>
        ) : (
          <></>
        )}
      </HStack>
      <ChatList />
      <AddChatroomModal isOpen={isOpen} onClose={onClose} />
    </WideContentPage>
  );
};

export default Chats;
