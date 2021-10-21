import { HStack, Text, Icon, IconButton, Select } from '@chakra-ui/react';
import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

type TPaginationProps = {
  currentPage: number;
  totalPages: number;
  itemCount: number;
  onPageChange: (page: number) => void;
  onItemCountChange: (itemCount: number) => void;
};

const Pagination = ({
  currentPage,
  totalPages,
  itemCount,
  onPageChange,
  onItemCountChange,
}: TPaginationProps): JSX.Element => (
  <HStack spacing="8px" ml="auto" mt={4} w="100%" maxW="400px">
    <Text
      textAlign="center"
      w="16rem"
    >{`Page ${currentPage} of ${totalPages}`}</Text>
    <IconButton
      colorScheme="cyan"
      aria-label="Previous page"
      rounded="md"
      disabled={currentPage === 1}
      onClick={() => onPageChange(currentPage - 1)}
      icon={<Icon as={FaChevronLeft} color="white" />}
    />
    <Select
      value={itemCount}
      onChange={event => {
        onItemCountChange(+event.target.value);
      }}
    >
      <option value={10}>10</option>
      <option value={25}>25</option>
      <option value={50}>50</option>
    </Select>
    <IconButton
      colorScheme="cyan"
      aria-label="Next page"
      rounded="md"
      disabled={currentPage === totalPages}
      onClick={() => onPageChange(currentPage + 1)}
      icon={<Icon as={FaChevronRight} color="white" />}
    />
  </HStack>
);

export default Pagination;
