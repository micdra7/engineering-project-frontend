import {
  useDisclosure,
  Box,
  HStack,
  Tooltip,
  IconButton,
  Icon,
} from '@chakra-ui/react';
import React from 'react';
import { FaList } from 'react-icons/fa';
import AddGameModal from './AddGameModal';

const GameList = (): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box w="100%">
      <HStack w="100%" alignItems="center" justifyContent="flex-end" mb={4}>
        <Tooltip
          hasArrow
          placement="bottom"
          label="Create a new game"
          bg="cyan.500">
          <IconButton
            aria-label="Create a new game"
            onClick={onOpen}
            icon={<Icon as={FaList} />}
            colorScheme="cyan"
            rounded="md"
            color="white"
          />
        </Tooltip>
      </HStack>

      <AddGameModal isOpen={isOpen} onClose={onClose} />
    </Box>
  );
};

export default GameList;
