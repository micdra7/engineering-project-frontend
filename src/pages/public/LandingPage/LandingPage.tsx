import React from 'react';
import { Box, Button, Center, Grid, Text } from '@chakra-ui/react';
import WelcomeSection from './components/WelcomeSection';
import RegistrationForm from './components/RegistrationForm';

const LandingPage = (): JSX.Element => (
  <Box w="100%">
    <Grid minH="100vh" templateColumns={['1fr', '1fr', '1fr', '0.7fr 1fr']}>
      <Center
        bg="cyan.900"
        color="white"
        p={[6, 8, 8, 16]}
        order={[2, 2, 2, 1, 1]}
        pb={[12, 12, 8, 16]}>
        <RegistrationForm />
        <Text pos="absolute" bottom={4}>
          An existing user? Log in <Button variant="link">here</Button>
        </Text>
      </Center>
      <Center p={6} order={[1, 1, 1, 2, 2]}>
        <WelcomeSection />
      </Center>
    </Grid>
  </Box>
);

export default LandingPage;
