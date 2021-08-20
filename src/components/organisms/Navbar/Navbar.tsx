import { Flex, Grid, Icon, IconButton, useDisclosure } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import {
  FaChevronDown,
  FaColumns,
  FaComments,
  FaGamepad,
  FaHeadset,
  FaIdCard,
  FaPoll,
  FaSignOutAlt,
  FaTasks,
  FaUsers,
} from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import { TAuthProviderState, TAuthState, useAuth } from 'services/Auth/Auth';
import NavLink from './NavLink';

const Navbar = (): JSX.Element => {
  const auth: TAuthProviderState = useAuth();
  const authState: TAuthState = auth.getCurrentState();
  const location = useLocation();

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    onClose();
  }, [location.pathname]);

  return (
    <Flex
      pos="relative"
      as="nav"
      p={4}
      minH={['unset', 'unset', '100vh']}
      bg="cyan.900"
      flexFlow={['row', 'row', 'column', 'row wrap']}
      wrap="wrap"
      justifyContent={['space-between', 'space-between', 'flex-start']}
      alignItems={['center', 'center', 'center', 'flex-start']}
      alignContent={['initial', 'initial', 'initial', 'flex-start']}>
      <Icon
        as={FaHeadset}
        boxSize={['2em', '2em', '3em']}
        color="cyan.300"
        mb={[0, 0, '2', '8']}
        w={['auto', 'auto', 'auto', '100%']}
      />
      <IconButton
        d={['inline-flex', 'inline-flex', 'none']}
        aria-label="Open navbar"
        icon={
          <Icon
            as={FaChevronDown}
            boxSize="2em"
            transform={isOpen ? 'rotate3d(1, 0, 0, 180deg)' : ''}
            transition="transform 0.25s ease-in-out"
          />
        }
        colorScheme="cyan"
        variant="outline"
        onClick={isOpen ? onClose : onOpen}
      />
      <Grid
        pos={['absolute', 'absolute', 'static']}
        top="100%"
        left="0"
        zIndex="1"
        w="100%"
        p={4}
        pt={0}
        color="white"
        bg="cyan.900"
        overflow="hidden"
        transformOrigin="top center"
        transform={[
          isOpen ? 'scaleY(1)' : 'scaleY(0)',
          isOpen ? 'scaleY(1)' : 'scaleY(0)',
          'scaleY(1)',
        ]}
        transition="transform 0.3s ease-in-out">
        <NavLink
          icon={<Icon as={FaColumns} />}
          isNavbarOpen={isOpen}
          to="/client"
          text="Dashboard"
        />
        <NavLink
          icon={<Icon as={FaHeadset} />}
          isNavbarOpen={isOpen}
          to="/client/calls"
          text="Calls"
        />
        <NavLink
          icon={<Icon as={FaComments} />}
          isNavbarOpen={isOpen}
          to="/client/chats"
          text="Chats"
        />
        <NavLink
          icon={<Icon as={FaTasks} />}
          isNavbarOpen={isOpen}
          to="/client/tasks"
          text="Tasks"
        />
        <NavLink
          icon={<Icon as={FaPoll} />}
          isNavbarOpen={isOpen}
          to="/client/game-results"
          text="Game Results"
        />
        <NavLink
          icon={<Icon as={FaIdCard} />}
          isNavbarOpen={isOpen}
          to="/client/profile"
          text="Profile"
        />
        {authState.role === 1 && (
          <>
            <NavLink
              icon={<Icon as={FaUsers} />}
              isNavbarOpen={isOpen}
              to="/admin/users"
              text="Users"
            />
            <NavLink
              icon={<Icon as={FaGamepad} />}
              isNavbarOpen={isOpen}
              to="/admin/games"
              text="Games"
            />
          </>
        )}
        <NavLink
          icon={<Icon as={FaSignOutAlt} />}
          isNavbarOpen={isOpen}
          to="/logout"
          text="Log Out"
          onClick={() => auth.logout()}
        />
      </Grid>
    </Flex>
  );
};

export default Navbar;
