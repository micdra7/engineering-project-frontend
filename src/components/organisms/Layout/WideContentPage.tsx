import { Grid, GridItem, Heading } from '@chakra-ui/react';
import React from 'react';
import Navbar from '../Navbar/Navbar';

type TWideContentPageProps = {
  title: string;
  children: JSX.Element | JSX.Element[];
};

const WideContentPage = ({
  title,
  children,
}: TWideContentPageProps): JSX.Element => (
  <Grid templateColumns={['1fr', '1fr', '1fr', '250px 1fr']} w="100%">
    <GridItem>
      <Navbar />
    </GridItem>
    <GridItem w="100%" maxW="1440px" mx="auto">
      <Heading>{title}</Heading>

      {children}
    </GridItem>
  </Grid>
);

export default WideContentPage;
