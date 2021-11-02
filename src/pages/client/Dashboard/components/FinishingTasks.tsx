import { Loader } from 'components';
import React from 'react';
import { useQuery } from 'react-query';
import { API } from 'services/api';
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  Th,
  Button,
  Center,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { DATE_TIME } from 'resources/constants';

const FinishingTasks = (): JSX.Element => {
  const { data: tasks, isLoading: tasksLoading } = useQuery(
    '/dashboard/tasks',
    () => API.get('/dashboard/tasks'),
  );

  if (tasksLoading) {
    return <Loader />;
  }

  return (
    <Box w="100%" py={4}>
      <Heading size="md">Tasks with an upcoming finish date</Heading>
      {tasks?.data?.data?.length > 0 ? (
        <Table variant="striped" colorScheme="cyan" w="100%">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Finish date</Th>
              <Th />
            </Tr>
          </Thead>
          <Tbody>
            {tasks?.data.data.map(item => (
              <Tr key={item.id}>
                <Td>{item.name}</Td>
                <Td>{moment(item.finishDate).format(DATE_TIME.DATE_TIME)}</Td>
                <Td>
                  <Link to={`/client/tasks?taskId=${item.id}`}>
                    <Button colorScheme="cyan" color="white">
                      Open task
                    </Button>
                  </Link>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      ) : (
        <Center>
          <Heading size="sm">There is no data to show</Heading>
        </Center>
      )}
    </Box>
  );
};

export default FinishingTasks;
