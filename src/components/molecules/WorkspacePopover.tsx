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
import { useHistory } from 'react-router-dom';
import { userRoutes } from '../../resources/routes';
import { useAuth } from '../../store/auth';

const WorkspacePopover = (): JSX.Element => {
  const auth = useAuth();
  const history = useHistory();

  if (!auth.isAuthenticated || auth.workspaces.length <= 1) {
    return <></>;
  }

  return (
    <Popover offset={[115, 5]} strategy="fixed">
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
                  border={
                    wsp.workspaceName === auth.currentWorkspaceName
                      ? '3px solid white'
                      : undefined
                  }
                  size="sm"
                  name={wsp.workspaceName}
                  cursor={
                    wsp.workspaceName === auth.currentWorkspaceName
                      ? 'not-allowed'
                      : 'pointer'
                  }
                  pointerEvents={
                    wsp.workspaceName === auth.currentWorkspaceName
                      ? 'none'
                      : 'unset'
                  }
                  onClick={async () => {
                    const result = await (
                      auth.switchWorkspace as (
                        id: number,
                        name: string,
                      ) => Promise<boolean>
                    )(wsp.id || 0, wsp.workspaceName);

                    if (result) {
                      history.push(userRoutes.DASHBOARD);
                    }
                  }}
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
