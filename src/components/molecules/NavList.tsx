import { Grid } from '@chakra-ui/react';
import React from 'react';
import NavLink from '../atoms/NavLink';
import { publicLinks } from '../../resources/links';

interface NavListProps {
  display?: string | string[];
}

const NavList = ({ display = 'grid' }: NavListProps): JSX.Element => (
  <Grid
    gridTemplateColumns={['1fr', '1fr', 'repeat(2, 1fr)']}
    display={display}>
    {publicLinks.map(link => (
      <NavLink {...link} />
    ))}
  </Grid>
);

export default NavList;
