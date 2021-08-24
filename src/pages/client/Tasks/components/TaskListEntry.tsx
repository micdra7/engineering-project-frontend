import { Flex, Text } from '@chakra-ui/react';
import React from 'react';
import { TTask } from 'types/Task';
import TaskItemEntry from './TaskItemEntry';

type TTaskListEntryProps = {
  name: string;
  tasks: TTask[];
};

const TaskListEntry = ({ name, tasks }: TTaskListEntryProps): JSX.Element => (
  <Flex
    w="100%"
    pos="relative"
    borderRadius="md"
    bg="cyan.600"
    color="white"
    p={4}
    mb={6}>
    <Text
      px={2}
      py={1}
      pos="absolute"
      bottom="100%"
      transform="translateY(40%)"
      minW="140px"
      bg="cyan.400"
      borderRadius="md"
      fontWeight="semibold"
      textAlign="center">
      {name}
    </Text>
    {tasks?.map(task => (
      <TaskItemEntry key={task.id} id={task.id} name={task.name} />
    ))}
    <TaskItemEntry name="Create new task" />
  </Flex>
);

export default TaskListEntry;
