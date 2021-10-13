/* eslint-disable react/forbid-prop-types */
import {
  Modal,
  ModalOverlay,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  FormControl,
  FormLabel,
  Input,
  ModalBody,
  ModalFooter,
  Button,
  Box,
} from '@chakra-ui/react';
import { TextInput } from 'components';
import { Formik } from 'formik';
import React, { useState } from 'react';
import { useLogger } from 'services/toast';
import * as yup from 'yup';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/airbnb.css';
import UsersSelector from 'pages/client/Tasks/components/UsersSelector';
import { useMutation, useQuery } from 'react-query';
import { API } from 'services/api';

const AddCallSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  assignedUserIds: yup.array(yup.number()),
  startDate: yup.date().required('Start date is required'),
  finishDate: yup.date().required('Start date is required'),
});

type TAddCallModal = {
  isOpen: boolean;
  onClose: () => void;
};

const AddCallModal = ({ isOpen, onClose }: TAddCallModal): JSX.Element => {
  const logger = useLogger();
  const mutation = useMutation((data: Record<string, unknown>) =>
    API.post('/calls', data),
  );

  const { data: users } = useQuery('/users', () =>
    API.get('/users?page=1&limit=9999'),
  );

  const [assignedIds, setAssignedIds] = useState<
    {
      taskId: string;
      listId: string;
      ids: number[];
    }[]
  >([]);

  const onSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true);

    try {
      await mutation.mutateAsync({
        name: values.name,
        startDate: values.startDate[0],
        finishDate: values.finishDate[0],
        assignedUserIds: assignedIds[0]?.ids?.map(item => +item) ?? [],
      });

      logger.success({
        title: 'Success',
        description: 'Call added successfully',
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
        <ModalHeader>Schedule a call</ModalHeader>
        <ModalCloseButton />

        <Formik
          initialValues={{
            name: '',
            assignedUserIds: [],
            startDate: new Date(),
            finishDate: new Date(),
          }}
          validationSchema={AddCallSchema}
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
            <form id="add-call-form" onSubmit={handleSubmit}>
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

                <FormControl
                  id="startDate"
                  isRequired
                  isInvalid={
                    touched.startDate &&
                    errors.startDate !== undefined &&
                    errors.startDate !== ''
                  }>
                  <FormLabel>Start date</FormLabel>
                  <Flatpickr
                    value={values.startDate}
                    onChange={date =>
                      handleChange({ target: { value: date, id: 'startDate' } })
                    }
                    render={({ defaultValue }, ref) => (
                      <Input defaultValue={defaultValue} ref={ref} />
                    )}
                    options={{
                      enableTime: true,
                      dateFormat: 'Y-m-d H:i',
                      minDate: new Date(),
                    }}
                  />
                </FormControl>

                <FormControl
                  id="finishDate"
                  isInvalid={
                    touched.finishDate &&
                    errors.finishDate !== undefined &&
                    errors.finishDate !== ''
                  }>
                  <FormLabel>Finish date</FormLabel>
                  <Flatpickr
                    value={values.finishDate}
                    onChange={date =>
                      handleChange({
                        target: { value: date, id: 'finishDate' },
                      })
                    }
                    render={({ defaultValue }, ref) => (
                      <Input defaultValue={defaultValue} ref={ref} />
                    )}
                    options={{
                      enableTime: true,
                      dateFormat: 'Y-m-d H:i',
                      minDate: new Date(),
                    }}
                  />
                </FormControl>
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

export default AddCallModal;
