import { Divider, Flex, Text } from '@chakra-ui/react';
import React from 'react';
import { TTask } from 'types/Task';
import { TUser } from 'types/User';
import TaskItemEntry from './TaskItemEntry';

type TTaskListEntryProps = {
  id: number;
  name: string;
  tasks: TTask[];
  users?: TUser[];
  assignedIds?: {
    taskId: string;
    listId: string;
    ids: number[];
  }[];
  setAssignedIds;
};

const TaskListEntry = ({
  id,
  name,
  tasks,
  users,
  assignedIds,
  setAssignedIds,
}: TTaskListEntryProps): JSX.Element => (
  <Flex
    flexFlow="row wrap"
    gridRowGap="1rem"
    w="100%"
    pos="relative"
    borderRadius="md"
    bg="cyan.600"
    color="white"
    alignItems="center"
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
      textAlign="center"
      textTransform="uppercase">
      {name}
    </Text>
    <Divider />
    {tasks?.map(task => (
      <>
        <TaskItemEntry
          taskListId={id}
          key={task.id}
          id={task.id}
          name={task.name}
          assignedIds={
            assignedIds?.filter(item => item.taskId === `${task.id}`)?.[0]?.ids
          }
        />
        <Divider />
      </>
    ))}
  </Flex>
);

export default TaskListEntry;
