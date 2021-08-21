import {
  Avatar,
  HStack,
  Icon,
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
import { FaEllipsisH } from 'react-icons/fa';
import { useHistory } from 'react-router-dom';
import { TAuthProviderState, TAuthState, useAuth } from 'services/Auth/Auth';
import { useLogger } from 'services/toast';

const WorkspaceSwitcher = (): JSX.Element => {
  const auth: TAuthProviderState = useAuth();
  const authState: TAuthState = auth.getCurrentState();
  const history = useHistory();
  const logger = useLogger();

  const handleSwitch = async (id: number, name: string) => {
    try {
      await auth.switchWorkspace(id, name);

      logger.success({
        title: 'Success',
        description: `Workspace switched to ${name}`,
      });
      history.push('/client');
    } catch (error) {
      logger.error({
        title: 'Error',
        description: error?.response?.data?.message ?? 'Something went wrong',
      });
    }
  };

  if (!authState.isAuthenticated || authState.workspaces.length <= 1) {
    return <></>;
  }

  return (
    <Popover offset={[100, 5]} strategy="fixed">
      <PopoverTrigger>
        <IconButton
          pos="fixed"
          left={[6, 6, '7.75rem', '17.125rem']}
          bottom={6}
          rounded="full"
          size="lg"
          colorScheme="cyan"
          icon={<Icon as={FaEllipsisH} color="white" />}
          aria-label="Switch workspace"
        />
      </PopoverTrigger>
      <PopoverContent bg="cyan.500" color="white" maxW="250px">
        <PopoverHeader fontWeight="bold">Your workspaces</PopoverHeader>
        <PopoverArrow bg="cyan.500" />
        <PopoverCloseButton />

        <PopoverBody>
          <HStack spacing="8px" maxW="100%" overflow="auto hidden">
            {authState.workspaces.map(workspace => (
              <Tooltip
                key={workspace.workspaceName}
                hasArrow
                placement="top-end"
                label={workspace.workspaceName}>
                <Avatar
                  border={
                    workspace.workspaceName ===
                    authState.currentWorkspace.workspaceName
                      ? '3px solid white'
                      : 'none'
                  }
                  size="sm"
                  name={workspace.workspaceName}
                  cursor={
                    workspace.workspaceName ===
                    authState.currentWorkspace.workspaceName
                      ? 'not-allowed'
                      : 'pointer'
                  }
                  pointerEvents={
                    workspace.workspaceName ===
                    authState.currentWorkspace.workspaceName
                      ? 'none'
                      : 'unset'
                  }
                  transition="border 0.05s ease-in-out"
                  onClick={() =>
                    handleSwitch(workspace.id || 0, workspace.workspaceName)
                  }
                />
              </Tooltip>
            ))}
          </HStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default WorkspaceSwitcher;
