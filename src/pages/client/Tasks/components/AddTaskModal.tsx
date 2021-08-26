/* eslint-disable react/forbid-prop-types */
import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import * as yup from 'yup';
import { Formik } from 'formik';
import { TextInput, Select } from 'components';
import { API } from 'services/api';
import { useLogger } from 'services/toast';
import UsersSelector from './UsersSelector';

const AddTaskSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  description: yup.string().required('Description is required'),
  taskListId: yup.string().required('Task list is required'),
  userIds: yup.array(yup.number()),
});

type TAddTaskModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const AddTaskModal = ({ isOpen, onClose }: TAddTaskModalProps): JSX.Element => {
  const logger = useLogger();
  const mutation = useMutation((data: Record<string, unknown>) =>
    API.post('/tasks', data),
  );

  const [assignedIds, setAssignedIds] = useState<
    {
      taskId: string;
      listId: string;
      ids: number[];
    }[]
  >([]);

  const { data: taskLists } = useQuery('/tasklists', () =>
    API.get('/tasklists?page=1&limit=9999'),
  );
  const { data: users } = useQuery('/users', () =>
    API.get('/users?page=1&limit=9999'),
  );

  const onSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true);

    try {
      await mutation.mutateAsync({
        name: values.name,
        description: values.description,
        taskListId: +values.taskListId,
        startDate: new Date(),
        assignedUserIds: assignedIds[0].ids.map(item => +item),
      });
      logger.success({
        title: 'Success',
        description: 'Task added successfully',
      });
      setAssignedIds([]);
      onClose();
    } catch (error) {
      logger.error({
        title: 'Error',
        description: error?.response?.data?.message ?? 'Something went wrong',
      });
    }

    setSubmitting(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent bg="cyan.800" color="white" borderColor="white">
        <ModalHeader>Create a new task</ModalHeader>
        <ModalCloseButton />

        <Formik
          initialValues={{
            name: '',
            description: '',
            taskListId: '',
            userIds: [],
          }}
          validationSchema={AddTaskSchema}
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
            <form id="add-task-form" onSubmit={handleSubmit}>
              <ModalBody>
                <TextInput
                  id="name"
                  isRequired
                  isInvalid={
                    touched.name &&
                    errors.name !== undefined &&
                    errors.name !== ''
                  }
                  label="Name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errorMessage={touched.name ? errors.name : ''}
                />
                <TextInput
                  id="description"
                  isRequired
                  isInvalid={
                    touched.description &&
                    errors.description !== undefined &&
                    errors.description !== ''
                  }
                  label="Description"
                  value={values.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errorMessage={touched.description ? errors.description : ''}
                />
                <Select
                  id="taskListId"
                  isRequired
                  isInvalid={
                    touched.taskListId &&
                    errors.taskListId !== undefined &&
                    errors.taskListId !== ''
                  }
                  label="Description"
                  value={`${values.taskListId}`}
                  options={taskLists?.data?.data?.map(list => ({
                    value: `${list.id}`,
                    label: list.name,
                  }))}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errorMessage={touched.taskListId ? errors.taskListId : ''}
                />

                {!!values.taskListId && (
                  <Box mt={8}>
                    <UsersSelector
                      taskId={0}
                      taskListId={0}
                      users={users?.data?.data}
                      assignedIds={
                        assignedIds.find(list => list.listId === '0')?.ids ?? []
                      }
                      setAssignedIds={setAssignedIds}
                    />
                  </Box>
                )}
              </ModalBody>

              <ModalFooter>
                <Button
                  isLoading={isSubmitting}
                  type="submit"
                  colorScheme="cyan"
                  color="white">
                  Create
                </Button>
              </ModalFooter>
            </form>
          )}
        </Formik>
      </ModalContent>
    </Modal>
  );
};

export default AddTaskModal;
