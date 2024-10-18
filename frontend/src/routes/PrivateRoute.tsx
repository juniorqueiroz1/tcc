import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { useAuth } from '../context/auth';

interface PrivateRouteProps extends Omit<RouteProps, 'component'> {
  component: React.ReactType;
}

const PrivateRoute: React.SFC<PrivateRouteProps> = ({
  component: Component,
  ...rest
}) => {
  const { isSignedIn } = useAuth();

  return (
    <Route
      {...rest}
      render={props => {
        return isSignedIn ? <Component {...props} /> : <Redirect to="/" />;
      }}
    />
  );
};

export default PrivateRoute;
