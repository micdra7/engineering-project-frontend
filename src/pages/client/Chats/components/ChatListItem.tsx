import React from 'react';

type TChatListItemProps = {
  name: string;
  userCount: number;
  to: string;
};

const ChatListItem = ({
  name,
  userCount,
  to,
}: TChatListItemProps): JSX.Element => (
  <div>
    <span>xd</span>
  </div>
);

export default ChatListItem;
