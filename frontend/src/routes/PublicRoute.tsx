import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { useAuth } from '../context/auth';

interface PublicRouteProps extends Omit<RouteProps, 'component'> {
  component: React.ReactType;
  restricted?: boolean;
}

const PublicRoute: React.SFC<PublicRouteProps> = ({
  restricted = false,
  component: Component,
  ...rest
}) => {
  const { isSignedIn } = useAuth();

  return (
    <Route
      {...rest}
      render={props => {
        return isSignedIn && restricted ? (
          <Redirect to="/dashboard" />
        ) : (
          <Component {...props} />
        );
      }}
    />
  );
};

export default PublicRoute;
