import React, {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { FaEye } from 'react-icons/fa';
import { useHistory } from 'react-router-dom';
import Alert from '../../components/Alert';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useAuth } from '../../context/auth';
import AuthLayout from '../../layouts/AuthLayout';
import { FormActions } from '../../layouts/AuthLayout/styles';

const Login: React.FC = () => {
  const { login } = useAuth();
  const history = useHistory();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const isValidLoginForm = useMemo(() => {
    return email && password;
  }, [email, password]);

  useEffect(() => {
    setLoginError('');
  }, [email, password]);

  const handleSignUp = useCallback(() => {
    history.push('/signup');
  }, [history]);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      try {
        event.preventDefault();

        setLoginError('');
        setLoading(true);

        await login({ email, password });
      } catch (err : any) {
        setLoginError(err.message);
        setLoading(false);
      }
    },
    [email, password, login],
  );

  return (
    <AuthLayout>
      {loginError && <Alert>{loginError}</Alert>}
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          name="email"
          label="E-mail"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <Input
          type="password"
          name="password"
          label="Senha"
          value={password}
          onChange={e => setPassword(e.target.value)}
          icon={FaEye}
        />

        <FormActions>
          <Button type="button" variant="secondary" onClick={handleSignUp}>
            Criar Conta
          </Button>
          <Button type="submit" loading={loading} disabled={!isValidLoginForm}>
            Acessar
          </Button>
        </FormActions>
      </form>
    </AuthLayout>
  );
};

export default Login;
