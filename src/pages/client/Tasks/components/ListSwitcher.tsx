import {
  Button,
  Icon,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  useDisclosure,
} from '@chakra-ui/react';
import { Formik } from 'formik';
import React from 'react';
import { FaBars } from 'react-icons/fa';
import { useMutation, useQuery } from 'react-query';
import { API } from 'services/api';
import { useLogger } from 'services/toast';
import * as yup from 'yup';
import { Select } from 'components';

const ListSwitchSchema = yup.object().shape({
  taskListId: yup
    .string()
    .required('List is required')
    .test('value', 'List is required', value => value !== '-1'),
});

type TListSwitcherProps = {
  taskId: number;
  taskListId: number;
};

const ListSwitcher = ({
  taskId,
  taskListId,
}: TListSwitcherProps): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const logger = useLogger();
  const { data: taskLists, refetch: refetchTaskLists } = useQuery(
    '/tasklists',
    () => API.get('/tasklists?page=1&limit=9999'),
  );
  const mutation = useMutation((data: Record<string, unknown>) =>
    API.patch(`/tasks/${taskId}/change-list`, data),
  );

  const onSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true);

    try {
      await mutation.mutateAsync({ taskId, listId: +values.taskListId });
      onClose();
      refetchTaskLists();
    } catch (error) {
      logger.error({
        title: 'Error',
        description: error?.response?.data?.message ?? 'Something went wrong',
      });
    }

    setSubmitting(false);
  };

  return (
    <Popover strategy="fixed" isOpen={isOpen} onClose={onClose}>
      <PopoverTrigger>
        <IconButton
          rounded="md"
          colorScheme="cyan"
          icon={<Icon as={FaBars} color="white" />}
          aria-label="Change list"
          onClick={onOpen}
        />
      </PopoverTrigger>
      <PopoverContent bg="cyan.500" color="white" maxW="200px">
        <PopoverHeader fontWeight="bold">Lists</PopoverHeader>
        <PopoverArrow bg="cyan.500" />
        <PopoverCloseButton />

        <Formik
          initialValues={{ taskListId: `${taskListId}` }}
          enableReinitialize
          validationSchema={ListSwitchSchema}
          onSubmit={onSubmit}>
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
          }) => (
            <form id={`list-switch-form-${taskId}`} onSubmit={handleSubmit}>
              <PopoverBody>
                <Select
                  id="taskListId"
                  isRequired
                  isInvalid={
                    touched.taskListId &&
                    errors.taskListId !== undefined &&
                    errors.taskListId !== ''
                  }
                  label="List"
                  value={`${values.taskListId}`}
                  options={taskLists?.data?.data?.map(list => ({
                    value: `${list.id}`,
                    label: list.name,
                  }))}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errorMessage={touched.taskListId ? errors.taskListId : ''}
                />
              </PopoverBody>
              <PopoverFooter>
                <Button
                  isLoading={isSubmitting}
                  type="submit"
                  colorScheme="cyan"
                  color="white">
                  Save
                </Button>
              </PopoverFooter>
            </form>
          )}
        </Formik>
      </PopoverContent>
    </Popover>
  );
};

export default ListSwitcher;
