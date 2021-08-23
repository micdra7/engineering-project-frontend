import { SimpleGrid, Text } from '@chakra-ui/react';
import React from 'react';

type TTaskItemEntryProps = {
  id?: number;
  name?: string;
};

const TaskItemEntry = ({ id, name }: TTaskItemEntryProps): JSX.Element => (
  <SimpleGrid columns={2} spacing={4}>
    <Text>{name}</Text>
  </SimpleGrid>
);

export default TaskItemEntry;
