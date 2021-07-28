import { Flex } from '@chakra-ui/react';
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Profile, SignUp, Users } from '../../pages';
import { adminRoutes, publicRoutes, userRoutes } from '../../resources/routes';
import { AuthContextProvider } from '../../store/auth';
import PrivateRoute from '../atoms/PrivateRoute';
import { WorkspacePopover } from '..';
import Navbar from '../organisms/Navbar';
import AdminRoute from '../atoms/AdminRoute';

const App = (): JSX.Element => (
  <Flex direction="row" wrap="wrap" justify="center">
    <Router>
      <AuthContextProvider>
        <Navbar />
        <WorkspacePopover />
        <Flex
          flexBasis="100%"
          justifyContent="center"
          mx="auto"
          py={3}
          px={[5, 5, 8]}>
          <Switch>
            <Route exact path={publicRoutes.HOME}>
              HOME
            </Route>
            <Route path={publicRoutes.SIGN_UP}>
              <SignUp />
            </Route>
            <PrivateRoute path={userRoutes.PROFILE}>
              <Profile />
            </PrivateRoute>
            <AdminRoute path={adminRoutes.USERS_MANAGEMENT}>
              <Users />
            </AdminRoute>
          </Switch>
        </Flex>
      </AuthContextProvider>
    </Router>
  </Flex>
);

export default App;
