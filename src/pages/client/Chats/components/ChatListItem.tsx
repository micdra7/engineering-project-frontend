import { Grid, Text, Tag, Divider } from '@chakra-ui/react';
import React from 'react';
import { Link } from 'react-router-dom';

type TChatListItemProps = {
  name: string;
  userCount: number;
  to: string;
  isActive: boolean;
};

const ChatListItem = ({
  name,
  userCount,
  to,
  isActive,
}: TChatListItemProps): JSX.Element => (
  <>
    <Divider pt={2} />
    <Link to={to}>
      <Grid
        templateColumns="1fr auto"
        bg={isActive ? 'cyan.300' : 'white'}
        p={2}
        _hover={{ color: 'cyan.500' }}
      >
        <Text>{name}</Text>
        <Tag colorScheme="cyan">{`${userCount} users`}</Tag>
      </Grid>
    </Link>
  </>
);

export default ChatListItem;
