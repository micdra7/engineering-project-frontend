import { Grid } from '@chakra-ui/react';
import React from 'react';
import { useHistory } from 'react-router-dom';
import * as yup from 'yup';
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

  return (
    <Grid
      flexBasis="100%"
      maxW="1440px"
      gridTemplateColumns={['1fr', '1fr', '0.75fr 1fr']}
      columnGap={16}
      mb={4}
      mt={[2, 2, 4]}>
      xd
    </Grid>
  );
};

export default UsersForm;
