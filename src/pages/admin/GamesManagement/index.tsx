import { Text } from '@chakra-ui/react';
import { WideContentPage } from 'components';
import React from 'react';

const GamesManagement = (): JSX.Element => (
  <WideContentPage title="Games Management">
    <Text mb={6}>Edit existing or add new data to your games</Text>
  </WideContentPage>
);

export default GamesManagement;
