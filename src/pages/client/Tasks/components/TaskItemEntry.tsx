import { SimpleGrid, Text, Tooltip } from '@chakra-ui/react';
import React from 'react';
import { DATE_TIME } from 'resources/constants';
import { TUser } from 'types/User';
import moment from 'moment';
import UsersSelector from './UsersSelector';

type TTaskItemEntryProps = {
  taskListId: number;
  id?: number;
  name?: string;
  users?: TUser[];
  assignedIds?: number[];
  setAssignedIds?;
  startDate?: Date;
};

const TaskItemEntry = ({
  taskListId,
  id,
  name,
  users,
  assignedIds,
  setAssignedIds,
  startDate,
}: TTaskItemEntryProps): JSX.Element => (
  <SimpleGrid
    columns={[1, 1, 3, 3, 3]}
    spacing={4}
    w="100%"
    alignItems="center">
    <Tooltip hasArrow label={name} bg="cyan.500">
      <Text textOverflow="ellipsis" overflow="hidden" whiteSpace="nowrap">
        {name}
      </Text>
    </Tooltip>

    <UsersSelector
      taskId={id ?? 0}
      taskListId={taskListId}
      users={users ?? []}
      assignedIds={assignedIds ?? []}
      setAssignedIds={setAssignedIds ?? (() => {})}
      selectorVisible={false}
    />
    <Text>{moment(startDate).format(DATE_TIME.DATE_TIME) ?? 'N/A'}</Text>
  </SimpleGrid>
);

export default TaskItemEntry;
