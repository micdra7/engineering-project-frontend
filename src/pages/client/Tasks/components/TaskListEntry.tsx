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
  handleTaskEdit: (id: number) => void;
  handleTaskDelete: (id: number) => void;
};

const TaskListEntry = ({
  id,
  name,
  tasks,
  users,
  assignedIds,
  setAssignedIds,
  handleTaskEdit,
  handleTaskDelete,
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
    mb={6}
  >
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
      textTransform="uppercase"
    >
      {name}
    </Text>
    <Divider />
    {tasks
      ?.filter(task => !task.parentTaskId)
      .map(task => (
        <React.Fragment key={task.id}>
          <TaskItemEntry
            taskListId={id}
            id={task.id}
            name={task.name}
            assignedIds={
              assignedIds?.find(list => list.taskId === `${task.id}`)?.ids
            }
            setAssignedIds={setAssignedIds}
            users={users}
            startDate={task.startDate}
            handleEdit={() => handleTaskEdit(task.id ?? 0)}
            childrenTaskCount={task.childrenTasks?.length ?? 0}
            handleDelete={() => handleTaskDelete(task.id ?? 0)}
          />
          <Divider />
        </React.Fragment>
      ))}
  </Flex>
);

export default TaskListEntry;
