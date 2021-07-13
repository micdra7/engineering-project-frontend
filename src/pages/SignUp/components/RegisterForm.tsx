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

interface RegisterFormProps {
  values: Record<string, string>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  handleChange: (event: unknown) => void;
  handleBlur: (event: unknown) => void;
  isSubmitting: boolean;
}

const RegisterForm = ({
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  isSubmitting,
}: RegisterFormProps): JSX.Element => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <Grid
      gridTemplateColumns={['1fr', '1fr', '1fr 1fr']}
      columnGap={['0', '0', '1rem']}
      rowGap="0.5rem"
      justifyItems="center"
      mt={[12, 12, 0]}>
      <Heading
        color="green.500"
        mb={4}
        w="100%"
        textAlign={['center', 'center', 'left']}
        gridColumn="1/3">
        Register
      </Heading>
      <FormControl
        id="email"
        isRequired
        isInvalid={
          touched.email && errors.email !== undefined && errors.email !== ''
        }
        gridColumn="1/3">
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
        isRequired
        isInvalid={
          touched.password &&
          errors.password !== undefined &&
          errors.password !== ''
        }
        gridColumn="1/3">
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
      <FormControl
        id="workspaceName"
        isRequired
        isInvalid={
          touched.workspaceName &&
          errors.workspaceName !== undefined &&
          errors.workspaceName !== ''
        }
        gridColumn="1/3">
        <FormLabel>Workspace Name</FormLabel>
        <Input
          type="text"
          value={values.workspaceName}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <FormErrorMessage>
          {touched.workspaceName ? errors.workspaceName : ''}
        </FormErrorMessage>
      </FormControl>
      <Button
        isLoading={isSubmitting}
        type="submit"
        colorScheme="green"
        mt={6}
        maxW={['unset', 'unset', '250px']}
        w="100%"
        gridColumn="1/3">
        Register
      </Button>
    </Grid>
  );
};

export default RegisterForm;
