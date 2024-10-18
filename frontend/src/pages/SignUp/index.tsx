import React, {
  ChangeEvent,
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

interface FormData {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

const SignUp: React.FC = () => {
  const history = useHistory();
  const { signUp } = useAuth();

  const [data, setData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });
  const [signUpError, setSignUpError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const name = event.target.name;
      const value = event.target.value;

      setData({ ...data, [name]: value });
    },
    [data],
  );

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      try {
        event.preventDefault();

        setLoading(true);
        setSignUpError('');

        await signUp(data);
      } catch (err : any) {
        setSignUpError(err?.message);
        setLoading(false);
      }
    },
    [data, signUp],
  );

  const handleCancel = useCallback(() => {
    history.push('/');
  }, [history]);

  const isValidSignUpForm = useMemo(() => {
    return Object.values(data).every(value => Boolean(value));
  }, [data]);

  useEffect(() => {
    setSignUpError('');
  }, [data]);

  return (
    <AuthLayout>
      {signUpError && <Alert>{signUpError}</Alert>}
      <form onSubmit={handleSubmit}>
        <Input
          required
          name="name"
          type="text"
          label="Nome"
          onChange={handleInputChange}
        />
        <Input
          required
          name="email"
          type="email"
          label="E-mail"
          onChange={handleInputChange}
        />
        <Input
          required
          name="password"
          type="password"
          label="Senha"
          onChange={handleInputChange}
          icon={FaEye}
        />
        <Input
          required
          name="passwordConfirm"
          type="password"
          label="Confirmar senha"
          onChange={handleInputChange}
          icon={FaEye}
        />

        <FormActions>
          <Button type="button" variant="secondary" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={!isValidSignUpForm} loading={loading}>
            Confirmar
          </Button>
        </FormActions>
      </form>
    </AuthLayout>
  );
};

export default SignUp;
