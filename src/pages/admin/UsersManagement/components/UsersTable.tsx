import {
  Box,
  Flex,
  Grid,
  Icon,
  IconButton,
  Switch,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
} from '@chakra-ui/react';
import { Loader, WideContentPage } from 'components';
import Pagination from 'components/molecules/Pagination';

import React, { useEffect, useState } from 'react';
import { FaEdit, FaPlus } from 'react-icons/fa';
import { useMutation, useQuery } from 'react-query';
import { useHistory } from 'react-router-dom';
import { API } from 'services/api';
import { TAuthProviderState, TAuthState, useAuth } from 'services/Auth/Auth';
import { useLogger } from 'services/toast';

const UsersTable = (): JSX.Element => {
  const auth: TAuthProviderState = useAuth();
  const authState: TAuthState = auth.getCurrentState();
  const history = useHistory();
  const logger = useLogger();

  const [paginationState, setPaginationState] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 10,
    itemCount: 10,
  });

  const {
    isLoading: usersLoading,
    isSuccess: usersLoaded,
    data: users,
    refetch: refetchUsers,
  } = useQuery(
    ['/users', paginationState.currentPage, paginationState.itemCount],
    () =>
      API.get(
        `/users?page=${paginationState.currentPage}&limit=${paginationState.itemCount}`,
      ),
  );
  const statusMutation = useMutation((data: Record<string, unknown>) =>
    API.patch(`/users/${data.id}/change-status`, data),
  );

  useEffect(() => {
    if (usersLoaded && users) {
      setPaginationState(users.data.meta);
    }
  }, [usersLoaded, users]);

  const handleStatusChange = async (
    id: number,
    email: string,
    role: number,
    status: boolean,
  ) => {
    try {
      await statusMutation.mutateAsync({ id, email, role, status });

      logger.success({
        title: 'Success',
        description: 'Status changed successfully',
      });
      refetchUsers();
    } catch (error) {
      logger.error({
        title: 'Error',
        description: error?.response?.data?.message ?? 'Something went wrong',
      });
    }
  };

  return (
    <WideContentPage title="Users Management">
      <Text mb={6}>Manage users in your workspace</Text>
      <Grid w="100%">
        <Flex w="100%" alignItems="center" justifyContent="flex-end">
          <Tooltip hasArrow placement="left" label="Add user" bg="cyan.500">
            <IconButton
              aria-label="Add user"
              onClick={() => history.push('/admin/users/add')}
              icon={<Icon as={FaPlus} />}
              colorScheme="cyan"
              rounded="md"
              color="white"
            />
          </Tooltip>
        </Flex>
        {usersLoading ? (
          <Loader />
        ) : (
          <Box w="100%" overflowY="unset" overflowX="auto" maxW="100%">
            <Table variant="striped" colorScheme="cyan" minW="900px">
              <Thead>
                <Tr>
                  <Th>Email</Th>
                  <Th>First Name</Th>
                  <Th>Last Name</Th>
                  <Th>Role</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {users?.data?.data?.map(item => (
                  <Tr key={item.email}>
                    <Td>{item.email}</Td>
                    <Td>{item.firstName}</Td>
                    <Td>{item.lastName}</Td>
                    <Td>{item.role === 1 ? 'Admin' : 'User'}</Td>
                    <Td>
                      <Tooltip label="Edit">
                        <IconButton
                          disabled={item.email === authState.email}
                          aria-label="Edit user"
                          colorScheme="cyan"
                          rounded="md"
                          onClick={() =>
                            history.push(`/admin/users/edit/${item.id}`)
                          }
                          icon={<Icon as={FaEdit} color="white" />}
                        />
                      </Tooltip>
                      <Switch
                        ml={3}
                        isDisabled={item.email === authState.email}
                        isChecked={item.isActive}
                        colorScheme="cyan"
                        onChange={() =>
                          handleStatusChange(
                            item.id,
                            item.email,
                            item.role,
                            !item.isActive,
                          )
                        }
                      />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        )}
        <Pagination
          currentPage={paginationState.currentPage}
          totalPages={paginationState.totalPages}
          itemCount={paginationState.itemCount}
          onPageChange={page => {
            setPaginationState({ ...paginationState, currentPage: page });
          }}
          onItemCountChange={itemCount => {
            setPaginationState({
              ...paginationState,
              itemCount,
              currentPage: 1,
            });
          }}
        />
      </Grid>
    </WideContentPage>
  );
};

export default UsersTable;
