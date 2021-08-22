import {
  Flex,
  Icon,
  IconButton,
  Text,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react';
import { Loader, WideContentPage } from 'components';
import React from 'react';
import { FaPlus } from 'react-icons/fa';
import { useQuery } from 'react-query';
import { API } from 'services/api';
import { TAuthProviderState, TAuthState, useAuth } from 'services/Auth/Auth';
import AddListModal from './components/AddListModal';
import TaskListEntry from './components/TaskListEntry';

const Tasks = (): JSX.Element => {
  const auth: TAuthProviderState = useAuth();
  const authState: TAuthState = auth.getCurrentState();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    isLoading: taskListsLoading,
    data: taskLists,
    refetch: refetchTaskLists,
  } = useQuery('/tasklists', () => API.get('/tasklists?page=1&limit=9999'));

  return (
    <WideContentPage title="Tasks">
      <Text mb={6}>View and manage your tasks</Text>
      {authState.role === 1 ? (
        <Flex w="100%" alignItems="center" justifyContent="flex-end" mb={4}>
          <Tooltip
            hasArrow
            placement="left"
            label="Add task list"
            bg="cyan.500">
            <IconButton
              aria-label="Add task list"
              onClick={onOpen}
              icon={<Icon as={FaPlus} />}
              colorScheme="cyan"
              rounded="md"
              color="white"
            />
          </Tooltip>
        </Flex>
      ) : (
        <></>
      )}
      {taskListsLoading ? (
        <Loader />
      ) : (
        <>
          {taskLists?.data?.data?.length === 0 && (
            <Text>
              No task lists available. Please contact your administrator in
              order to have one created.
            </Text>
          )}
          {taskLists?.data?.data?.map(item => (
            <TaskListEntry key={item.id} name={item.name} />
          ))}
        </>
      )}

      <AddListModal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          refetchTaskLists();
        }}
      />
    </WideContentPage>
  );
};

export default Tasks;
