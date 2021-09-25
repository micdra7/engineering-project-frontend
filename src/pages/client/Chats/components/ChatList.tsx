import React from 'react';
import { API } from 'services/api';
import { TAuthProviderState, TAuthState, useAuth } from 'services/Auth/Auth';
import { useQuery } from 'react-query';
import {
  useDisclosure,
  HStack,
  Tooltip,
  IconButton,
  Icon,
} from '@chakra-ui/react';
import { FaList } from 'react-icons/fa';
import AddChatroomModal from './AddChatroomModal';

const ChatList = (): JSX.Element => {
  const auth: TAuthProviderState = useAuth();
  const authState: TAuthState = auth.getCurrentState();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    isLoading: chatListLoading,
    data: chatList,
    refetch: refetchChatList,
  } = useQuery('/chatrooms?page=1&limit=9999', () =>
    API.get('/chatrooms?page=1&limit=9999'),
  );

  return (
    <div>
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
      <AddChatroomModal
        isOpen={isOpen}
        onClose={() => {
          refetchChatList();
          onClose();
        }}
      />
    </div>
  );
};

export default ChatList;
