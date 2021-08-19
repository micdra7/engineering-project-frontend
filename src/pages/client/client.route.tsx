import React from 'react';
import { Redirect, Route, useRouteMatch, Switch } from 'react-router-dom';
import { TAuthProviderState, TAuthState, useAuth } from 'services/Auth/Auth';
import Dashboard from './Dashboard';

const ClientRoute = (): JSX.Element => {
  const auth: TAuthProviderState = useAuth();
  const authState: TAuthState = auth.getCurrentState();

  const { path } = useRouteMatch();

  if (!authState.isAuthenticated) {
    return <Redirect to="/" />;
  }

  return (
    <Switch>
      <Route exact path={`${path}`}>
        <Dashboard />
      </Route>
    </Switch>
  );
};

export default ClientRoute;
