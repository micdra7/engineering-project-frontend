import { Box, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import React from 'react';
import { Roles } from '../../../resources/roles';
import { UserListResponse } from '../../../response/user-list.response';

interface UsersTableProps {
  entries: UserListResponse[];
}

const UsersTable = ({ entries }: UsersTableProps): JSX.Element => (
  <Box overflowY="unset" overflowX="auto">
    <Table variant="striped" colorScheme="green" minW="800px">
      <Thead>
        <Tr>
          <Th>Email</Th>
          <Th>First Name</Th>
          <Th>Last Name</Th>
          <Th>Role</Th>
        </Tr>
      </Thead>
      <Tbody>
        {entries.map(entry => (
          <Tr key={entry.email}>
            <Td>{entry.email}</Td>
            <Td>{entry.firstName}</Td>
            <Td>{entry.lastName}</Td>
            <Td>{entry.role === Roles.Admin ? 'Admin' : 'User'}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  </Box>
);

export default UsersTable;
