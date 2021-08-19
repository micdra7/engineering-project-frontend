import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import React, { useState } from 'react';

type TPasswordInputProps = {
  id: string;
  isRequired?: boolean;
  isInvalid?: boolean;
  label: string;
  value: string;
  onChange: () => void;
  onBlur: () => void;
  errorMessage?: string;
};

const PasswordInput = ({
  id,
  isRequired,
  isInvalid,
  label,
  value,
  onChange,
  onBlur,
  errorMessage,
}: TPasswordInputProps): JSX.Element => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormControl id={id} isRequired={isRequired} isInvalid={isInvalid}>
      <FormLabel>{label}</FormLabel>
      <InputGroup size="md">
        <Input
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
        />

        <InputRightElement width="4.5rem">
          <Button
            colorScheme="cyan"
            h="1.75rem"
            size="sm"
            onClick={() => setShowPassword(true)}>
            {showPassword ? 'Hide' : 'Show'}
          </Button>
        </InputRightElement>
      </InputGroup>

      <FormErrorMessage>{errorMessage}</FormErrorMessage>
    </FormControl>
  );
};

export default PasswordInput;
