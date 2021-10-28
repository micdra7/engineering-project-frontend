import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { API } from 'services/api';
import { Grid, Box, Table, Thead, Tr, Th, Tbody, Td } from '@chakra-ui/react';
import { Loader, Pagination } from 'components';
import moment from 'moment';
import { DATE_TIME } from 'resources/constants';

const GameResultsList = (): JSX.Element => {
  const [paginationState, setPaginationState] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 10,
    itemCount: 10,
  });
  const {
    isLoading: gameResultsLoading,
    isSuccess: gameResultsLoaded,
    data: gameResults,
  } = useQuery(
    [
      '/games/result/entries',
      paginationState.currentPage,
      paginationState.itemCount,
    ],
    () =>
      API.get(
        `/games/result/entries?page=${paginationState.currentPage}&limit=${paginationState.itemCount}`,
      ),
  );

  useEffect(() => {
    if (gameResultsLoaded && gameResults) {
      setPaginationState(gameResults.data.meta);
    }
  }, [gameResultsLoaded, gameResults]);

  return (
    <Grid w="100%">
      {gameResultsLoading ? (
        <Loader />
      ) : (
        <Box w="100%" overflowY="unset" overflowX="auto" maxW="100%">
          <Table variant="striped" colorScheme="cyan" minW="600px">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Created At</Th>
                <Th>Score</Th>
              </Tr>
            </Thead>
            <Tbody>
              {gameResults?.data?.data?.map(item => (
                <Tr key={item.id}>
                  <Td>{item.gameName}</Td>
                  <Td>{moment(item.createdAt).format(DATE_TIME.DATE_TIME)}</Td>
                  <Td>{item.result}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}
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
    </Grid>
  );
};

export default GameResultsList;
