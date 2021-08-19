import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from '@chakra-ui/react';
import React, { ChangeEvent } from 'react';

type TTextInputProps = {
  id: string;
  isRequired?: boolean;
  isInvalid?: boolean;
  label: string;
  value: string;
  onChange: (e: ChangeEvent) => void;
  onBlur: (e: ChangeEvent) => void;
  errorMessage?: string;
  width?: string;
};

const TextInput = ({
  id,
  isRequired,
  isInvalid,
  label,
  value,
  onChange,
  onBlur,
  errorMessage,
  width = '100%',
}: TTextInputProps): JSX.Element => (
  <FormControl id={id} isRequired={isRequired} isInvalid={isInvalid} w={width}>
    <FormLabel>{label}</FormLabel>

    <Input type="text" value={value} onChange={onChange} onBlur={onBlur} />

    <FormErrorMessage>{errorMessage}</FormErrorMessage>
  </FormControl>
);

export default TextInput;
