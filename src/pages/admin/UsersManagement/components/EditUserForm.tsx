import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  Select,
  Text,
} from '@chakra-ui/react';
import { Loader, PasswordInput, TextInput, WideContentPage } from 'components';
import { Formik } from 'formik';
import React from 'react';
import { useMutation, useQuery } from 'react-query';
import { useHistory, useParams } from 'react-router-dom';
import { API } from 'services/api';
import { validatePassword } from 'services/password';
import { useLogger } from 'services/toast';
import * as yup from 'yup';

const UserSchema = yup.object().shape({
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
  role: yup.number().is([0, 1]),
});

const formInitialValues = {
  email: '',
  firstName: '',
  lastName: '',
  password: '',
  role: 0,
};

const EditUserForm = (): JSX.Element => {
  const history = useHistory();
  const logger = useLogger();

  const { userId } = useParams<{ userId: string }>();
  const {
    isSuccess: userLoaded,
    isLoading: userLoading,
    data: user,
  } = useQuery(`/users/${userId}`, () => API.get(`/users/${userId}`));
  const mutation = useMutation(data => API.patch(`/users/${userId}`, data));

  const onSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true);

    try {
      await mutation.mutateAsync({ ...values, role: +values.role });

      logger.success({
        title: 'Success',
        description: 'User updated successfully',
      });
      history.push('/admin/users');
    } catch (error) {
      logger.error({
        title: 'Error',
        description: error?.response?.data?.message ?? 'Something went wrong',
      });
    }

    setSubmitting(false);
  };

  return (
    <WideContentPage title="Edit user">
      <Text mb={6}>Update user&apos;s information</Text>
      <Formik
        initialValues={
          userLoaded && user
            ? { ...user.data, password: '' }
            : formInitialValues
        }
        enableReinitialize
        validationSchema={UserSchema}
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
            id="user-form"
            onSubmit={handleSubmit}
          >
            <Grid w="100%">
              {userLoading ? (
                <Loader />
              ) : (
                <>
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

                  <FormControl
                    id="role"
                    isRequired
                    isInvalid={
                      touched.role &&
                      errors.role !== undefined &&
                      errors.role !== ''
                    }
                  >
                    <FormLabel>Role</FormLabel>
                    <Select value={values.role} onChange={handleChange}>
                      <option value={0}>User</option>
                      <option value={1}>Admin</option>
                    </Select>
                    <FormErrorMessage>
                      {touched.role ? errors.role : ''}
                    </FormErrorMessage>
                  </FormControl>

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
                    mt="32px"
                  >
                    Save
                  </Button>
                </>
              )}
            </Grid>
          </form>
        )}
      </Formik>
    </WideContentPage>
  );
};

export default EditUserForm;
