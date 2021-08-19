import React from 'react';
import {
  Box,
  Center,
  Text,
  Grid,
  Heading,
  VStack,
  ListItem,
  ListIcon,
  List,
} from '@chakra-ui/react';
import { FaCheckCircle } from 'react-icons/fa';

const LandingPage = (): JSX.Element => (
  <Box w="100%">
    <Grid minH="100vh" templateColumns={['1fr', '1fr', '1fr', '0.7fr 1fr']}>
      <Center bg="cyan.900" color="white" p={6}>
        registration here
      </Center>
      <Center p={6}>
        <VStack w="100%" spacing="18px">
          <Heading w="100%" px={[6, 12, 18, 24]} size="lg">
            GameCall is a comprehensive video-calling service perfectly suited
            to your enterprise needs
          </Heading>
          <Text w="100%" px={[6, 12, 18, 24]}>
            It allows your users to be entertained while performing mundane
            day-to-day tasks such as video-calls while offering a full suite of
            features, including:
          </Text>
          <List w="100%" px={[6, 12, 18, 24]}>
            <ListItem>
              <ListIcon as={FaCheckCircle} color="cyan.700" /> Chats
            </ListItem>
            <ListItem>
              <ListIcon as={FaCheckCircle} color="cyan.700" /> Tasks
            </ListItem>
            <ListItem>
              <ListIcon as={FaCheckCircle} color="cyan.700" /> Video Calls
            </ListItem>
            <ListItem>
              <ListIcon as={FaCheckCircle} color="cyan.700" /> Games
            </ListItem>
          </List>
          <Text w="100%" px={[6, 12, 18, 24]}>
            Feel tempted to try out? Register and enjoy your stay
          </Text>
        </VStack>
      </Center>
    </Grid>
  </Box>
);

export default LandingPage;
