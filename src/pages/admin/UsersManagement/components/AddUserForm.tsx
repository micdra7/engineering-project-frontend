import { Formik } from 'formik';
import React from 'react';
import { useState } from 'react-dom/node_modules/@types/react';
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

      setEmailTaken(!!data);
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

  if (isEmailTaken) {
    return (
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
            xd
          </form>
        )}
      </Formik>
    );
  }

  return <div>xd</div>;
};

export default AddUserForm;
