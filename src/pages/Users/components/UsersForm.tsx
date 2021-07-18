import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  Input,
  InputGroup,
  InputRightElement,
  Select,
} from '@chakra-ui/react';
import { Formik } from 'formik';
import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import * as yup from 'yup';
import { REQUEST_STATUS } from '../../../resources/endpoints';
import { Roles } from '../../../resources/roles';
import UsersService from '../../../services/users';
import { useAuth } from '../../../store/auth';
import { validatePassword } from '../../../utils/helper';

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
    .required('Password is required')
    .test(
      'len',
      'Must be at least 8 characters and have at least one lowercase, one uppercase and one special character',
      value => validatePassword(value || ''),
    ),
  role: yup.number().is([0, 1]),
});

const UsersForm = (): JSX.Element => {
  const auth = useAuth();
  const history = useHistory();
  const params: { id: string } = useParams();
  console.log('params: ', params);

  const [isEmailTaken, setEmailTaken] = useState(!+params.id);
  const [hasChecked, setHasChecked] = useState(!!+params.id);
  const [showPassword, setShowPassword] = useState<boolean>(false);

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
              <FormControl
                id="email"
                isRequired
                isInvalid={
                  touched.email &&
                  errors.email !== undefined &&
                  errors.email !== ''
                }>
                <FormLabel>Email address</FormLabel>
                <Input
                  type="email"
                  value={values.email}
                  onChange={event => {
                    handleChange(event);
                    setHasChecked(false);
                    setEmailTaken(true);
                  }}
                  onBlur={handleBlur}
                />
                <FormErrorMessage>
                  {touched.email ? errors.email : ''}
                </FormErrorMessage>
              </FormControl>
              {hasChecked && isEmailTaken ? (
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
                    <option value={Roles.User}>User</option>
                    <option value={Roles.Admin}>Admin</option>
                  </Select>
                  <FormErrorMessage>
                    {touched.role ? errors.role : ''}
                  </FormErrorMessage>
                </FormControl>
              ) : null}
              <Button
                isLoading={isSubmitting}
                type="submit"
                colorScheme="green"
                mt={6}
                maxW={['unset', 'unset', '250px']}
                w="100%">
                {!hasChecked && isEmailTaken
                  ? 'Check if account exists'
                  : 'Add user to workspace'}
              </Button>
            </form>
          )}
        </Formik>
      ) : (
        <Formik
          initialValues={{
            email: '',
            firstName: '',
            lastName: '',
            password: '',
            role: 0,
          }}
          validationSchema={FullUsersSchema}
          onSubmit={async (values, { setSubmitting }) => {
            setSubmitting(true);

            if (!hasChecked) {
              const result = await UsersService.findByEmail(values.email);

              if (result.status === REQUEST_STATUS.SUCCESS) {
                setEmailTaken(!!result.data);
                setHasChecked(true);
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
              <FormControl
                id="email"
                isRequired
                isInvalid={
                  touched.email &&
                  errors.email !== undefined &&
                  errors.email !== ''
                }
                gridColumn="1/3">
                <FormLabel>Email address</FormLabel>
                <Input
                  type="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <FormErrorMessage>
                  {touched.email ? errors.email : ''}
                </FormErrorMessage>
              </FormControl>
              <FormControl
                id="firstName"
                isRequired
                isInvalid={
                  touched.firstName &&
                  errors.firstName !== undefined &&
                  errors.firstName !== ''
                }
                gridColumn={['1/3', '1/3', 'unset']}>
                <FormLabel>First Name</FormLabel>
                <Input
                  type="text"
                  value={values.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <FormErrorMessage>
                  {touched.firstName ? errors.firstName : ''}
                </FormErrorMessage>
              </FormControl>
              <FormControl
                id="lastName"
                isRequired
                isInvalid={
                  touched.lastName &&
                  errors.lastName !== undefined &&
                  errors.lastName !== ''
                }
                gridColumn={['1/3', '1/3', 'unset']}>
                <FormLabel>Last Name</FormLabel>
                <Input
                  type="text"
                  value={values.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <FormErrorMessage>
                  {touched.lastName ? errors.lastName : ''}
                </FormErrorMessage>
              </FormControl>
              <FormControl
                id="password"
                isInvalid={
                  touched.password &&
                  errors.password !== undefined &&
                  errors.password !== ''
                }
                gridColumn="1/3">
                <FormLabel>New password</FormLabel>
                <InputGroup size="md">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <InputRightElement width="4.5rem">
                    <Button
                      colorScheme="green"
                      h="1.75rem"
                      size="sm"
                      onClick={() => {
                        setShowPassword(!showPassword);
                      }}>
                      {showPassword ? 'Hide' : 'Show'}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>
                  {touched.password && errors.password}
                </FormErrorMessage>
              </FormControl>
            </form>
          )}
        </Formik>
      )}
    </Grid>
  );
};

export default UsersForm;
