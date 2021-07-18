import React from 'react';
import { HStack, IconButton, Select, Text } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  itemCount: number;
  onPageChange: (page: number) => void;
  onItemCountChange: (itemCount: number) => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  itemCount,
  onPageChange,
  onItemCountChange,
}: PaginationProps): JSX.Element => (
  <HStack spacing="8px" ml="auto" mt={4} w="100%" maxW="400px">
    <Text
      textAlign="center"
      w="16rem">{`Page ${currentPage} of ${totalPages}`}</Text>
    <IconButton
      colorScheme="green"
      aria-label="Previous page"
      rounded="md"
      disabled={currentPage === 1}
      onClick={() => onPageChange(currentPage - 1)}
      icon={<ChevronLeftIcon />}
    />
    <Select
      value={itemCount}
      onChange={event => {
        onItemCountChange(+event.target.value);
      }}>
      <option value={10}>10</option>
      <option value={25}>25</option>
      <option value={50}>50</option>
    </Select>
    <IconButton
      colorScheme="green"
      aria-label="Next page"
      rounded="md"
      disabled={currentPage === totalPages}
      onClick={() => onPageChange(currentPage + 1)}
      icon={<ChevronRightIcon />}
    />
  </HStack>
);

export default Pagination;
