import React from 'react';
import { API } from 'services/api';
import { TAuthProviderState, TAuthState, useAuth } from 'services/Auth/Auth';
import { useQuery } from 'react-query';

const ChatList = (): JSX.Element => {
  const auth: TAuthProviderState = useAuth();
  const authState: TAuthState = auth.getCurrentState();

  const {
    isLoading: chatListLoading,
    data: chatList,
    refetch: refetchChatList,
  } = useQuery('/chatrooms?page=1&limit=9999', () =>
    API.get('/chatrooms?page=1&limit=9999'),
  );

  return <div>xd</div>;
};

export default ChatList;
