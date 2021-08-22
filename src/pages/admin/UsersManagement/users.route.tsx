import React from 'react';
import { Route, useRouteMatch, Switch } from 'react-router-dom';
import AddUserForm from './components/AddUserForm';
import EditUserForm from './components/EditUserForm';
import UsersTable from './components/UsersTable';

const UsersRoute = (): JSX.Element => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={`${path}`}>
        <UsersTable />
      </Route>
      <Route path={`${path}/add`}>
        <AddUserForm />
      </Route>
      <Route path={`${path}/edit/:userId`}>
        <EditUserForm />
      </Route>
    </Switch>
  );
};

export default UsersRoute;
