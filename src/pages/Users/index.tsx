import { Grid, Heading } from '@chakra-ui/react';
import React from 'react';
import { Switch } from 'react-router-dom';
import { AdminRoute } from '../../components';
import { adminRoutes } from '../../resources/routes';
import { useAuth } from '../../store/auth';
import UsersTable from './components/UsersTable';

const Users = (): JSX.Element => {
  const auth = useAuth();

  return (
    <Grid
      flexBasis="100%"
      maxW="1440px"
      mb={4}
      mt={[2, 2, 4]}
      placeItems="center">
      <Heading
        color="green.500"
        mb={4}
        w="100%"
        textAlign={['center', 'center', 'left']}>
        Users management - {auth.currentWorkspaceName}
      </Heading>
      <Switch>
        <AdminRoute exact path={adminRoutes.USERS_MANAGEMENT}>
          <UsersTable />
        </AdminRoute>
      </Switch>
    </Grid>
  );
};

export default Users;
