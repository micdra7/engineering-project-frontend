import { WideContentPage } from 'components';
import React from 'react';
import { Text } from '@chakra-ui/react';
import GameDataList from './components/GameDataList';

const GamesDataManagement = (): JSX.Element => (
  <WideContentPage title="Game Data Management">
    <Text mb={6}>Edit existing or add new data to your games</Text>
    <GameDataList />
  </WideContentPage>
);

export default GamesDataManagement;
