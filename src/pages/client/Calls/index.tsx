import { Text } from '@chakra-ui/react';
import { WideContentPage } from 'components';
import React from 'react';
import CallList from './components/CallList';

const Calls = (): JSX.Element => (
  <WideContentPage title="Calls">
    <Text mb={6}>Join your upcoming calls or start a new one</Text>
    <CallList />
  </WideContentPage>
);

export default Calls;
