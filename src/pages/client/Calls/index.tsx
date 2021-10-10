import { Text } from '@chakra-ui/react';
import { WideContentPage } from 'components';
import React from 'react';
import Call from './components/Call';

const Calls = (): JSX.Element => (
  <WideContentPage title="Calls">
    <Text mb={6}>Join your upcoming calls or start a new one</Text>
    <Call />
  </WideContentPage>
);

export default Calls;
