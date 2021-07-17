import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { Roles } from '../../resources/roles';
import { publicRoutes } from '../../resources/routes';
import { useAuth } from '../../store/auth';

interface AdminRouteProps {
  path: string;
  exact?: boolean;
  children: JSX.Element | JSX.Element[];
}

const AdminRoute = ({
  path,
  exact,
  children,
}: AdminRouteProps): JSX.Element => {
  const auth = useAuth();

  if (!auth.isAuthenticated || auth.role !== Roles.Admin) {
    return <Redirect to={publicRoutes.SIGN_UP} />;
  }

  return (
    <Route path={path} exact={exact}>
      {children}
    </Route>
  );
};

export default AdminRoute;
