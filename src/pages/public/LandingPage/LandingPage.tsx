import React from 'react';
import {
  Box,
  Button,
  Center,
  Grid,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { TAuthProviderState, TAuthState, useAuth } from 'services/Auth/Auth';
import { Redirect } from 'react-router-dom';
import WelcomeSection from './components/WelcomeSection';
import RegistrationForm from './components/RegistrationForm';
import LoginModal from './components/LoginModal';

const LandingPage = (): JSX.Element => {
  const auth: TAuthProviderState = useAuth();
  const authState: TAuthState = auth.getCurrentState();

  const { isOpen, onOpen, onClose } = useDisclosure();

  if (authState.isAuthenticated) {
    return <Redirect to="/client" />;
  }

  return (
    <Box w="100%">
      <Grid minH="100vh" templateColumns={['1fr', '1fr', '1fr', '0.7fr 1fr']}>
        <Center
          pos="relative"
          bg="cyan.900"
          color="white"
          p={[6, 8, 8, 16]}
          order={[2, 2, 2, 1, 1]}
          pb={[12, 12, 8, 16]}>
          <RegistrationForm />
          <Text pos="absolute" bottom={[2, 2, 2, 4]}>
            An existing user? Log in{' '}
            <Button variant="link" onClick={onOpen}>
              here
            </Button>
          </Text>
        </Center>
        <Center p={6} order={[1, 1, 1, 2, 2]}>
          <WelcomeSection />
        </Center>
      </Grid>

      <LoginModal isOpen={isOpen} onClose={onClose} />
    </Box>
  );
};

export default LandingPage;
