import { Grid } from '@chakra-ui/react';
import { Formik } from 'formik';
import React from 'react';
import { useHistory } from 'react-router-dom';
import * as yup from 'yup';
import { LoginDto } from '../../dto/login.dto';
import { RegisterDto } from '../../dto/register.dto';
import { userRoutes } from '../../resources/routes';
import { AuthState, useAuth } from '../../store/auth';
import { validatePassword } from '../../utils/helper';
import LogInForm from './components/LogInForm';
import RegisterForm from './components/RegisterForm';

const LogInSchema = yup.object().shape({
  email: yup
    .string()
    .email('Must be a valid email')
    .required('Email is required'),
  password: yup.string().required('Password is required'),
});

const RegisterSchema = yup.object().shape({
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

const SignUp = (): JSX.Element => {
  const auth: AuthState = useAuth();
  const history = useHistory();

  return (
    <Grid
      flexBasis="100%"
      maxW="1440px"
      gridTemplateColumns={['1fr', '1fr', '0.75fr 1fr']}
      columnGap={16}
      mb={4}
      mt={[2, 2, 4]}>
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={LogInSchema}
        onSubmit={async values => {
          if (auth && auth.logIn) {
            const dto: LoginDto = {
              ...values,
            };

            const result: boolean = await (
              auth.logIn as (dto: LoginDto) => Promise<boolean>
            )(dto);

            if (result) {
              history.push(userRoutes.DASHBOARD);
            }
          }
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
            id="log-in"
            onSubmit={event => {
              event.preventDefault();
              handleSubmit();
            }}>
            <LogInForm
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
      <Formik
        initialValues={{
          email: '',
          firstName: '',
          lastName: '',
          password: '',
          workspaceName: '',
        }}
        validationSchema={RegisterSchema}
        onSubmit={async (values, { resetForm, setSubmitting }) => {
          if (auth && auth.register) {
            setSubmitting(true);
            const dto: RegisterDto = {
              ...values,
            };

            const result: boolean = await (
              auth.register as (dto: RegisterDto) => Promise<boolean>
            )(dto);

            if (result) {
              resetForm();
            }

            setSubmitting(false);
          }
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
            id="register"
            onSubmit={event => {
              event.preventDefault();
              handleSubmit();
            }}>
            <RegisterForm
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
};

export default SignUp;