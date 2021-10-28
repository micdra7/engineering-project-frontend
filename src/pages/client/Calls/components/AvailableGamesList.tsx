import { Loader, Pagination } from 'components';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { API } from 'services/api';
import {
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Box,
  IconButton,
  Icon,
} from '@chakra-ui/react';
import { FaCheckSquare } from 'react-icons/fa';

type TAvailableGamesListProps = {
  setGameId: (selectedId: number) => void;
};

const AvailableGamesList = ({
  setGameId,
}: TAvailableGamesListProps): JSX.Element => {
  const [paginationState, setPaginationState] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 10,
    itemCount: 10,
  });

  const { isLoading: gamesLoading, data: availableGames } = useQuery(
    ['/games', paginationState.currentPage, paginationState.itemCount],
    () =>
      API.get(
        `/games?page=${paginationState.currentPage}&limit=${paginationState.itemCount}`,
      ),
  );

  if (gamesLoading) {
    return <Loader />;
  }

  return (
    <Box w="100%" px={4}>
      <Table variant="striped" colorScheme="cyan" w="100%">
        <Thead>
          <Tr>
            <Th>Id</Th>
            <Th>Name</Th>
            <Th />
          </Tr>
        </Thead>
        <Tbody>
          {availableGames?.data?.data?.map(item => (
            <Tr key={item.id}>
              <Td>{item.id}</Td>
              <Td>{item.name}</Td>
              <Td>
                <IconButton
                  colorScheme="cyan"
                  color="white"
                  aria-label="Choose game"
                  icon={<Icon as={FaCheckSquare} />}
                  onClick={() => setGameId(item.id)}
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Pagination
        currentPage={paginationState.currentPage}
        totalPages={paginationState.totalPages}
        itemCount={paginationState.itemCount}
        onPageChange={page => {
          setPaginationState({ ...paginationState, currentPage: page });
        }}
        onItemCountChange={itemCount => {
          setPaginationState({
            ...paginationState,
            itemCount,
            currentPage: 1,
          });
        }}
      />
    </Box>
  );
};

export default AvailableGamesList;
