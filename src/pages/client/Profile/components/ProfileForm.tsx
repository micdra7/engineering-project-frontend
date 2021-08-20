import { Button, Grid } from '@chakra-ui/react';
import { PasswordInput, TextInput } from 'components';
import { Formik } from 'formik';
import React from 'react';
import { validatePassword } from 'services/password';
import * as yup from 'yup';

const ProfileSchema = yup.object().shape({
  email: yup
    .string()
    .email('Must be a valid email')
    .required('Email is required'),
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  password: yup
    .string()
    .test(
      'len',
      'Must be at least 8 characters and have at least one lowercase, one uppercase and one special character',
      value => (value && value.length > 0 ? validatePassword(value) : true),
    ),
});

type TProfileFormProps = {
  initialFormValues: {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
  };

  onSubmit: (values, { setSubmitting }) => void;
};

const ProfileForm = ({
  initialFormValues,
  onSubmit,
}: TProfileFormProps): JSX.Element => (
  <Formik
    initialValues={initialFormValues}
    validationSchema={ProfileSchema}
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
      <form style={{ width: '100%' }} id="profile-form" onSubmit={handleSubmit}>
        <Grid w="100%">
          <TextInput
            id="email"
            isRequired
            isInvalid={
              touched.email && errors.email !== undefined && errors.email !== ''
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

          <Button
            maxW="200px"
            isLoading={isSubmitting}
            type="submit"
            colorScheme="cyan"
            mt="32px">
            Save
          </Button>
        </Grid>
      </form>
    )}
  </Formik>
);

export default ProfileForm;
