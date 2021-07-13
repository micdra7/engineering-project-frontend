import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Link } from '@chakra-ui/react';

interface NavLinkProps {
  text: string;
  to: string;
}

const NavLink = ({ text, to }: NavLinkProps): JSX.Element => (
  <Link as={RouterLink} to={to}>
    {text}
  </Link>
);

export default NavLink;
