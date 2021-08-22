import { Flex, Text } from '@chakra-ui/react';
import React from 'react';

type TTaskListEntryProps = {
  name: string;
};

const TaskListEntry = ({ name }: TTaskListEntryProps): JSX.Element => (
  <Flex
    w="100%"
    pos="relative"
    border="1px solid black"
    borderColor="cyan.900"
    borderRadius="md"
    p={4}
    mb={6}>
    <Text
      px={2}
      py={1}
      pos="absolute"
      bottom="100%"
      transform="translateY(50%)"
      bg="white"
      border="1px solid black"
      borderColor="cyan.900"
      borderRadius="md"
      fontWeight="semibold">
      {name}
    </Text>
  </Flex>
);

export default TaskListEntry;
