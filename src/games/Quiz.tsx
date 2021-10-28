import React from 'react';

type TQuizProps = {
  sendData: (data: string) => void;
  sendFinish: () => void;
  sendScore: (score: number) => void;
  name: string;
  gameDataEntries: string[];
};

const Quiz = ({
  sendData,
  sendFinish,
  sendScore,
  name,
  gameDataEntries,
}: TQuizProps): JSX.Element => {
  const a = 'a';

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
