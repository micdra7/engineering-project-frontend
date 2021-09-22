import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
} from '@chakra-ui/react';
import { TextInput } from 'components';
import { Formik } from 'formik';
import React from 'react';
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

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent bg="cyan.800" color="white" borderColor="white">
        <ModalHeader>Create new chatroom</ModalHeader>
        <ModalCloseButton />

        <Formik
          initialValues={{ name: '', userIds: [] }}
          validationSchema={AddChatroomSchema}
          onSubmit={data => {
            console.log(data);
          }}>
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
