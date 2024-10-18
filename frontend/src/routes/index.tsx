import React from 'react';
import { Switch } from 'react-router-dom';
import Anamnese from '../pages/Anamnese';
import Dashboard from '../pages/Dashboard';
import Doctors from '../pages/Doctors';
import DoctorsCreate from '../pages/Doctors/create';
import Login from '../pages/Login';
import SignUp from '../pages/SignUp';
import Specialist from '../pages/Specialist';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';

const Routes: React.FC = () => {
  return (
    <Switch>
      <PublicRoute path="/" exact restricted component={Login} />
      <PublicRoute path="/signup" restricted component={SignUp} />
      <PrivateRoute path="/dashboard" component={Dashboard} />
      <PrivateRoute path="/doctors/create" component={DoctorsCreate} />
      <PrivateRoute path="/doctors/edit/:doctor_id" component={DoctorsCreate} />
      <PrivateRoute path="/doctors" component={Doctors} />
      <PrivateRoute path="/anamneses" component={Anamnese} />
      <PrivateRoute path="/specialist" component={Specialist} />
      
    </Switch>
  );
};

export default Routes;
