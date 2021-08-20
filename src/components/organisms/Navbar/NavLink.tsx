import { Link } from '@chakra-ui/react';
import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';

type TNavLinkProps = {
  to: string;
  text: string;
  isNavbarOpen: boolean;
};

const NavLink = ({ to, text, isNavbarOpen }: TNavLinkProps): JSX.Element => {
  const location = useLocation();

  return (
    <Link
      opacity={isNavbarOpen ? '100%' : '0%'}
      transition="opacity 0.15s ease-in-out"
      as={RouterLink}
      to={to}
      textDecor={location.pathname.includes(to) ? 'underline' : ''}>
      {text}
    </Link>
  );
};
export default NavLink;
