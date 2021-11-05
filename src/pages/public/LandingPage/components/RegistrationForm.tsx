import { Button, Grid, Heading } from '@chakra-ui/react';
import { PasswordInput, TextInput } from 'components';
import { Formik } from 'formik';
import React from 'react';
import { TAuthProviderState, useAuth } from 'services/Auth/Auth';
import { validatePassword } from 'services/password';
import * as yup from 'yup';

const RegistrationSchema = yup.object().shape({
  email: yup
    .string()
    .email('Must be a valid email')
    .required('Email is required'),
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  password: yup
    .string()
    .required('Password is required')
    .test(
      'len',
      'Must be at least 8 characters and have at least one lowercase, one uppercase and one special character',
      value => validatePassword(value || ''),
    ),
  workspaceName: yup.string().required('Workspace name is required'),
});

const formInitialValues = {
  email: '',
  firstName: '',
  lastName: '',
  password: '',
  workspaceName: '',
};

const RegistrationForm = (): JSX.Element => {
  const auth: TAuthProviderState = useAuth();

  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    setSubmitting(true);

    if (await auth.register(values)) {
      resetForm();
    }

    setSubmitting(false);
  };

  return (
    <Formik
      initialValues={formInitialValues}
      validationSchema={RegistrationSchema}
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
        <form
          style={{ width: '100%' }}
          id="registration-form"
          onSubmit={handleSubmit}
        >
          <Grid
            w="100%"
            maxW="880px"
            mx="auto"
            templateColumns="1fr"
            rowGap="0.5em"
            justifyItems="center"
          >
            <Heading>Create an account</Heading>

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

            <TextInput
              id="firstName"
              isRequired
              isInvalid={
                touched.firstName &&
                errors.firstName !== undefined &&
                errors.firstName !== ''
              }
              label="First Name"
              value={values.firstName}
              onChange={handleChange}
              onBlur={handleBlur}
              errorMessage={touched.firstName ? errors.firstName : ''}
            />

            <TextInput
              id="lastName"
              isRequired
              isInvalid={
                touched.lastName &&
                errors.lastName !== undefined &&
                errors.lastName !== ''
              }
              label="Last Name"
              value={values.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
              errorMessage={touched.lastName ? errors.lastName : ''}
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

            <TextInput
              id="workspaceName"
              isRequired
              isInvalid={
                touched.workspaceName &&
                errors.workspaceName !== undefined &&
                errors.workspaceName !== ''
              }
              label="Workspace Name"
              value={values.workspaceName}
              onChange={handleChange}
              onBlur={handleBlur}
              errorMessage={touched.workspaceName ? errors.workspaceName : ''}
            />

            <Button
              w={['100%', '100%', '100%', 'auto']}
              isLoading={isSubmitting}
              type="submit"
              colorScheme="cyan"
              color="white"
            >
              Register
            </Button>
          </Grid>
        </form>
      )}
    </Formik>
  );
};

export default RegistrationForm;
