import React, { useEffect, useState } from 'react';
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
import { FileInput, TextInput } from 'components';
import { FilePondFile } from 'filepond';
import { useMutation } from 'react-query';
import { API } from 'services/api';

const AddGameSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
});

type TAddGameModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const AddGameModal = ({ isOpen, onClose }: TAddGameModalProps): JSX.Element => {
  const logger = useLogger();
  const addGameMutation = useMutation((data: FormData) =>
    API.post('/games', data),
  );

  const [files, setFiles] = useState<FilePondFile[]>([]);

  const onSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('file', files[0].file);

      await addGameMutation.mutateAsync(formData);

      logger.success({
        title: 'Success',
        description: 'Game added successfully',
      });
      onClose();
    } catch (error) {
      logger.error({
        title: 'Error',
        description: error?.response?.data?.message ?? 'Something went wrong',
      });
    }
  };

  useEffect(() => {
    setFiles([]);
  }, [isOpen]);

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
            isSubmitting,
          }) => (
            <form id="add-game-form" onSubmit={handleSubmit}>
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
                <FileInput
                  files={files}
                  setFiles={setFiles}
                  required
                  acceptedFileTypes={[
                    'application/javascript',
                    'application/x-javascript',
                    'application/ecmascript',
                    'text/javascript',
                    'text/ecmascript',
                  ]}
                />
              </ModalBody>

              <ModalFooter>
                <Button
                  isLoading={isSubmitting}
                  type="submit"
                  colorScheme="cyan"
                  color="white">
                  Add
                </Button>
              </ModalFooter>
            </form>
          )}
        </Formik>
      </ModalContent>
    </Modal>
  );
};

export default AddGameModal;
