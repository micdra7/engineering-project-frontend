import { Grid, Heading } from '@chakra-ui/react';
import { Formik } from 'formik';
import React from 'react';
import * as yup from 'yup';
import { validatePassword } from '../../utils/helper';
import ProfileForm from './components/ProfileForm';

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
      value => validatePassword(value || ''),
    ),
});

const Profile = (): JSX.Element => (
  <Grid flexBasis="100%" maxW="800px">
    <Heading
      color="green.500"
      mb={4}
      w="100%"
      textAlign={['center', 'center', 'left']}>
      Edit Profile
    </Heading>
    <Formik
      enableReinitialize
      initialValues={{ email: '', firstName: '', lastName: '', password: '' }}
      validationSchema={ProfileSchema}
      onSubmit={async values => {
        console.log(values);
      }}>
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
          id="profile"
          onSubmit={event => {
            event.preventDefault();
            handleSubmit();
          }}>
          <ProfileForm
            values={values}
            errors={errors}
            touched={touched}
            handleChange={handleChange}
            handleBlur={handleBlur}
            isSubmitting={isSubmitting}
          />
        </form>
      )}
    </Formik>
  </Grid>
);

export default Profile;
