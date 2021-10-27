import React from 'react';

type TQuizProps = {
  sendData: (data: string) => void;
  sendFinish: () => void;
  sendScore: (score: number) => void;
};

const Quiz = ({ sendData, sendFinish, sendScore }: TQuizProps): JSX.Element => {
  const a = 'a';

  return (
    <div>
      <span>{a}</span>
    </div>
  );
};

export default Quiz;
