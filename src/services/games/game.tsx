import { useCallback } from 'react';
import { Socket } from 'socket.io-client';

type TUseGameProps = {
  room: string;
  socket: Socket;
};

type TUseGame = {
  getUrl: (fileId: string) => string;
  startGame: (gameId: number) => void;
  sendData: (data: string) => void;
  finishGame: () => void;
  sendScore: (
    gameId: number,
    id: string,
    score: number,
    userId: number,
  ) => void;
};

const useGame = ({ room, socket }: TUseGameProps): TUseGame => {
  const getUrl = useCallback(
    (fileId: string) => `${process.env.REACT_APP_API_URL}/games/file/${fileId}`,
    [],
  );

  const startGame = useCallback((gameId: number) => {
    socket.emit('startGame', { gameId, room });
  }, []);

  const sendData = useCallback((data: string) => {
    socket.emit('sendGameData', { data, room });
  }, []);

  const finishGame = useCallback(() => {
    socket.emit('sendGameFinish', { room });
  }, []);

  const sendScore = useCallback(
    (gameId: number, id: string, score: number, userId: number) => {
      socket.emit('sendGameScore', { gameId, id, score, room, userId });
    },
    [],
  );

  return {
    getUrl,
    startGame,
    sendData,
    finishGame,
    sendScore,
  };
};

export default useGame;
