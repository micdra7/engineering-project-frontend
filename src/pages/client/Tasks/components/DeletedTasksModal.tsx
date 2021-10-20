import React, { useEffect, useState } from 'react';
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { useQuery } from 'react-query';
import { API } from 'services/api';
import DeletedTaskListEntry from './DeletedTaskListEntry';

type TDeletedTasksModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const DeletedTasksModal = ({
  isOpen,
  onClose,
}: TDeletedTasksModalProps): JSX.Element => {
  const { data: taskLists, refetch: refetchTaskLists } = useQuery(
    '/tasklists/deleted',
    () => API.get('/tasklists/deleted?page=1&limit=9999'),
  );
  const { data: users } = useQuery('/users', () =>
    API.get('/users?page=1&limit=9999'),
  );

  const [assignedIds, setAssignedIds] = useState<
    {
      taskId: string;
      listId: string;
      ids: number[];
    }[]
  >([]);

  useEffect(() => {
    if (isOpen) refetchTaskLists();
  }, [isOpen]);

  useEffect(() => {
    if (taskLists) {
      const taskItems: { taskId: string; listId: string; ids: number[] }[] = [];

      taskLists.data.data.forEach(list => {
        list.tasks.forEach(t => {
          taskItems.push({
            taskId: t.id,
            listId: list.id,
            ids: t.assignedUserIds,
          });
        });
      });

      setAssignedIds(taskItems);
    }
  }, [taskLists]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent bg="cyan.800" color="white" borderColor="white">
        <ModalHeader>Browse deleted tasks</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          {taskLists?.data?.data?.map(item => (
            <DeletedTaskListEntry
              key={item.id}
              id={item.id}
              name={item.name}
              tasks={item.tasks}
              users={users?.data?.data}
              assignedIds={assignedIds.filter(list => +list.listId === item.id)}
              setAssignedIds={setAssignedIds}
            />
          ))}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default DeletedTasksModal;
