import {
  HStack,
  Icon,
  IconButton,
  Text,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react';
import { Loader, WideContentPage } from 'components';
import React, { useEffect, useState } from 'react';
import { FaList, FaThumbtack } from 'react-icons/fa';
import { useMutation, useQuery } from 'react-query';
import { API } from 'services/api';
import { TAuthProviderState, TAuthState, useAuth } from 'services/Auth/Auth';
import { useLogger } from 'services/toast';
import AddListModal from './components/AddListModal';
import AddTaskModal from './components/AddTaskModal';
import EditTaskModal from './components/EditTaskModal';
import TaskListEntry from './components/TaskListEntry';

const Tasks = (): JSX.Element => {
  const logger = useLogger();
  const auth: TAuthProviderState = useAuth();
  const authState: TAuthState = auth.getCurrentState();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: addTaskOpen,
    onOpen: onAddTaskOpen,
    onClose: onAddTaskClose,
  } = useDisclosure();
  const {
    isOpen: editTaskOpen,
    onOpen: onEditTaskOpen,
    onClose: onEditTaskClose,
  } = useDisclosure();

  const {
    isLoading: taskListsLoading,
    data: taskLists,
    refetch: refetchTaskLists,
  } = useQuery('/tasklists', () => API.get('/tasklists?page=1&limit=9999'));
  const { isLoading: usersLoading, data: users } = useQuery('/users', () =>
    API.get('/users?page=1&limit=9999'),
  );

  const deleteMutation = useMutation((id: number) =>
    API.delete(`/tasks/${id}`),
  );

  const [assignedIds, setAssignedIds] = useState<
    {
      taskId: string;
      listId: string;
      ids: number[];
    }[]
  >([]);
  const [currentId, setCurrentId] = useState(0);

  const handleTaskDelete = async (taskId: number) => {
    try {
      await deleteMutation.mutateAsync(taskId);
      refetchTaskLists();
    } catch (error) {
      logger.error({
        title: 'Error',
        description: error?.response?.data?.message ?? 'Something went wrong',
      });
    }
  };

  useEffect(() => {
    if (currentId) {
      onEditTaskOpen();
    }
  }, [currentId]);

  useEffect(() => {
    if (!taskListsLoading && taskLists) {
      let newIds = [...assignedIds];

      taskLists.data.data.forEach(item => {
        item.tasks.forEach(task => {
          if (task.assignedUserIds?.length > 0) {
            newIds = newIds.filter(id => id.taskId !== `${task.id}`);

            newIds.push({
              taskId: `${task.id}`,
              listId: `${item.id}`,
              ids: task.assignedUserIds,
            });
          }
        });
      });
      setAssignedIds(newIds);
    }
  }, [taskListsLoading, taskLists]);

  return (
    <WideContentPage title="Tasks">
      <Text mb={6}>View and manage your tasks</Text>
      <HStack w="100%" alignItems="center" justifyContent="flex-end" mb={4}>
        {authState.role === 1 ? (
          <Tooltip
            hasArrow
            placement="left"
            label="Add task list"
            bg="cyan.500">
            <IconButton
              aria-label="Add task list"
              onClick={onOpen}
              icon={<Icon as={FaList} />}
              colorScheme="cyan"
              rounded="md"
              color="white"
            />
          </Tooltip>
        ) : (
          <></>
        )}
        <Tooltip hasArrow placement="left" label="Add task" bg="cyan.500">
          <IconButton
            aria-label="Add task"
            onClick={onAddTaskOpen}
            icon={<Icon as={FaThumbtack} />}
            colorScheme="cyan"
            rounded="md"
            color="white"
          />
        </Tooltip>
      </HStack>

      {taskListsLoading && usersLoading ? (
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
            <TaskListEntry
              key={item.id}
              id={item.id}
              name={item.name}
              tasks={item.tasks}
              users={users?.data?.data}
              assignedIds={assignedIds.filter(list => +list.listId === item.id)}
              setAssignedIds={setAssignedIds}
              handleTaskEdit={(id: number) => setCurrentId(id)}
              handleTaskDelete={(id: number) => handleTaskDelete(id)}
            />
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
      <AddTaskModal
        isOpen={addTaskOpen}
        onClose={() => {
          onAddTaskClose();
          refetchTaskLists();
        }}
      />
      <EditTaskModal
        isOpen={editTaskOpen}
        onClose={() => {
          onEditTaskClose();
          setCurrentId(0);
          refetchTaskLists();
        }}
        taskId={currentId}
      />
    </WideContentPage>
  );
};

export default Tasks;
