import React, { useCallback, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import logo from '../../assets/logo.svg';
import { useAuth } from '../../context/auth';
import Link from '../Link';
import { Container } from './styles';

const Navbar: React.FC = () => {
  const { logout, user } = useAuth();
  const history = useHistory();
  const [isDoctor, setIsDoctor] = React.useState(false);
  const [isAdmin, setIsAdmin] = React.useState(false);

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

   // redirect to create file
  const doctors = useCallback(() => {
    history.push("/doctors");
  }, [history]);

  const specialist = useCallback(() => {
    history.push("/specialist");
  }, [history]);

  useEffect(() => {
    let storedUserString = localStorage.getItem('Medicar@auth_user');
      if (storedUserString) {
        try {
          let storedUser = JSON.parse(storedUserString);
          if (storedUser && storedUser.crm) {
            setIsDoctor(true);
          }
          if (storedUser && storedUser.isAdmin) {
            setIsAdmin(true);
          }
        } catch (e) {
          console.error('Error parsing stored user:', e);
        }
      }
  }
  , []);

  return (
    <Container>
      <img src={logo} alt="Medicar" />

      <section>
        <span>{user?.name}</span>
        <span></span>

        {isAdmin && (
          <>
          <Link onClick={doctors}>Médicos</Link>
          <span></span>
          <Link onClick={specialist}>Especialidade</Link>
          <span></span>
          </>
        )}
        <Link onClick={handleLogout}>Desconectar</Link>
      </section>
    </Container>
  );
};

export default Navbar;
