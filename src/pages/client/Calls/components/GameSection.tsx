import React, { useEffect, useState } from 'react';
import useGame from 'services/games/game';
import { Socket } from 'socket.io-client';
import { Flex } from '@chakra-ui/react';
import { useQuery } from 'react-query';
import { API } from 'services/api';
import { RemoteComponent } from '@paciolan/remote-component';
import { TAuthProviderState, TAuthState, useAuth } from 'services/Auth/Auth';
import { useLocation } from 'react-router-dom';
import AvailableGamesList from './AvailableGamesList';

type TGameSectionProps = {
  userPeerId: string;
  gameId: number;
  setGameId: React.Dispatch<React.SetStateAction<number>>;
  room: string;
  socket: Socket;
  usersCount: number;
};

const GameSection = ({
  userPeerId,
  gameId,
  setGameId,
  room,
  socket,
  usersCount,
}: TGameSectionProps): JSX.Element => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const auth: TAuthProviderState = useAuth();
  const authState: TAuthState = auth.getCurrentState();

  const [currentData, setCurrentData] = useState<string[]>([]);
  const [isGameFinished, setGameFinished] = useState(false);
  const game = useGame({ room, socket });

  const { data: currentGame, isLoading: gameLoading } = useQuery(
    `/games/${gameId}`,
    () => API.get(`/games/${gameId}`),
    { enabled: !!gameId },
  );
  const { data: currentGameData, isLoading: gameDataLoading } = useQuery(
    ['/games/data', gameId],
    () =>
      API.get(
        `/games/data/entries/public?page=1&limit=9999&gameId=${gameId}&workspaceName=${params.get(
          'workspaceName',
        )}`,
      ),
    { enabled: !!gameId },
  );

  const onGameSelect = (selectedId: number) => {
    setGameId(selectedId);
    game.startGame(selectedId);
  };

  const addListeners = () => {
    socket.on('gameData', ({ data }) => {
      setCurrentData(prevState => [...prevState, data]);
    });
    socket.on('gameFinish', () => {
      setGameFinished(true);
    });
  };

  const removeListeners = () => {
    socket.off('gameData');
    socket.off('gameFinish');
  };

  useEffect(() => {
    if (gameId) {
      addListeners();
    } else {
      removeListeners();
    }

    return () => {
      removeListeners();
    };
  }, [gameId]);

  return (
    <Flex w="100%" order={[1, 1, 2]}>
      {!gameId ||
      (!!gameId &&
        gameLoading &&
        gameDataLoading &&
        !currentGame?.data?.filepath) ? (
        <AvailableGamesList setGameId={onGameSelect} />
      ) : (
        <RemoteComponent
          url={game.getUrl(currentGame?.data?.filepath)}
          sendData={game.sendData}
          sendFinish={game.finishGame}
          sendScore={(score: number) => {
            if (authState.isAuthenticated) {
              game.sendScore(gameId, userPeerId, score, authState.id);
            }
            setGameId(0);
          }}
          isFinished={isGameFinished}
          currentData={currentData}
          name={currentGame?.data?.name}
          gameDataEntries={currentGameData?.data?.data?.map(item => item.data)}
          usersCount={usersCount}
        />
      )}
    </Flex>
  );
};

export default GameSection;
