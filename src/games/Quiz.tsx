import React, { useEffect } from 'react';

type TQuizProps = {
  sendData: (data: string) => void;
  sendFinish: () => void;
  sendScore: (score: number) => void;
  name: string;
  gameDataEntries: string[];
  isFinished: boolean;
  currentData: string[];
};

const Quiz = ({
  sendData,
  sendFinish,
  sendScore,
  name,
  gameDataEntries,
  isFinished,
  currentData,
}: TQuizProps): JSX.Element => {
  const a = 'a';

  useEffect(() => {
    if (isFinished) sendScore(123);
  }, []);

  return (
    <div>
      <span>{a}</span>
      <button
        type="button"
        onClick={() => {
          console.log(gameDataEntries);
        }}>
        test button
      </button>
    </div>
  );
};

export default Quiz;
