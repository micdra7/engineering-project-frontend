import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Box,
  Text,
} from '@chakra-ui/react';
import { TextInput } from 'components';
import { Formik } from 'formik';
import UsersSelector from 'pages/client/Tasks/components/UsersSelector';
import React, { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { API } from 'services/api';
import { useLogger } from 'services/toast';
import * as yup from 'yup';

const AddChatroomSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  userIds: yup.array(yup.number()).required('Users are required'),
});

type TAddChatroomModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const AddChatroomModal = ({
  isOpen,
  onClose,
}: TAddChatroomModalProps): JSX.Element => {
  const logger = useLogger();
  const { data: users } = useQuery('/users', () =>
    API.get('/users?page=1&limit=9999'),
  );
  const mutation = useMutation((data: Record<string, unknown>) =>
    API.post('/chatrooms', data),
  );

  const [assignedIds, setAssignedIds] = useState<
    {
      taskId: string;
      listId: string;
      ids: number[];
    }[]
  >([]);

  const onSubmit = async (values, { setSubmitting }) => {
    const selectedUsers = assignedIds.map(item => item.ids).flat();

    if (selectedUsers.length < 2) {
      logger.warning({
        description:
          'At least 2 users have to be assigned to a room in order to create it',
      });
      return;
    }

    setSubmitting(true);

    try {
      await mutation.mutateAsync({
        name: values.name,
        assignedUserIds: selectedUsers,
      });

      logger.success({
        title: 'Success',
        description: 'Chatroom added successfully',
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
        <ModalHeader>Create new chatroom</ModalHeader>
        <ModalCloseButton />

        <Formik
          initialValues={{ name: '', userIds: [] }}
          validationSchema={AddChatroomSchema}
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
            <form id="add-chatroom-form" onSubmit={handleSubmit}>
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
                <Box mt={2}>
                  <Text>Select users</Text>
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

export default AddChatroomModal;
