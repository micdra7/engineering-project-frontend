import { Grid } from '@chakra-ui/react';
import React from 'react';
import NavLink from '../atoms/NavLink';
import { publicLinks } from '../../resources/links';

const NavList = (): JSX.Element => (
  <Grid gridTemplateColumns={['1fr', '1fr', 'repeat(8, 1fr)']}>
    {publicLinks.map(link => (
      <NavLink {...link} />
    ))}
  </Grid>
);

export default NavList;
