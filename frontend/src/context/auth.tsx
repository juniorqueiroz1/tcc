import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import Doctor from '../models/Doctor';
import User from '../models/User';
import api from '../services/api';

type LoginResponse = { user: User; token: string };

interface LoginCredentials {
  email: string;
  password: string;
}

interface SignupCredentials {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

interface AuthContextData {
  user: User | Doctor | null;
  token: string | null;
  isSignedIn: boolean;
  login(credentials: LoginCredentials): Promise<void>;
  logout(): void;
  signUp(credentials: SignupCredentials): Promise<void>;
}

export const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData,
);

export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<User | Doctor | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const login = useCallback(async ({ email, password }: LoginCredentials) => {
    try {
      const response = await api.post<LoginResponse>('login/', {
        email,
        password,
      });

      const { user, token } = response.data;

      setToken(token);
      setUser(user);
    } catch (err : any) {
      if (err.response && err.response.status === 401) {
        throw new Error('E-mail e/ou senha incorretos.');
      }

      throw new Error('Não foi possível realizar o login.');
    }
  }, []);

  const signUp = useCallback(
    async ({ name, email, password, passwordConfirm }: SignupCredentials) => {
      if (password !== passwordConfirm) {
        throw new Error('Os dois campos de senha não combinam.');
      }

      try {
        const { data: user } = await api.post<User>('users/', {
          name,
          email,
          password,
        });

        await login({ email: user.email, password });
      } catch (err : any) {
        if (err.response && err.response.status === 409) {
          const { detail } = err.response.data;
          throw new Error(detail);
        }

        throw new Error('Não foi possível criar a conta.');
      }
    },
    [login],
  );

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  const isSignedIn = useMemo(() => {
    return user !== null;
  }, [user]);

  const _configInterceptors = useCallback(() => {
    api.interceptors.response.use(
      response => response,
      error => {
        if (isSignedIn && error.response.status === 401) {
          logout();
        }

        return Promise.reject(error);
      },
    );
  }, [isSignedIn, logout]);

  useEffect(() => {
    const storedUser = localStorage.getItem('Medicar@auth_user');
    const storedToken = localStorage.getItem('Medicar@auth_token');

    setToken(storedToken);
    setUser(storedUser && JSON.parse(storedUser));
  }, []);

  useEffect(() => {
    _configInterceptors();
  }, [_configInterceptors]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('Medicar@auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('Medicar@auth_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('Medicar@auth_token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      localStorage.removeItem('Medicar@auth_token');
      delete api.defaults.headers.authorization;
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={{ user, token, isSignedIn, login, logout, signUp }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextData {
  return useContext(AuthContext);
}
