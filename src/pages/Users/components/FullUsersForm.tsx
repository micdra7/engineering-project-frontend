import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Button,
  Input,
  InputGroup,
  InputRightElement,
  Grid,
  Select,
  Skeleton,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { Roles } from '../../../resources/roles';

interface FullUsersFormProps {
  values: Record<string, string | number>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  handleChange: (event: unknown) => void;
  handleBlur: (event: unknown) => void;
  isSubmitting: boolean;
  isLoading: boolean;
}

const FullUsersForm = ({
  touched,
  errors,
  values,
  handleChange,
  handleBlur,
  isSubmitting,
  isLoading,
}: FullUsersFormProps): JSX.Element => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
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
        <Skeleton isLoaded={!isLoading}>
          <Input
            type="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </Skeleton>
        <FormErrorMessage>{touched.email ? errors.email : ''}</FormErrorMessage>
      </FormControl>
      <FormControl
        id="firstName"
        isRequired
        isInvalid={
          touched.firstName &&
          errors.firstName !== undefined &&
          errors.firstName !== ''
        }>
        <FormLabel>First Name</FormLabel>
        <Skeleton isLoaded={!isLoading}>
          <Input
            type="text"
            value={values.firstName}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </Skeleton>
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
        }>
        <FormLabel>Last Name</FormLabel>
        <Skeleton isLoaded={!isLoading}>
          <Input
            type="text"
            value={values.lastName}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </Skeleton>
        <FormErrorMessage>
          {touched.lastName ? errors.lastName : ''}
        </FormErrorMessage>
      </FormControl>
      <FormControl
        id="role"
        isRequired
        isInvalid={
          touched.role && errors.role !== undefined && errors.role !== ''
        }>
        <FormLabel>Role</FormLabel>
        <Skeleton isLoaded={!isLoading}>
          <Select value={values.role} onChange={handleChange}>
            <option value={Roles.User}>User</option>
            <option value={Roles.Admin}>Admin</option>
          </Select>
        </Skeleton>
        <FormErrorMessage>{touched.role ? errors.role : ''}</FormErrorMessage>
      </FormControl>
      <FormControl
        id="password"
        isInvalid={
          touched.password &&
          errors.password !== undefined &&
          errors.password !== ''
        }>
        <FormLabel>New password</FormLabel>
        <Skeleton isLoaded={!isLoading}>
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
        </Skeleton>
        <FormErrorMessage>
          {touched.password && errors.password}
        </FormErrorMessage>
      </FormControl>
      <Button
        isLoading={isSubmitting}
        type="submit"
        colorScheme="green"
        mt={6}
        maxW={['unset', 'unset', '250px']}
        justifySelf="start"
        w="100%">
        Save
      </Button>
    </Grid>
  );
};

export default FullUsersForm;
