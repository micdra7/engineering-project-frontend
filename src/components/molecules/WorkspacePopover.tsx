import { RepeatIcon } from '@chakra-ui/icons';
import {
  Avatar,
  HStack,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Tooltip,
} from '@chakra-ui/react';
import React from 'react';
import { useAuth } from '../../store/auth';

const WorkspacePopover = (): JSX.Element => {
  const auth = useAuth();

  return (
    <Popover offset={[120, 5]}>
      <PopoverTrigger>
        <IconButton
          pos="fixed"
          left={6}
          bottom={6}
          rounded="full"
          size="lg"
          colorScheme="green"
          icon={
            <Tooltip
              hasArrow
              placement="right"
              label="Switch workspace"
              bg="green.500"
              gutter={24}>
              <RepeatIcon />
            </Tooltip>
          }
          aria-label="Switch workspaces"
        />
      </PopoverTrigger>
      <PopoverContent bg="green.500" color="white" maxW="280px">
        <PopoverHeader fontWeight="bold">Your workspaces</PopoverHeader>
        <PopoverArrow bg="green.500" />
        <PopoverCloseButton />
        <PopoverBody>
          <HStack spacing="8px" maxW="100%" overflow="auto hidden">
            {auth.workspaces.map(wsp => (
              <Tooltip
                key={wsp.workspaceName}
                hasArrow
                placement="top-end"
                label={wsp.workspaceName}>
                <Avatar
                  size="sm"
                  name={wsp.workspaceName}
                  cursor="pointer"
                  onClick={() => console.log('xd')}
                />
              </Tooltip>
            ))}
          </HStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default WorkspacePopover;
