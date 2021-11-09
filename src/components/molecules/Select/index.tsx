import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Select as ChakraSelect,
} from '@chakra-ui/react';
import { FormikErrors } from 'formik';
import React, { ChangeEvent } from 'react';

type TSelectProps = {
  id: string;
  isRequired?: boolean;
  isInvalid?: boolean;
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (e: ChangeEvent) => void;
  onBlur: (e: ChangeEvent) => void;
  errorMessage?: string | FormikErrors<unknown> | FormikErrors<unknown>[];
  width?: string;
};

const Select = ({
  id,
  isRequired,
  isInvalid,
  label,
  value,
  options,
  onChange,
  onBlur,
  errorMessage,
  width = '100%',
}: TSelectProps): JSX.Element => (
  <FormControl id={id} isRequired={isRequired} isInvalid={isInvalid} w={width}>
    <FormLabel>{label}</FormLabel>

    <ChakraSelect
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      colorScheme="cyan">
      <option value="-1">Choose an option</option>
      {options?.map(opt => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </ChakraSelect>

    <FormErrorMessage>{errorMessage}</FormErrorMessage>
  </FormControl>
);

export default Select;
