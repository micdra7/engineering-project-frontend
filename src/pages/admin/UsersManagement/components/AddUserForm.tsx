import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Select,
  Text,
} from '@chakra-ui/react';
import { PasswordInput, TextInput, WideContentPage } from 'components';
import { Formik } from 'formik';
import React, { useState } from 'react';
import { useMutation } from 'react-query';
import { useHistory } from 'react-router-dom';
import { API } from 'services/api';
import { validatePassword } from 'services/password';
import { useLogger } from 'services/toast';
import * as yup from 'yup';

const PartialUsersSchema = yup.object({
  email: yup
    .string()
    .email('Must be a valid email')
    .required('Email is required'),
  role: yup.number().is([0, 1]),
});

const FullUsersSchema = yup.object({
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

const AddUserForm = (): JSX.Element => {
  const history = useHistory();
  const logger = useLogger();

  const [isEmailTaken, setEmailTaken] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  const emailMutation = useMutation((data: { email: string }) =>
    API.post('/users/find-by-email', data),
  );
  const addToWorkspaceMutation = useMutation((data: Record<string, unknown>) =>
    API.post('/workspaces/add-user', data),
  );
  const addMutation = useMutation((data: Record<string, unknown>) =>
    API.post('/users', data),
  );

  const handleEmailCheck = async (values, { setSubmitting }) => {
    setSubmitting(true);

    try {
      const { data } = await emailMutation.mutateAsync({ email: values.email });

      setEmailTaken(!!data.id);
      setHasChecked(true);
    } catch (error) {
      logger.error({
        title: 'Error',
        description: error?.response?.data?.message ?? 'Something went wrong',
      });
    }
    setSubmitting(false);
  };

  const handleAddToWorkspace = async (values, { setSubmitting }) => {
    setSubmitting(true);

    try {
      await addToWorkspaceMutation.mutateAsync(values);

      logger.success({
        title: 'Success',
        description: 'User was added to workspace',
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

  const handleCreate = async (values, { setSubmitting }) => {
    setSubmitting(true);

    try {
      await addMutation.mutateAsync(values);

      logger.success({
        title: 'Success',
        description: 'User was successfully created and added to workspace',
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

  if (hasChecked && !isEmailTaken) {
    return (
      <WideContentPage title="Edit user">
        <Text mb={6}>Update user&apos;s information</Text>
        <Formik
          initialValues={{
            email: '',
            firstName: '',
            lastName: '',
            password: '',
            role: 0,
          }}
          validationSchema={FullUsersSchema}
          onSubmit={handleCreate}>
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
          }) => (
            <form id="full-users-form" onSubmit={handleSubmit}>
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
                }>
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
                color="white">
                Add
              </Button>
            </form>
          )}
        </Formik>
      </WideContentPage>
    );
  }

  return (
    <WideContentPage title="Edit user">
      <Text mb={6}>Update user&apos;s information</Text>
      <Formik
        initialValues={{ email: '', role: 0 }}
        validationSchema={PartialUsersSchema}
        onSubmit={!hasChecked ? handleEmailCheck : handleAddToWorkspace}>
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => (
          <form id="partial-user-form" onSubmit={handleSubmit}>
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
              onChange={e => {
                setHasChecked(false);
                setEmailTaken(false);
                handleChange(e);
              }}
              onBlur={handleBlur}
              errorMessage={touched.email ? errors.email : ''}
            />

            {hasChecked && isEmailTaken && (
              <FormControl
                id="role"
                isRequired
                isInvalid={
                  touched.role &&
                  errors.role !== undefined &&
                  errors.role !== ''
                }>
                <FormLabel>Role</FormLabel>
                <Select>
                  <option value={0}>User</option>
                  <option value={1}>Admin</option>
                </Select>
                <FormErrorMessage>
                  {touched.role ? errors.role : ''}
                </FormErrorMessage>
              </FormControl>
            )}

            <Button
              isLoading={isSubmitting}
              type="submit"
              colorScheme="cyan"
              mt={6}
              maxW={['unset', 'unset', '250px']}
              justifySelf="start"
              w="100%"
              color="white">
              {!hasChecked && !isEmailTaken
                ? 'Check if account exists'
                : 'Add user to workspace'}
            </Button>
          </form>
        )}
      </Formik>
    </WideContentPage>
  );
};

export default AddUserForm;
