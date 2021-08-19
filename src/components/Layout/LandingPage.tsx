import React from 'react';
import { Box, Grid } from '@chakra-ui/react';

const LandingPage = (): JSX.Element => (
  <Box w="100%">
    <Grid minH="100vh" templateColumns={['1fr', '1fr', '1fr', '0.7fr 1fr']}>
      <span>col1</span>
      <span>col2</span>
    </Grid>
  </Box>
);

export default LandingPage;
