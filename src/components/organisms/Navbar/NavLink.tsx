import { Box, Flex, Link } from '@chakra-ui/react';
import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';

type TNavLinkProps = {
  to: string;
  text: string;
  isNavbarOpen: boolean;
  icon: JSX.Element;
};

const NavLink = ({
  to,
  text,
  isNavbarOpen,
  icon,
}: TNavLinkProps): JSX.Element => {
  const location = useLocation();

  return (
    <Flex
      justifyContent="flex-start"
      alignItems="center"
      fontSize={['1.25em', '1.25em', '1.15em']}>
      <Box
        opacity={isNavbarOpen ? '100%' : '0%'}
        transition="opacity 0.15s ease-in-out">
        {icon}
      </Box>
      <Link
        opacity={isNavbarOpen ? '100%' : '0%'}
        transition="opacity 0.15s ease-in-out"
        flex="1 1 auto"
        ml="4"
        as={RouterLink}
        to={to}
        textDecor={location.pathname.includes(to) ? 'underline' : ''}>
        {text}
      </Link>
    </Flex>
  );
};
export default NavLink;
