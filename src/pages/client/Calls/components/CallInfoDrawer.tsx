import {
  Drawer,
  DrawerOverlay,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Heading,
  AvatarGroup,
  Button,
} from '@chakra-ui/react';
import { TooltipAvatar } from 'components';
import React from 'react';

type TCallInfoDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  userNames: { id: number; name: string }[];
  onGamesClick: () => void;
};

const CallInfoDrawer = ({
  isOpen,
  onClose,
  name,
  userNames,
  onGamesClick,
}: TCallInfoDrawerProps): JSX.Element => (
  <Drawer isOpen={isOpen} isFullHeight onClose={onClose} placement="right">
    <DrawerOverlay />
    <DrawerContent bg="cyan.700">
      <DrawerCloseButton />
      <DrawerHeader>
        <Heading color="white">{name}</Heading>
      </DrawerHeader>

      <DrawerBody>
        <Heading size="sm" color="white">
          Users:
        </Heading>
        <AvatarGroup size="sm" max={5}>
          {userNames.map(userName => (
            <TooltipAvatar
              key={userName.id}
              size="md"
              color="white"
              name={userName.name}
            />
          ))}
        </AvatarGroup>

        <Button
          w="100%"
          onClick={onGamesClick}
          mt={4}
          colorScheme="cyan"
          color="white"
        >
          Games
        </Button>
      </DrawerBody>
    </DrawerContent>
  </Drawer>
);

export default CallInfoDrawer;
