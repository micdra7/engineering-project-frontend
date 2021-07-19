import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Button,
  Input,
  Select,
  Grid,
} from '@chakra-ui/react';
import React from 'react';
import { Roles } from '../../../resources/roles';

interface PartialUsersFormProps {
  values: Record<string, string | number>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  handleChange: (event: unknown) => void;
  handleBlur: (event: unknown) => void;
  isSubmitting: boolean;
  hasChecked: boolean;
  isEmailTaken: boolean;
  setHasChecked: (value: boolean) => void;
  setEmailTaken: (value: boolean) => void;
}

const PartialUsersForm = ({
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  isSubmitting,
  hasChecked,
  isEmailTaken,
  setHasChecked,
  setEmailTaken,
}: PartialUsersFormProps): JSX.Element => (
  <Grid
    gridTemplateColumns="1fr"
    rowGap="0.5rem"
    justifyItems="center"
    mt={[12, 12, 0]}>
    <FormControl
      id="email"
      isRequired
      isInvalid={
        touched.email && errors.email !== undefined && errors.email !== ''
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
      <FormErrorMessage>{touched.email ? errors.email : ''}</FormErrorMessage>
    </FormControl>
    {hasChecked && isEmailTaken ? (
      <FormControl
        id="role"
        isRequired
        isInvalid={
          touched.role && errors.role !== undefined && errors.role !== ''
        }>
        <FormLabel>Role</FormLabel>
        <Select>
          <option value={Roles.User}>User</option>
          <option value={Roles.Admin}>Admin</option>
        </Select>
        <FormErrorMessage>{touched.role ? errors.role : ''}</FormErrorMessage>
      </FormControl>
    ) : null}
    <Button
      isLoading={isSubmitting}
      type="submit"
      colorScheme="green"
      mt={6}
      maxW={['unset', 'unset', '250px']}
      justifySelf="start"
      w="100%">
      {!hasChecked && isEmailTaken
        ? 'Check if account exists'
        : 'Add user to workspace'}
    </Button>
  </Grid>
);

export default PartialUsersForm;
