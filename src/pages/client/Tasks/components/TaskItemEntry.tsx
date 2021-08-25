import {
  Button,
  Editable,
  EditableInput,
  EditablePreview,
  SimpleGrid,
  Text,
} from '@chakra-ui/react';
import React from 'react';
import { TUser } from 'types/User';
import UsersSelector from './UsersSelector';

type TTaskItemEntryProps = {
  taskListId: number;
  id?: number;
  name?: string;
  users?: TUser[];
  assignedIds?: number[];
  setAssignedIds?;
};

const TaskItemEntry = ({
  taskListId,
  id,
  name,
  users,
  assignedIds,
  setAssignedIds,
}: TTaskItemEntryProps): JSX.Element =>
  id ? (
    <SimpleGrid
      columns={2}
      spacing={4}
      templateColumns="1fr 1fr"
      w="100%"
      alignItems="center">
      <Text>{name}</Text>
    </SimpleGrid>
  ) : (
    <SimpleGrid
      columns={3}
      spacing={4}
      templateColumns="1fr 1fr"
      w="100%"
      alignItems="center">
      <Editable defaultValue={name}>
        <EditablePreview />
        <EditableInput />
      </Editable>
      <UsersSelector
        taskId={id ?? 0}
        taskListId={taskListId}
        users={users ?? []}
        assignedIds={assignedIds ?? []}
        setAssignedIds={setAssignedIds ?? (() => {})}
      />
      <Button colorScheme="cyan" color="white">
        Save
      </Button>
    </SimpleGrid>
  );

export default TaskItemEntry;
