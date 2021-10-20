import React from 'react';
import { TTask } from 'types/Task';
import { Divider, Flex, Text, Accordion } from '@chakra-ui/react';
import { TUser } from 'types/User';
import DeletedTaskItemEntry from './DeletedTaskItemEntry';

type TDeletedTaskListEntryProps = {
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

const DeletedTaskListEntry = ({
  id,
  name,
  tasks,
  users,
  assignedIds,
  setAssignedIds,
}: TDeletedTaskListEntryProps): JSX.Element => (
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
    <Accordion allowMultiple allowToggle w="100%">
      {tasks
        ?.filter(task => !task.parentTaskId)
        .map(task => (
          <React.Fragment key={task.id}>
            <DeletedTaskItemEntry
              taskListId={id}
              id={task.id}
              name={task.name}
              assignedIds={
                assignedIds?.find(list => +list.taskId === task.id)?.ids
              }
              setAssignedIds={setAssignedIds}
              users={users}
              startDate={task.startDate}
              finishDate={task.finishDate}
              childrenTasks={task.childrenTasks}
            />
          </React.Fragment>
        ))}
    </Accordion>
  </Flex>
);

export default DeletedTaskListEntry;
