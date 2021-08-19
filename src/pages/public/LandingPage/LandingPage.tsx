import React from 'react';
import { Box, Center, Grid } from '@chakra-ui/react';
import WelcomeSection from './components/WelcomeSection';

const LandingPage = (): JSX.Element => (
  <Box w="100%">
    <Grid minH="100vh" templateColumns={['1fr', '1fr', '1fr', '0.7fr 1fr']}>
      <Center bg="cyan.900" color="white" p={6}>
        registration here
      </Center>
      <Center p={6}>
        <WelcomeSection />
      </Center>
    </Grid>
  </Box>
);

export default LandingPage;
