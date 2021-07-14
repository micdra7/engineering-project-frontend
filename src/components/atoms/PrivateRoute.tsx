import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { publicRoutes } from '../../resources/routes';
import { useAuth } from '../../store/auth';

interface PrivateRouteProps {
  path: string;
  exact?: boolean;
  children: JSX.Element | JSX.Element[];
}

const PrivateRoute = ({
  path,
  exact,
  children,
}: PrivateRouteProps): JSX.Element => {
  const auth = useAuth();

  if (!auth.isAuthenticated) {
    return <Redirect to={publicRoutes.SIGN_UP} />;
  }

  return (
    <Route path={path} exact={exact}>
      {children}
    </Route>
  );
};

export default PrivateRoute;
