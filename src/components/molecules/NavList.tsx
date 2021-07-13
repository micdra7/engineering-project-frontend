import { Button, Flex, Grid } from '@chakra-ui/react';
import React from 'react';
import NavLink from '../atoms/NavLink';
import {
  adminLinks,
  Link,
  publicLinks,
  userLinks,
} from '../../resources/links';
import { useAuth } from '../../store/auth';
import { Roles } from '../../resources/roles';

interface NavListProps {
  display?: string | string[];
}

const getLinks = (isAuthenticated: boolean, role: Roles): Link[] => {
  if (!isAuthenticated) return publicLinks;

  return role === Roles.Admin ? userLinks.concat(adminLinks) : userLinks;
};

const getColumns = (
  isAuthenticated: boolean,
  role: Roles,
  divide = true,
): number => {
  if (!isAuthenticated)
    return publicLinks.length > 4 && divide
      ? Math.ceil(publicLinks.length / 2)
      : publicLinks.length;

  const length =
    role === Roles.Admin
      ? userLinks.length + adminLinks.length
      : userLinks.length;

  return length > 4 && divide ? Math.ceil(length / 2) : length;
};

const NavList = ({ display = 'grid' }: NavListProps): JSX.Element => {
  const auth = useAuth();

  return (
    <Flex flexFlow={['column', 'column', 'row']} alignItems="center">
      <Grid
        flexBasis="100%"
        w="100%"
        gridTemplateColumns={[
          '1fr',
          '1fr',
          `repeat(${getColumns(auth.isAuthenticated, auth.role)}, 1fr)`,
          `repeat(${getColumns(auth.isAuthenticated, auth.role)}, 1fr)`,
          `repeat(${getColumns(auth.isAuthenticated, auth.role, false)}, 1fr)`,
        ]}
        rowGap={['1rem', '1rem', '0']}
        columnGap={['0', '0', '1rem']}
        display={display}>
        {/* eslint-disable-next-line no-nested-ternary */}
        {getLinks(auth.isAuthenticated, auth.role).map(link => (
          <NavLink {...link} />
        ))}
      </Grid>
      {auth.isAuthenticated ? (
        <NavLink
          display={display}
          text="Log Out"
          to=""
          onClick={() => {
            (auth.logout as () => void)();
          }}
        />
      ) : null}
    </Flex>
  );
};

export default NavList;
