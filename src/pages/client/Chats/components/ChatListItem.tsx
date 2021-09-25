import { Grid, Text, Tag, Divider } from '@chakra-ui/react';
import React from 'react';
import { Link } from 'react-router-dom';

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
  <>
    <Divider mt={2} />
    <Link to={to}>
      <Grid templateColumns="1fr auto" mt={2} _hover={{ color: 'cyan.500' }}>
        <Text>{name}</Text>
        <Tag colorScheme="cyan">{`${userCount} users`}</Tag>
      </Grid>
    </Link>
  </>
);

export default ChatListItem;
