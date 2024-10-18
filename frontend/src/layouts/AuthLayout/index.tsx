import React from 'react';
import logo from '../../assets/logo.svg';
import { Container } from './styles';

const AuthLayout: React.FC = ({ children }) => {
  return (
    <Container>
      <img src={logo} alt="Medicar" />
      {children}
    </Container>
  );
};

export default AuthLayout;
