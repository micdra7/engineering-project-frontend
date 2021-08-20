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
  FaTasks,
  FaUsers,
} from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import { TAuthProviderState, TAuthState, useAuth } from 'services/Auth/Auth';
import NavLink from './NavLink';

const Navbar = () => {
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
      bg="cyan.900"
      wrap="wrap"
      justifyContent="space-between"
      alignItems="center">
      <Icon as={FaHeadset} boxSize="2em" color="cyan.300" />
      <IconButton
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
        pos="absolute"
        top="100%"
        left="0"
        w={['100%', '100%', '20%']}
        p={4}
        pt={0}
        color="white"
        bg="cyan.900"
        overflow="hidden"
        transformOrigin="top center"
        transform={isOpen ? 'scaleY(1)' : 'scaleY(0)'}
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
      </Grid>
    </Flex>
  );
};

export default Navbar;
