import { Text } from '@chakra-ui/react';
import { WideContentPage } from 'components';
import React from 'react';

const GameResults = (): JSX.Element => (
  <WideContentPage title="Game Results">
    <Text mb={6}>View your past results</Text>
  </WideContentPage>
);

export default GameResults;
