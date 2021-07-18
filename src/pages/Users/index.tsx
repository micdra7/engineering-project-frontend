import { Grid, Heading, useToast } from '@chakra-ui/react';
import { AxiosError } from 'axios';
import React, { useState, useEffect } from 'react';
import { REQUEST_STATUS } from '../../resources/endpoints';
import { ErrorResponse } from '../../response/error.response';
import { PaginationResponse } from '../../response/pagination.response';
import { UserListResponse } from '../../response/user-list.response';
import UsersService from '../../services/users';
import { useAuth } from '../../store/auth';
import UsersTable from './components/UsersTable';

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

const Users = (): JSX.Element => {
  const auth = useAuth();
  const toast = useToast();
  const [entries, setEntries] = useState<UserListResponse[]>([]);

  useEffect(() => {
    fetchUsers(
      1,
      10,
      data => {
        setEntries(data.data);
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
  }, []);

  return (
    <Grid flexBasis="100%" maxW="1440px" mb={4} mt={[2, 2, 4]}>
      <Heading
        color="green.500"
        mb={4}
        w="100%"
        textAlign={['center', 'center', 'left']}>
        Users management - {auth.currentWorkspaceName}
      </Heading>
      <UsersTable entries={entries} />
    </Grid>
  );
};

export default Users;
