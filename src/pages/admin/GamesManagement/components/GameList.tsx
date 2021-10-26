import {
  useDisclosure,
  Box,
  HStack,
  Tooltip,
  IconButton,
  Icon,
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  Th,
  ButtonGroup,
  Button,
  Grid,
} from '@chakra-ui/react';
import { Loader, Pagination } from 'components';
import React, { useEffect, useState } from 'react';
import { FaDatabase, FaList } from 'react-icons/fa';
import { useQuery } from 'react-query';
import { useHistory } from 'react-router-dom';
import { API } from 'services/api';
import GameModal from './AddGameModal';

const GameList = (): JSX.Element => {
  const history = useHistory();
  const [gameId, setGameId] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [paginationState, setPaginationState] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 10,
    itemCount: 10,
  });

  const {
    isLoading: gamesLoading,
    isSuccess: gamesLoaded,
    data: games,
    refetch: refetchGames,
  } = useQuery(
    ['/games', paginationState.currentPage, paginationState.itemCount],
    () =>
      API.get(
        `/games?page=${paginationState.currentPage}&limit=${paginationState.itemCount}`,
      ),
  );

  useEffect(() => {
    if (gamesLoaded && games) {
      setPaginationState(games.data.meta);
    }
  }, [gamesLoaded, games]);

  useEffect(() => {
    if (gameId) onOpen();
  }, [gameId]);

  return (
    <Grid w="100%">
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

      {gamesLoading ? (
        <Loader />
      ) : (
        <Box w="100%" overflowY="unset" overflowX="auto" maxW="100%">
          <Table variant="striped" colorScheme="cyan" minW="600px">
            <Thead>
              <Tr>
                <Th>Id</Th>
                <Th>Name</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {games?.data?.data?.map(item => (
                <Tr key={item.id}>
                  <Td>{item.id}</Td>
                  <Td>{item.name}</Td>
                  <Td>
                    <ButtonGroup isAttached colorScheme="cyan">
                      <Button
                        mr="-px"
                        color="white"
                        onClick={() => setGameId(item.id)}>
                        Edit
                      </Button>
                      <IconButton
                        color="white"
                        aria-label="Manage game data"
                        icon={<Icon as={FaDatabase} />}
                        onClick={() =>
                          history.push(`/admin/games/${item.id}/data`)
                        }
                      />
                    </ButtonGroup>
                  </Td>
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

      <GameModal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          refetchGames();
        }}
        gameId={gameId}
      />
    </Grid>
  );
};

export default GameList;
