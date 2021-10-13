import React from 'react';
import { Redirect, Route, useRouteMatch, Switch } from 'react-router-dom';
import { TAuthProviderState, TAuthState, useAuth } from 'services/Auth/Auth';
import Calls from './Calls';
import Chats from './Chats';
import Dashboard from './Dashboard';
import GameResults from './GameResults';
import Profile from './Profile';
import Tasks from './Tasks';

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
      <Route path={`${path}/calls`}>
        <Calls />
      </Route>
      <Route path={`${path}/chats`}>
        <Chats />
      </Route>
      <Route path={`${path}/tasks`}>
        <Tasks />
      </Route>
      <Route path={`${path}/game-results`}>
        <GameResults />
      </Route>
      <Route path={`${path}/profile`}>
        <Profile />
      </Route>
    </Switch>
  );
};

export default ClientRoute;
