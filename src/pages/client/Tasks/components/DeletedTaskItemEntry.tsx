import React from 'react';
import {
  SimpleGrid,
  Tag,
  TagLabel,
  TagRightIcon,
  Text,
  Tooltip,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  List,
  ListItem,
  ListIcon,
} from '@chakra-ui/react';
import { TUser } from 'types/User';
import moment from 'moment';
import { DATE_TIME } from 'resources/constants';
import { FaCheckCircle, FaTasks } from 'react-icons/fa';
import { TTask } from 'types/Task';
import UsersSelector from './UsersSelector';

type TDeletedTaskItemEntryProps = {
  taskListId: number;
  id?: number;
  name?: string;
  users?: TUser[];
  assignedIds?: number[];
  setAssignedIds?;
  startDate?: Date;
  finishDate?: Date;
  childrenTasks?: TTask[];
};

const DeletedTaskItemEntry = ({
  taskListId,
  id,
  name,
  users,
  assignedIds,
  setAssignedIds,
  startDate,
  finishDate,
  childrenTasks,
}: TDeletedTaskItemEntryProps): JSX.Element => (
  <AccordionItem w="100%">
    <SimpleGrid columns={1} spacing={4} w="100%" alignItems="center">
      <AccordionButton>
        <Tooltip hasArrow label={name} bg="cyan.500">
          <Text textOverflow="ellipsis" overflow="hidden" whiteSpace="nowrap">
            {name}
          </Text>
        </Tooltip>
        <AccordionIcon />
      </AccordionButton>

      <AccordionPanel>
        <UsersSelector
          taskId={id ?? 0}
          taskListId={taskListId}
          users={users ?? []}
          assignedIds={assignedIds ?? []}
          setAssignedIds={setAssignedIds ?? (() => {})}
          selectorVisible={false}
        />
        <Text>
          Start date: {moment(startDate).format(DATE_TIME.DATE_TIME) ?? 'N/A'}
        </Text>
        {finishDate && (
          <Text>
            Finish date:{' '}
            {moment(finishDate).format(DATE_TIME.DATE_TIME) ?? 'N/A'}
          </Text>
        )}
        {childrenTasks && childrenTasks.length > 0 && (
          <>
            <Text>Subtasks:</Text>
            <List w="100%">
              {childrenTasks?.map(t => (
                <ListItem key={t.id}>
                  <ListIcon as={FaCheckCircle} color="cyan.200" /> {t.name}
                </ListItem>
              ))}
            </List>
          </>
        )}
      </AccordionPanel>
    </SimpleGrid>
  </AccordionItem>
);

export default DeletedTaskItemEntry;
