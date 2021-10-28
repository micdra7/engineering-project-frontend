import React from 'react';
import { Redirect, Route, useRouteMatch, Switch } from 'react-router-dom';
import { TAuthProviderState, TAuthState, useAuth } from 'services/Auth/Auth';
import GamesDataManagement from './GamesDataManagement';
import GamesManagement from './GamesManagement';
import UsersRoute from './UsersManagement/users.route';

const AdminRoute = (): JSX.Element => {
  const auth: TAuthProviderState = useAuth();
  const authState: TAuthState = auth.getCurrentState();

  const { path } = useRouteMatch();

  if (!authState.isAuthenticated || authState.role === 0) {
    return <Redirect to="/" />;
  }

  return (
    <Switch>
      <Route path={`${path}/users`}>
        <UsersRoute />
      </Route>
      <Route exact path={`${path}/games`}>
        <GamesManagement />
      </Route>
      <Route path={`${path}/games/:gameId/data`}>
        <GamesDataManagement />
      </Route>
    </Switch>
  );
};

export default AdminRoute;
