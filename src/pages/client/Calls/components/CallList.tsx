import {
  useDisclosure,
  HStack,
  Tooltip,
  IconButton,
  Icon,
} from '@chakra-ui/react';
import React from 'react';
import { FaList } from 'react-icons/fa';
import AddCallModal from './AddCallModal';

const CallList = (): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <div>
      <HStack w="100%" alignItems="center" justifyContent="flex-end" mb={4}>
        <Tooltip hasArrow placement="left" label="Add call" bg="cyan.500">
          <IconButton
            aria-label="Add call"
            onClick={onOpen}
            icon={<Icon as={FaList} />}
            colorScheme="cyan"
            rounded="md"
            color="white"
          />
        </Tooltip>
      </HStack>

      <AddCallModal
        isOpen={isOpen}
        onClose={() => {
          onClose();
        }}
      />
    </div>
  );
};

export default CallList;
