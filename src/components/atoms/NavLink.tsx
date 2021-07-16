import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Button, Link } from '@chakra-ui/react';

interface NavLinkProps {
  text: string;
  to: string;
  onClick?: (event: unknown) => void;
  display?: string | string[];
}

const NavLink = ({ text, to, onClick, display }: NavLinkProps): JSX.Element => {
  const location = useLocation();

  if (onClick) {
    return (
      <Button
        mt={['1rem', '1rem', '0']}
        w={['100%', '100%', 'auto']}
        display={display}
        type="button"
        onClick={onClick}
        colorScheme="green"
        textAlign={['left', 'left', 'center']}
        fontSize={['1.5rem', '1.5rem', 'xl']}
        fontWeight="normal">
        {text}
      </Button>
    );
  }

  return (
    <Link
      as={RouterLink}
      to={to}
      onClick={onClick}
      textDecoration={location.pathname === to ? 'underline' : undefined}
      fontSize={['1.5rem', '1.5rem', 'xl']}
      color={['black', 'black', 'white']}
      textAlign={['left', 'left', 'center']}>
      {text}
    </Link>
  );
};

export default NavLink;
