import React from 'react';
import useGame from 'services/games/game';
import { useLogger } from 'services/toast';
import { Socket } from 'socket.io-client';
import { Flex } from '@chakra-ui/react';
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
  const logger = useLogger();
  const game = useGame({ room, socket });

  const onGameSelect = (selectedId: number) => {
    setGameId(selectedId);
    game.startGame(selectedId);
  };

  return (
    <Flex w="100%">
      {!gameId ? (
        <AvailableGamesList setGameId={onGameSelect} />
      ) : (
        <span>game here</span>
      )}
    </Flex>
  );
};

export default GameSection;
