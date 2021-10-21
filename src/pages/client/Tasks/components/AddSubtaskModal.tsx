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

const SubtaskSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
});

type TAddSubtaskModalProps = {
  isOpen: boolean;
  onClose: () => void;
  parentTaskId: number;
  taskListId: number;
};

const AddSubtaskModal = ({
  isOpen,
  onClose,
  parentTaskId,
  taskListId,
}: TAddSubtaskModalProps): JSX.Element => {
  const logger = useLogger();
  const mutation = useMutation((data: Record<string, unknown>) =>
    API.post('/tasks', data),
  );

  const onSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true);

    try {
      await mutation.mutateAsync({
        name: values.name,
        description: `subtask for task ${parentTaskId}`,
        taskListId,
        parentTaskId,
        startDate: new Date(),
        finishDate: new Date(),
        assignedUserIds: [],
      });
      logger.success({
        title: 'Success',
        description: 'Subtask added successfully',
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
      <ModalContent bg="cyan.700" color="white" borderColor="white">
        <ModalHeader>Add subtask</ModalHeader>
        <ModalCloseButton />

        <Formik
          initialValues={{ name: '' }}
          validationSchema={SubtaskSchema}
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
            <form id="add-subtask-form" onSubmit={handleSubmit}>
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
                  Save
                </Button>
              </ModalFooter>
            </form>
          )}
        </Formik>
      </ModalContent>
    </Modal>
  );
};

export default AddSubtaskModal;
