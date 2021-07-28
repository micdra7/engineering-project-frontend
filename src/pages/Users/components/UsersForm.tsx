import { Grid, useToast } from '@chakra-ui/react';
import { AxiosError } from 'axios';
import { Formik } from 'formik';
import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import * as yup from 'yup';
import { REQUEST_STATUS } from '../../../resources/endpoints';
import { adminRoutes } from '../../../resources/routes';
import { ErrorResponse } from '../../../response/error.response';
import { ProfileResponse } from '../../../response/profile.response';
import UsersService from '../../../services/users';
import WorkspacesService from '../../../services/workspaces';
import { useAuth } from '../../../store/auth';
import { validatePassword } from '../../../utils/helper';
import FullUsersForm from './FullUsersForm';
import PartialUsersForm from './PartialUsersForm';

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

const fetchUser = async (
  id: number,
  onSuccess: (data: ProfileResponse) => void,
  onError: (error: AxiosError) => void,
) => {
  const result = await UsersService.findOne(id);

  if (result.status === REQUEST_STATUS.SUCCESS) {
    onSuccess(result.data as ProfileResponse);
  } else {
    onError(result.error as AxiosError);
  }
};

const UsersForm = (): JSX.Element => {
  const toast = useToast();
  const auth = useAuth();
  const history = useHistory();
  const params: { id: string } = useParams();

  const [user, setUser] = useState<{
    email: string;
    firstName: string;
    lastName: string;
    role?: number;
  }>({
    email: '',
    firstName: '',
    lastName: '',
    role: 0,
  });
  const [isLoading, setLoading] = useState(false);
  const [isEmailTaken, setEmailTaken] = useState(!+params.id);
  const [hasChecked, setHasChecked] = useState(!!+params.id);

  useEffect(() => {
    if (params.id) {
      setLoading(true);
      fetchUser(
        +params.id,
        data => {
          setUser(data as ProfileResponse);
          setLoading(false);
        },
        error => {
          toast({
            title: 'Could not load users list',
            description:
              error.response?.status === 400
                ? (error.response.data as ErrorResponse).message ??
                  'Something went wrong. Please try again later'
                : undefined,
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
          setLoading(false);
        },
      );
    }
  }, [params.id]);

  return (
    <Grid flexBasis="100%" maxW="800px" w="100%" mb={4} mt={[2, 2, 4]}>
      {isEmailTaken ? (
        <Formik
          initialValues={{ email: '', role: 0 }}
          validationSchema={PartialUsersSchema}
          onSubmit={async (values, { setSubmitting }) => {
            setSubmitting(true);

            if (!hasChecked) {
              const result = await UsersService.findByEmail(values.email);

              if (result.status === REQUEST_STATUS.SUCCESS) {
                setEmailTaken(!!result.data);
                setHasChecked(true);
              }
            } else {
              const result = await WorkspacesService.addUserToWorkspace({
                ...values,
              });

              if (result.status === REQUEST_STATUS.SUCCESS) {
                toast({
                  title: 'User successfully added to workspace',
                  status: 'success',
                  duration: 5000,
                  isClosable: true,
                });
                history.push(adminRoutes.USERS_MANAGEMENT);
              } else {
                toast({
                  title: 'Could not add user to workspace',
                  description:
                    (result.error as AxiosError<ErrorResponse>).response?.data
                      .message ??
                    'Something went wrong. Please try again later',
                  status: 'error',
                  duration: 5000,
                  isClosable: true,
                });
              }
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
              id="partial-user"
              onSubmit={event => {
                event.preventDefault();
                handleSubmit();
              }}>
              <PartialUsersForm
                values={values}
                errors={errors}
                touched={touched}
                handleChange={handleChange}
                handleBlur={handleBlur}
                isSubmitting={isSubmitting}
                hasChecked={hasChecked}
                isEmailTaken={isEmailTaken}
                setHasChecked={setHasChecked}
                setEmailTaken={setEmailTaken}
              />
            </form>
          )}
        </Formik>
      ) : (
        <Formik
          enableReinitialize
          initialValues={{ ...user, password: '' }}
          validationSchema={FullUsersSchema}
          onSubmit={async (values, { setSubmitting }) => {
            setSubmitting(true);

            if (!hasChecked) {
              const result = await UsersService.findByEmail(values.email);

              if (result.status === REQUEST_STATUS.SUCCESS) {
                setEmailTaken(!!result.data);
                setHasChecked(true);
              }
            } else {
              const result = params.id
                ? await UsersService.updateOne(+params.id, {
                    ...values,
                    role: +(values.role || 0),
                  })
                : await UsersService.create({
                    ...values,
                    role: +(values.role || 0),
                  });

              if (result.status === REQUEST_STATUS.SUCCESS) {
                toast({
                  title: `User ${
                    params.id ? 'updated' : 'created'
                  } successfully`,
                  status: 'success',
                  duration: 5000,
                  isClosable: true,
                });
                history.push(adminRoutes.USERS_MANAGEMENT);
              } else {
                toast({
                  title: `Could not ${params.id ? 'update' : 'create'} user`,
                  description:
                    (result.error as ErrorResponse).message ??
                    'Something went wrong. Please try again later',
                  status: 'error',
                  duration: 5000,
                  isClosable: true,
                });
              }
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
              id="full-user"
              onSubmit={event => {
                event.preventDefault();
                handleSubmit();
              }}>
              <FullUsersForm
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
      )}
    </Grid>
  );
};

export default UsersForm;
