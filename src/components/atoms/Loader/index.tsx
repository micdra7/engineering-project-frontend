import { Flex, Heading, Spinner } from '@chakra-ui/react';

import React from 'react';

const Loader = (): JSX.Element => (
  <Flex
    w="100%"
    minH="50%"
    flexFlow="row wrap"
    justifyContent="center"
    alignItems="center"
  >
    <Spinner
      size="xl"
      w="20vh"
      h="20vh"
      thickness="4px"
      speed="1.5s"
      color="cyan.900"
      emptyColor="gray.200"
    />
    <Heading size="lg" w="100%" mt={6} textAlign="center">
      Loading...
    </Heading>
  </Flex>
);

export default Loader;
