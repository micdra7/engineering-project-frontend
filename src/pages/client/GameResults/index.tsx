import { Text } from '@chakra-ui/react';
import { WideContentPage } from 'components';
import React from 'react';
import GameResultsList from './components/GameResultsList';

const GameResults = (): JSX.Element => (
  <WideContentPage title="Game Results">
    <Text mb={6}>View your past results</Text>
    <GameResultsList />
  </WideContentPage>
);

export default GameResults;
