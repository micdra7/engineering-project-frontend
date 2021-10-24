import React from 'react';
import { useLogger } from 'services/toast';
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
import * as yup from 'yup';
import { Formik } from 'formik';
import { TextInput } from 'components';

const AddGameSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
});

type TAddGameModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const AddGameModal = ({ isOpen, onClose }: TAddGameModalProps): JSX.Element => {
  const logger = useLogger();

  const onSubmit = () => {};

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent bg="cyan.800" color="white" borderColor="white">
        <ModalHeader>Create a new game</ModalHeader>
        <ModalCloseButton />

        <Formik
          initialValues={{ name: '' }}
          validationSchema={AddGameSchema}
          onSubmit={onSubmit}>
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
          }) => (
            <form id="add-game-form">
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
            </form>
          )}
        </Formik>
      </ModalContent>
    </Modal>
  );
};
