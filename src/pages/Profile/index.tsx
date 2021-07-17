import { Grid, Heading, useToast } from '@chakra-ui/react';
import { AxiosError } from 'axios';
import { Formik } from 'formik';
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import * as yup from 'yup';
import { UpdateDto } from '../../dto/update.dto';
import { REQUEST_STATUS } from '../../resources/endpoints';
import { userRoutes } from '../../resources/routes';
import { ProfileResponse } from '../../response/profile.response';
import UsersService from '../../services/users';
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
      value => (value && value.length > 0 ? validatePassword(value) : true),
    ),
});

const Profile = (): JSX.Element => {
  const toast = useToast();
  const history = useHistory();

  const [isLoading, setLoading] = useState(true);
  const [user, setUser] = useState({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
  });

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const result = await UsersService.getCurrentUserProfile();

      if (result.status === REQUEST_STATUS.SUCCESS) {
        const data = result.data as ProfileResponse;
        setUser({ ...data, password: '' });
      } else {
        toast({
          // eslint-disable-next-line quotes
          title: "Couldn't load your profile. Please try again later",
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        history.push(userRoutes.DASHBOARD);
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  return (
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
        initialValues={user}
        validationSchema={ProfileSchema}
        onSubmit={async (values, { resetForm, setSubmitting }) => {
          setSubmitting(true);
          const dto: UpdateDto = {
            email: values.email,
            firstName: values.firstName,
            lastName: values.lastName,
            password: values.password === '' ? undefined : values.password,
          };

          const result = await UsersService.updateCurrentUser(dto);

          if (result.status === REQUEST_STATUS.SUCCESS) {
            const data = result.data as ProfileResponse;
            setUser({ ...data, password: '' });

            toast({
              title: 'Successfully updated',
              status: 'success',
              duration: 5000,
              isClosable: true,
            });
          } else {
            toast({
              // eslint-disable-next-line quotes
              title: "Couldn't update at the moment. Please try again later",
              description: (result.error as AxiosError).message ?? undefined,
              status: 'error',
              duration: 5000,
              isClosable: true,
            });
          }

          setSubmitting(false);
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
              isLoading={isLoading}
            />
          </form>
        )}
      </Formik>
    </Grid>
  );
};

export default Profile;
