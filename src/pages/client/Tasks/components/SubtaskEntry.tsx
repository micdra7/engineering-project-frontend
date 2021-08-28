import { Checkbox, Divider } from '@chakra-ui/react';
import React from 'react';
import { useMutation } from 'react-query';
import { API } from 'services/api';
import { useLogger } from 'services/toast';

type TSubtaskEntryProps = {
  subtaskId: number;
  name: string;
  isDone: boolean;
  onStatusChange: () => void;
};

const SubtaskEntry = ({
  subtaskId,
  name,
  isDone,
  onStatusChange,
}: TSubtaskEntryProps): JSX.Element => {
  const logger = useLogger();
  const mutation = useMutation((data: Record<string, unknown>) =>
    API.patch(`/tasks/${subtaskId}/update-status`, data),
  );

  const changeStatus = async () => {
    try {
      await mutation.mutateAsync({ id: subtaskId, isDone: !isDone });
      onStatusChange();
    } catch (error) {
      logger.error({
        title: 'Error',
        description: error?.response?.data?.message ?? 'Something went wrong',
      });
    }
  };

  return (
    <>
      <Checkbox
        size="lg"
        colorScheme="cyan"
        isChecked={isDone}
        onChange={changeStatus}>
        {name}
      </Checkbox>
      <Divider my={2} />
    </>
  );
};

export default SubtaskEntry;
