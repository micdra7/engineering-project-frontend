import React from 'react';
import { Route, useRouteMatch, Switch } from 'react-router-dom';
import UsersTable from './components/UsersTable';

const UsersRoute = (): JSX.Element => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={`${path}`}>
        <UsersTable />
      </Route>
      <Route path={`${path}/add`}>add</Route>
      <Route path={`${path}/edit/:id`}>edit</Route>
    </Switch>
  );
};

export default UsersRoute;
