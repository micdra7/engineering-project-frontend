import {
  Box,
  Heading,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  Th,
  Center,
} from '@chakra-ui/react';
import React from 'react';
import { useQuery } from 'react-query';
import { API } from 'services/api';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { DATE_TIME } from 'resources/constants';
import { Loader } from 'components';
import { TAuthProviderState, TAuthState, useAuth } from 'services/Auth/Auth';

const UpcomingCallsList = (): JSX.Element => {
  const auth: TAuthProviderState = useAuth();
  const authState: TAuthState = auth.getCurrentState();

  const { data: calls, isLoading: callsLoading } = useQuery(
    '/dashboard/calls',
    () => API.get('/dashboard/calls'),
  );

  if (callsLoading) {
    return <Loader />;
  }

  return (
    <Box w="100%" py={4}>
      <Heading size="md">Upcoming calls</Heading>
      {calls?.data?.data?.length > 0 ? (
        <Table variant="striped" colorScheme="cyan" w="100%">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Start date</Th>
              <Th />
            </Tr>
          </Thead>
          <Tbody>
            {calls?.data.data.map(item => (
              <Tr key={item.id}>
                <Td>{item.name}</Td>
                <Td>{moment(item.startDate).format(DATE_TIME.DATE_TIME)}</Td>
                <Td>
                  <Link
                    to={`/calls/${item.generatedCode}?workspaceName=${authState.currentWorkspace.workspaceName}`}>
                    <Button colorScheme="cyan" color="white">
                      Join call
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

export default UpcomingCallsList;
