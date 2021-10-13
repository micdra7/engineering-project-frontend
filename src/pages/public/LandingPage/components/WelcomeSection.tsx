import {
  Heading,
  List,
  ListIcon,
  ListItem,
  Text,
  VStack,
} from '@chakra-ui/react';
import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';

const WelcomeSection = (): JSX.Element => (
  <VStack w="100%" spacing="18px">
    <Heading w="100%" px={[6, 12, 18, 24]} size="lg">
      GameCall is a comprehensive video-calling service perfectly suited to your
      enterprise needs
    </Heading>
    <Text w="100%" px={[6, 12, 18, 24]}>
      It allows your users to be entertained while performing mundane day-to-day
      tasks such as video-calls while offering a full suite of features,
      including:
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
);

export default WelcomeSection;
