import { EditIcon } from '@chakra-ui/icons';
import {
  Box,
  IconButton,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Slide,
  Spinner,
  useToast,
} from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { AxiosError } from 'axios';
import Pagination from '../../../components/molecules/Pagination';
import { Roles } from '../../../resources/roles';
import { adminRoutes } from '../../../resources/routes';
import { UserListResponse } from '../../../response/user-list.response';
import { ErrorResponse } from '../../../response/error.response';
import { PaginationResponse } from '../../../response/pagination.response';
import UsersService from '../../../services/users';
import { REQUEST_STATUS } from '../../../resources/endpoints';

const fetchUsers = async (
  page: number,
  limit: number,
  onSuccess: (data: PaginationResponse<UserListResponse>) => void,
  onError: (error: AxiosError) => void,
) => {
  const result = await UsersService.getUsersList(page, limit);

  if (result.status === REQUEST_STATUS.SUCCESS) {
    onSuccess(result.data as PaginationResponse<UserListResponse>);
  } else {
    onError(result.error as AxiosError);
  }
};

const UsersTable = (): JSX.Element => {
  const history = useHistory();
  const toast = useToast();

  const [entries, setEntries] = useState<UserListResponse[]>([]);
  const [paginationState, setPaginationState] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 10,
    itemCount: 10,
  });
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchUsers(
      paginationState.currentPage,
      paginationState.itemCount,
      data => {
        setEntries(data.data);
        setPaginationState(data.meta);
      },
      error => {
        toast({
          title: 'Could not load users list',
          description:
            error.response?.status === 400
              ? (error.response.data as ErrorResponse).message ??
                'Something went wrong. Please try again later'
              : undefined,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      },
    );
    setLoading(false);
  }, [paginationState.currentPage, paginationState.itemCount]);

  if (isLoading) {
    return (
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="green.500"
        size="xl"
      />
    );
  }

  return (
    <Box flexBasis="100%" w="100%">
      <Box w="100%" overflowY="unset" overflowX="auto">
        <Table variant="striped" colorScheme="green" minW="900px">
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
            {entries.map(entry => (
              <Tr key={entry.email}>
                <Td>{entry.email}</Td>
                <Td>{entry.firstName}</Td>
                <Td>{entry.lastName}</Td>
                <Td>{entry.role === Roles.Admin ? 'Admin' : 'User'}</Td>
                <Td>
                  <IconButton
                    aria-label="Edit user"
                    colorScheme="green"
                    rounded="md"
                    onClick={() =>
                      history.push(
                        `${adminRoutes.USERS_MANAGEMENT}/${entry.id}`,
                      )
                    }
                    icon={<EditIcon />}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
      <Pagination
        currentPage={paginationState.currentPage}
        totalPages={paginationState.totalPages}
        itemCount={paginationState.itemCount}
        onPageChange={(page: number) => {
          setPaginationState({ ...paginationState, currentPage: page });
        }}
        onItemCountChange={(itemCount: number) => {
          setPaginationState({ ...paginationState, itemCount, currentPage: 1 });
        }}
      />
    </Box>
  );
};

export default UsersTable;
