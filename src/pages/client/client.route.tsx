import React from 'react';
import { Redirect, Route, useRouteMatch, Switch } from 'react-router-dom';
import { TAuthProviderState, TAuthState, useAuth } from 'services/Auth/Auth';
import Dashboard from './Dashboard';
import Profile from './Profile';

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
      <Route path={`${path}/calls`}>Calls</Route>
      <Route path={`${path}/chats`}>Chats</Route>
      <Route path={`${path}/tasks`}>Tasks</Route>
      <Route path={`${path}/game-results`}>Game results</Route>
      <Route path={`${path}/profile`}>
        <Profile />
      </Route>
    </Switch>
  );
};

export default ClientRoute;
