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
import { useLocation } from 'react-router-dom';

type TAvailableGamesListProps = {
  setGameId: (selectedId: number) => void;
  usersCount: number;
};

const AvailableGamesList = ({
  setGameId,
  usersCount,
}: TAvailableGamesListProps): JSX.Element => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

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
        `/games/public?page=${paginationState.currentPage}&limit=${
          paginationState.itemCount
        }&workspaceName=${params.get('workspaceName')}`,
      ),
  );

  if (gamesLoading) {
    return <Loader />;
  }

  return (
    <Box w="100%" p={4} bg="cyan.800">
      <Table colorScheme="cyan" w="100%" color="white">
        <Thead>
          <Tr>
            <Th color="white">Id</Th>
            <Th color="white">Name</Th>
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
                  disabled={usersCount === 0}
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
        color="white"
      />
    </Box>
  );
};

export default AvailableGamesList;
