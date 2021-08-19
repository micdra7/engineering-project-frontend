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
import { PasswordInput, TextInput } from 'components';
import { Formik } from 'formik';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { TAuthProviderState, useAuth } from 'services/Auth/Auth';
import * as yup from 'yup';

const LoginSchema = yup.object().shape({
  email: yup
    .string()
    .email('Must be a valid email')
    .required('Email is required'),
  password: yup.string().required('Password is required'),
});

const formInitialValues = {
  email: '',
  password: '',
};

type TLoginModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const LoginModal = ({ isOpen, onClose }: TLoginModalProps): JSX.Element => {
  const auth: TAuthProviderState = useAuth();
  const history = useHistory();

  const onSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true);

    if (await auth.login(values)) {
      setSubmitting(false);
      onClose();
      history.push('/client');
    } else {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent bg="cyan.800" color="white" borderColor="white">
        <ModalHeader>Log In</ModalHeader>
        <ModalCloseButton />

        <Formik
          initialValues={formInitialValues}
          validationSchema={LoginSchema}
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
            <form id="login-form" onSubmit={handleSubmit}>
              <ModalBody>
                <TextInput
                  id="email"
                  isRequired
                  isInvalid={
                    touched.email &&
                    errors.email !== undefined &&
                    errors.email !== ''
                  }
                  label="Email address"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errorMessage={touched.email ? errors.email : ''}
                />

                <PasswordInput
                  id="password"
                  isRequired
                  isInvalid={
                    touched.password &&
                    errors.password !== undefined &&
                    errors.password !== ''
                  }
                  label="Password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errorMessage={touched.password ? errors.password : ''}
                />
              </ModalBody>

              <ModalFooter>
                <Button
                  isLoading={isSubmitting}
                  type="submit"
                  colorScheme="cyan">
                  Log in
                </Button>
              </ModalFooter>
            </form>
          )}
        </Formik>
      </ModalContent>
    </Modal>
  );
};

export default LoginModal;
