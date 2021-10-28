import React, { useEffect, useState } from 'react';
import useGame from 'services/games/game';
import { Socket } from 'socket.io-client';
import { Flex } from '@chakra-ui/react';
import { useQuery } from 'react-query';
import { API } from 'services/api';
import { RemoteComponent } from '@paciolan/remote-component';
import AvailableGamesList from './AvailableGamesList';

type TGameSectionProps = {
  gameId: number;
  setGameId: React.Dispatch<React.SetStateAction<number>>;
  room: string;
  socket: Socket;
};

const GameSection = ({
  gameId,
  setGameId,
  room,
  socket,
}: TGameSectionProps): JSX.Element => {
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
    () => API.get(`/games/data/entries?page=1&limit=9999&gameId=${gameId}`),
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
    socket.on('gameStart', ({ gameId: newGameId }) => {
      if (!gameId) {
        setGameId(+newGameId);
      }
    });
  }, []);

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
    <Flex w="100%">
      {!gameId || (!!gameId && gameLoading && gameDataLoading) ? (
        <AvailableGamesList setGameId={onGameSelect} />
      ) : (
        <RemoteComponent
          url={game.getUrl(currentGame?.data?.filepath)}
          sendData={game.sendData}
          sendFinish={game.finishGame}
          sendScore={(score: number) => {
            game.sendScore(gameId, 1, score);
            setGameId(0);
          }}
          isFinished={isGameFinished}
          currentData={currentData}
          name={currentGame?.data?.name}
          gameDataEntries={currentGameData?.data?.data?.map(item => item.data)}
        />
      )}
    </Flex>
  );
};

export default GameSection;
