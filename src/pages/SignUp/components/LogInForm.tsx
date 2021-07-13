import {
  Input,
  Grid,
  FormControl,
  FormErrorMessage,
  FormLabel,
  InputGroup,
  InputRightElement,
  Button,
  Heading,
} from '@chakra-ui/react';
import React, { useState } from 'react';

interface LogInFormProps {
  values: Record<string, string>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  handleChange: (event: unknown) => void;
  handleBlur: (event: unknown) => void;
}

const LogInForm = ({
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
}: LogInFormProps): JSX.Element => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <Grid gridTemplateColumns="1fr" justifyItems="center">
      <Heading color="green.500" mb={4}>
        Log In
      </Heading>
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
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <FormErrorMessage>{touched.email ? errors.email : ''}</FormErrorMessage>
      </FormControl>
      <FormControl
        id="password"
        isRequired
        isInvalid={
          touched.password &&
          errors.password !== undefined &&
          errors.password !== ''
        }>
        <FormLabel>Password</FormLabel>
        <InputGroup size="md">
          <Input
            type={showPassword ? 'text' : 'password'}
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <InputRightElement width="4.5rem">
            <Button
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
      <Button
        type="submit"
        colorScheme="green"
        mt={6}
        maxW={['unset', 'unset', '250px']}
        w="100%">
        Log in
      </Button>
    </Grid>
  );
};

export default LogInForm;
