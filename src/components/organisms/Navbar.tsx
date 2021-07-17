import { HamburgerIcon } from '@chakra-ui/icons';
import {
  Grid,
  useDisclosure,
  Image,
  IconButton,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody,
  DrawerHeader,
  useMediaQuery,
} from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import logo from '../../logo.svg';
import NavList from '../molecules/NavList';

const Navbar = (): JSX.Element => {
  const [isLargerThanLg] = useMediaQuery('(min-width: 48em)');

  const { isOpen, onOpen, onClose } = useDisclosure();
  const location = useLocation();

  useEffect(() => {
    onClose();
  }, [location.pathname]);

  useEffect(() => {
    if (isLargerThanLg) {
      onClose();
    }
  }, [isLargerThanLg]);

  return (
    <Grid
      flexBasis="100%"
      templateColumns={['1fr auto', '1fr auto']}
      alignItems="center"
      bg="green.500"
      p={[5, 5, 3]}
      position="sticky"
      top="0"
      zIndex="sticky"
      boxShadow="base">
      <Image src={logo} alt="Logo" boxSize={['45px', '45px', '65px']} />
      <IconButton
        onClick={onOpen}
        display={['flex', 'flex', 'none']}
        borderRadius="md"
        colorScheme="green"
        size="lg"
        aria-label="Open navigation drawer"
        icon={<HamburgerIcon />}
      />
      <NavList display={['none', 'none', 'grid']} />
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        closeOnEsc
        closeOnOverlayClick
        colorScheme="green">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader
            fontSize={['2rem', '2rem', 'unset']}
            borderBottomWidth="1px">
            Game Call
          </DrawerHeader>
          <DrawerBody>
            <NavList />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Grid>
  );
};

export default Navbar;
