import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { TextInput } from 'components';
import { Formik } from 'formik';
import React from 'react';
import { useMutation } from 'react-query';
import { API } from 'services/api';
import { useLogger } from 'services/toast';
import * as yup from 'yup';

const AddTaskListSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
});

type TAddListModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const AddListModal = ({ isOpen, onClose }: TAddListModalProps): JSX.Element => {
  const logger = useLogger();
  const addTaskListMutation = useMutation((data: Record<string, unknown>) =>
    API.post('/tasklists', data),
  );

  const onSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true);

    try {
      await addTaskListMutation.mutateAsync({ name: values.name });

      logger.success({
        title: 'Success',
        description: 'Task list created successfully',
      });
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
        <ModalHeader>Create a new task list</ModalHeader>
        <ModalCloseButton />

        <Formik
          initialValues={{ name: '' }}
          validationSchema={AddTaskListSchema}
          onSubmit={onSubmit}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
          }) => (
            <form id="add-tasklist-form" onSubmit={handleSubmit}>
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
              </ModalBody>

              <ModalFooter>
                <Button
                  isLoading={isSubmitting}
                  type="submit"
                  colorScheme="cyan"
                  color="white"
                >
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

export default AddListModal;
