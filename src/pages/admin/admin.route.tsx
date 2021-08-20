import React from 'react';
import { Redirect, Route, useRouteMatch, Switch } from 'react-router-dom';
import { TAuthProviderState, TAuthState, useAuth } from 'services/Auth/Auth';

const AdminRoute = (): JSX.Element => {
  const auth: TAuthProviderState = useAuth();
  const authState: TAuthState = auth.getCurrentState();

  const { path } = useRouteMatch();

  if (!authState.isAuthenticated || authState.role === 0) {
    return <Redirect to="/" />;
  }

  return (
    <Switch>
      <Route path={`${path}/users`}>Users</Route>
      <Route path={`${path}/games`}>Games</Route>
    </Switch>
  );
};

export default AdminRoute;
