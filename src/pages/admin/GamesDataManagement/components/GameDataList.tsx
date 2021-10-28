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
import { FaList, FaTrash } from 'react-icons/fa';
import { useMutation, useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { API } from 'services/api';
import { useLogger } from 'services/toast';
import GameDataModal from './GameDataModal';

const GameDataList = (): JSX.Element => {
  const logger = useLogger();
  const { gameId }: { gameId: string } = useParams();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [paginationState, setPaginationState] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 10,
    itemCount: 10,
  });
  const [gameDataId, setGameDataId] = useState(0);

  const deleteGameDataMutation = useMutation((id: number) =>
    API.delete(`/games/data/entries/${id}`),
  );

  const {
    isLoading: gameDataLoading,
    isSuccess: gameDataLoaded,
    data: gameData,
    refetch: refetchGameData,
  } = useQuery(
    [
      '/games/data',
      paginationState.currentPage,
      paginationState.itemCount,
      gameId,
    ],
    () =>
      API.get(
        `/games/data/entries?page=${paginationState.currentPage}&limit=${paginationState.itemCount}&gameId=${gameId}`,
      ),
  );

  const onDelete = async (id: number) => {
    try {
      await deleteGameDataMutation.mutateAsync(id);

      logger.success({
        title: 'Success',
        description: 'Game data entry has been successfully deleted',
      });
    } catch (error) {
      logger.error({
        title: 'Error',
        description: error?.response?.data?.message ?? 'Something went wrong',
      });
    }

    refetchGameData();
  };

  const onModalClose = () => {
    refetchGameData();
    setGameDataId(0);
    onClose();
  };

  useEffect(() => {
    if (gameDataLoaded && gameData) {
      setPaginationState(gameData.data.meta);
    }
  }, [gameDataLoaded, gameData]);

  useEffect(() => {
    if (gameDataId) onOpen();
  }, [gameDataId]);

  return (
    <Grid w="100%">
      <HStack w="100%" alignItems="center" justifyContent="flex-end" mb={4}>
        <Tooltip
          hasArrow
          placement="bottom"
          label="Create a new game data entry"
          bg="cyan.500">
          <IconButton
            aria-label="Create a new game data entry"
            onClick={onOpen}
            icon={<Icon as={FaList} />}
            colorScheme="cyan"
            rounded="md"
            color="white"
          />
        </Tooltip>
      </HStack>

      {gameDataLoading ? (
        <Loader />
      ) : (
        <Box w="100%" overflowY="unset" overflowX="auto" maxW="100%">
          <Table variant="striped" colorScheme="cyan" minW="600px">
            <Thead>
              <Tr>
                <Th>Id</Th>
                <Th>Data</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {gameData?.data?.data?.map(item => (
                <Tr key={item.id}>
                  <Td>{item.id}</Td>
                  <Td>
                    {JSON.stringify(item.data)
                      .substr(0, 200)
                      .replaceAll('\\', '')}
                    ...
                  </Td>
                  <Td>
                    <ButtonGroup isAttached colorScheme="cyan">
                      <Button
                        mr="-px"
                        color="white"
                        onClick={() => setGameDataId(item.id)}>
                        Preview
                      </Button>
                      <IconButton
                        colorScheme="red"
                        color="white"
                        aria-label="Delete game data entry"
                        icon={<Icon as={FaTrash} />}
                        onClick={() => onDelete(item.id)}
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

      <GameDataModal
        isOpen={isOpen}
        onClose={onModalClose}
        gameId={+gameId}
        gameDataId={gameDataId}
      />
    </Grid>
  );
};

export default GameDataList;
