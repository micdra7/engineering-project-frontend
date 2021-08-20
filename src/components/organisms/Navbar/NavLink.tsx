import { Box, Flex, Link, Tooltip } from '@chakra-ui/react';
import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';

type TNavLinkProps = {
  to: string;
  text: string;
  isNavbarOpen: boolean;
  icon: JSX.Element;
  onClick?: () => void;
};

const NavLink = ({
  to,
  text,
  isNavbarOpen,
  icon,
  onClick,
}: TNavLinkProps): JSX.Element => {
  const location = useLocation();

  return (
    <Flex
      justifyContent={['flex-start', 'flex-start', 'center', 'flex-start']}
      alignItems="center"
      fontSize={['1.25em', '1.25em', '2em', '1.45em']}
      my={[0, 0, 0, 1]}>
      <Tooltip label={text} aria-label={`A tooltip for ${text} link`}>
        <Link
          opacity={[
            isNavbarOpen ? '100%' : '0%',
            isNavbarOpen ? '100%' : '0%',
            '100%',
          ]}
          transition="opacity 0.15s ease-in-out"
          flex="1 1 auto"
          as={!onClick ? RouterLink : undefined}
          onClick={onClick}
          to={to}
          textAlign={['left', 'left', 'center', 'left']}
          textDecor={location.pathname.includes(to) ? 'underline' : ''}
          color={location.pathname.includes(to) ? 'cyan.300' : 'white'}>
          <Box
            d="inline-block"
            mr={['2', '2', '0', '2']}
            opacity={[
              isNavbarOpen ? '100%' : '0%',
              isNavbarOpen ? '100%' : '0%',
              '100%',
            ]}
            transition="opacity 0.15s ease-in-out">
            {icon}
          </Box>
          <Box
            d={['inline-block', 'inline-block', 'none', 'inline-block']}
            _hover={{ textDecor: 'underline' }}>
            {text}
          </Box>
        </Link>
      </Tooltip>
    </Flex>
  );
};
export default NavLink;
