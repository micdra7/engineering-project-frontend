import {
  AddIcon,
  CheckCircleIcon,
  EditIcon,
  NotAllowedIcon,
} from '@chakra-ui/icons';
import {
  Box,
  IconButton,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Spinner,
  useToast,
  Grid,
  Flex,
  Tooltip,
  Switch,
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
import { useAuth } from '../../../store/auth';

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
  const auth = useAuth();

  const [entries, setEntries] = useState<UserListResponse[]>([]);
  const [paginationState, setPaginationState] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 10,
    itemCount: 10,
  });
  const [isLoading, setLoading] = useState(false);
  const [refreshCounter, setRefreshCounter] = useState(0);

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
  }, [paginationState.currentPage, paginationState.itemCount, refreshCounter]);

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
    <Grid flexBasis="100%" w="100%">
      <Flex w="100%" alignItems="center" justifyContent="flex-end">
        {/* search input should be added here */}
        <Tooltip hasArrow placement="left" label="Add user" bg="green.500">
          <IconButton
            aria-label="Add user"
            onClick={() => history.push(adminRoutes.USERS_ADD)}
            icon={<AddIcon />}
            colorScheme="green"
            rounded="md"
          />
        </Tooltip>
      </Flex>
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
                  <Tooltip label="Edit">
                    <IconButton
                      disabled={entry.email === auth.email}
                      aria-label="Edit user"
                      colorScheme="green"
                      rounded="md"
                      onClick={() =>
                        history.push(`${adminRoutes.USERS_EDIT}/${entry.id}`)
                      }
                      icon={<EditIcon />}
                    />
                  </Tooltip>
                  <Switch
                    ml={3}
                    isDisabled={entry.email === auth.email}
                    isChecked={entry.isActive}
                    colorScheme="green"
                    onChange={async () => {
                      await UsersService.changeStatus(entry.id, {
                        email: entry.email,
                        role: entry.role,
                        status: !entry.isActive,
                      });

                      setRefreshCounter(old => old + 1);
                    }}
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
    </Grid>
  );
};

export default UsersTable;
