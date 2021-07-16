import { RepeatIcon } from '@chakra-ui/icons';
import { IconButton, Tooltip } from '@chakra-ui/react';
import React from 'react';
import { useAuth } from '../../store/auth';

interface WorkspaceButtonProps {
  onClick: () => void;
}

const WorkspaceButton = ({ onClick }: WorkspaceButtonProps): JSX.Element => {
  const auth = useAuth();

  if (!auth.isAuthenticated || auth.workspaces.length <= 1) {
    return <></>;
  }

  return (
    <Tooltip hasArrow placement="right" label="Switch workspace" bg="green.500">
      <IconButton
        onClick={onClick}
        pos="fixed"
        left={6}
        bottom={6}
        rounded="full"
        size="lg"
        colorScheme="green"
        icon={<RepeatIcon />}
        aria-label="Switch workspaces"
      />
    </Tooltip>
  );
};

export default WorkspaceButton;
