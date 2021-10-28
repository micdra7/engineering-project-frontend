import React from 'react';
import { useLogger } from 'services/toast';

const GameSection = (): JSX.Element => {
  const logger = useLogger();

  return (
    <div>
      <span>game section</span>
    </div>
  );
};

export default GameSection;
