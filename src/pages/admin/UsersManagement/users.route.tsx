import React from 'react';
import { Route, useRouteMatch, Switch } from 'react-router-dom';

const UsersRoute = (): JSX.Element => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={`${path}`}>
        list
      </Route>
      <Route path={`${path}/add`}>add</Route>
      <Route path={`${path}/edit/:id`}>edit</Route>
    </Switch>
  );
};

export default UsersRoute;
