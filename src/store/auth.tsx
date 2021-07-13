import { useToast } from '@chakra-ui/react';
import axios, { AxiosError } from 'axios';
import React, { useCallback, useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { REQUEST_STATUS } from '../resources/endpoints';
import { Roles } from '../resources/roles';
import { ErrorResponse } from '../response/error.response';
import { LoginResponse } from '../response/login.response';
import { UserWorkspacesResponse } from '../response/userWorkspaces.response';
import AuthService from '../services/auth';

const AuthKey = 'game-call-auth';

export interface AuthState {
  isAuthenticated: boolean;
  accessToken: string;
  refreshToken: string;
  role: Roles;
  workspaces: UserWorkspacesResponse[];
  [others: string]: unknown;
}

const defaultAuthState: AuthState = {
  accessToken: '',
  refreshToken: '',
  role: Roles.User,
  workspaces: [],
  isAuthenticated: false,
};

const getCurrentState = (): AuthState =>
  localStorage.getItem(AuthKey) && localStorage.getItem(AuthKey) !== null
    ? JSON.parse(localStorage.getItem(AuthKey) || '')
    : defaultAuthState;

const saveCurrentState = (state: AuthState) => {
  localStorage.setItem(AuthKey, JSON.stringify(state));
};

const AuthContext = React.createContext(getCurrentState());

const AuthContextProvider = ({
  children,
}: {
  children: JSX.Element[] | JSX.Element;
}): JSX.Element => {
  const [state, setState] = useState<AuthState>(getCurrentState());
  const history = useHistory();
  const toast = useToast();

  useEffect(() => {
    axios.interceptors.request.use(config => {
      config.headers.Authorization = `Bearer ${state.accessToken}`;

      return config;
    });
  }, [state.accessToken]);

  const logIn = useCallback(async (dto: LoginDto) => {
    const result = await AuthService.login(dto);

    if (result.status === REQUEST_STATUS.SUCCESS) {
      const data: LoginResponse = result.data as LoginResponse;
      const newState: AuthState = {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        isAuthenticated: true,
        role: data.workspaces?.filter(w => w.isDefault)[0].role ?? Roles.User,
        workspaces: data.workspaces || [],
      };

      setState(newState);
      saveCurrentState(newState);
      toast({
        title: 'Login successful',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      return true;
    }

    const error: AxiosError = result.error as AxiosError;

    toast({
      title: 'Login failed',
      description:
        error.response?.status === 401 ? 'Invalid credentials' : undefined,
      status: 'error',
      duration: 5000,
      isClosable: true,
    });
    return false;
  }, []);

  const register = useCallback(async (dto: RegisterDto) => {
    const result = await AuthService.register(dto);

    if (result.status === REQUEST_STATUS.SUCCESS) {
      toast({
        title: 'Registration successful',
        description: 'You can now log in',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      return true;
    }

    const error: AxiosError = result.error as AxiosError;

    toast({
      title: 'Registration failed',
      description:
        error.response?.status === 400
          ? (error.response.data as ErrorResponse).message ??
            'Something went wrong. Please try again later'
          : undefined,
      status: 'error',
      duration: 5000,
      isClosable: true,
    });
    return false;
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, logIn, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthContextProvider };

export const useAuth = (): AuthState => useContext(AuthContext);
