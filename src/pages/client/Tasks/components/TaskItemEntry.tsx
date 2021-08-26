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
}: TTaskItemEntryProps): JSX.Element => (
  <SimpleGrid
    columns={[1, 1, 3, 3, 3]}
    spacing={4}
    w="100%"
    alignItems="center">
    <Text>{name}</Text>
    <UsersSelector
      taskId={id ?? 0}
      taskListId={taskListId}
      users={users ?? []}
      assignedIds={assignedIds ?? []}
      setAssignedIds={setAssignedIds ?? (() => {})}
    />
  </SimpleGrid>
);

export default TaskItemEntry;
