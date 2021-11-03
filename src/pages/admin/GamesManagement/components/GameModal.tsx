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
import { useMutation, useQuery } from 'react-query';
import { API } from 'services/api';

const GameSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
});

type TGameModalProps = {
  isOpen: boolean;
  onClose: () => void;
  gameId?: number;
};

const GameModal = ({
  isOpen,
  onClose,
  gameId,
}: TGameModalProps): JSX.Element => {
  const logger = useLogger();
  const addGameMutation = useMutation((data: FormData) =>
    API.post('/games', data),
  );
  const editGameMutation = useMutation((data: FormData) =>
    API.patch(`/games/${gameId}`, data),
  );

  const { data: game } = useQuery(
    `/games/${gameId}`,
    () => API.get(`/games/${gameId}`),
    { enabled: !!gameId },
  );
  const [files, setFiles] = useState<FilePondFile[]>([]);

  const onSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('name', values.name);
      if (files?.[0]) formData.append('file', files[0].file);

      if (gameId) await editGameMutation.mutateAsync(formData);
      else await addGameMutation.mutateAsync(formData);

      logger.success({
        title: 'Success',
        description: gameId
          ? 'Game updated successfully'
          : 'Game added successfully',
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
          initialValues={{ name: game?.data?.name ?? '' }}
          enableReinitialize
          validationSchema={GameSchema}
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
                  required={!gameId}
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

export default GameModal;
