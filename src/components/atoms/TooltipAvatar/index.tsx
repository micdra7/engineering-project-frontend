import { Avatar, Tooltip } from '@chakra-ui/react';
import React from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TooltipAvatar: typeof Avatar = (props: Record<string, any>) => (
  <Tooltip label={props.name}>
    <Avatar {...props} />
  </Tooltip>
);

export default TooltipAvatar;
