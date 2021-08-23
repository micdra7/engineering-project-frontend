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
    {tasks?.map(task => (
      <TaskItemEntry key={task.id} id={task.id} name={task.name} />
    ))}
    <TaskItemEntry name="Create new task" />
  </Flex>
);

export default TaskListEntry;
