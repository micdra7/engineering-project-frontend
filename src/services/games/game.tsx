import { useCallback } from 'react';
import { Socket } from 'socket.io-client';

type TUseGameProps = {
  room: string;
  socket: Socket;
};

type TUseGame = {
  startGame: (gameId: number) => void;
  sendData: (data: string) => void;
  finishGame: () => void;
  sendScore: (gameId: number, id: number, score: number) => void;
};

const useGame = ({ room, socket }: TUseGameProps): TUseGame => {
  const startGame = useCallback((gameId: number) => {
    socket.emit('startGame', { gameId, room });
  }, []);

  const sendData = useCallback((data: string) => {
    socket.emit('sendGameData', { data, room });
  }, []);

  const finishGame = useCallback(() => {
    socket.emit('sendGameFinish', { room });
  }, []);

  const sendScore = useCallback((gameId: number, id: number, score: number) => {
    socket.emit('sendGameScore', { gameId, id, score, room });
  }, []);

  return {
    startGame,
    sendData,
    finishGame,
    sendScore,
  };
};

export default useGame;
