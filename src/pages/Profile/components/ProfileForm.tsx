import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  Input,
  InputGroup,
  InputRightElement,
  Skeleton,
} from '@chakra-ui/react';
import React, { useState } from 'react';

interface ProfileFormProps {
  values: Record<string, string>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  handleChange: (event: unknown) => void;
  handleBlur: (event: unknown) => void;
  isSubmitting: boolean;
  isLoading: boolean;
}

const ProfileForm = ({
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  isSubmitting,
  isLoading,
}: ProfileFormProps): JSX.Element => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <Grid>
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
        <FormLabel>First name</FormLabel>
        <Skeleton isLoaded={!isLoading}>
          <Input
            type="firstName"
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
        <FormLabel>Last name</FormLabel>
        <Skeleton isLoaded={!isLoading}>
          <Input
            type="lastName"
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
        w="100%">
        Save
      </Button>
    </Grid>
  );
};

export default ProfileForm;