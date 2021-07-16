import { useToast } from '@chakra-ui/react';
import axios, { AxiosError } from 'axios';
import React, {
  useCallback,
  useEffect,
  useState,
  useContext,
  useMemo,
} from 'react';
import { useHistory } from 'react-router-dom';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { REQUEST_STATUS } from '../resources/endpoints';
import { Roles } from '../resources/roles';
import { publicRoutes } from '../resources/routes';
import { ErrorResponse } from '../response/error.response';
import { LoginResponse } from '../response/login.response';
import { RefreshResponse } from '../response/refresh.response';
import { UserWorkspacesResponse } from '../response/userWorkspaces.response';
import AuthService from '../services/auth';

const AuthKey = 'game-call-auth';

export interface AuthState {
  isAuthenticated: boolean;
  email: string;
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
  email: '',
};

const getCurrentState = (): AuthState =>
  localStorage.getItem(AuthKey) && localStorage.getItem(AuthKey) !== null
    ? JSON.parse(localStorage.getItem(AuthKey) || '')
    : defaultAuthState;

const saveCurrentState = (state: AuthState) => {
  localStorage.setItem(AuthKey, JSON.stringify(state));
};

if (getCurrentState().isAuthenticated) {
  axios.defaults.headers.Authorization = `Bearer ${
    getCurrentState().accessToken
  }`;
}

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
    delete axios.defaults.headers.Authorization;

    if (state.isAuthenticated) {
      axios.defaults.headers.Authorization = `Bearer ${state.accessToken}`;
    }
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
        email: dto.email,
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

  const logout = useCallback(() => {
    saveCurrentState(defaultAuthState);
    setState(defaultAuthState);
    toast({
      title: 'Logout successful',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
    history.push(publicRoutes.HOME);
  }, []);

  const refresh = useCallback(async () => {
    const currentState = getCurrentState();
    const result = await AuthService.refresh({
      email: currentState.email,
      accessToken: currentState.accessToken,
      refreshToken: currentState.refreshToken,
    });

    if (result.status === REQUEST_STATUS.SUCCESS) {
      const data = result.data as RefreshResponse;
      const newState = {
        ...currentState,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      };

      setState(newState);
      saveCurrentState(newState);

      return true;
    }

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

  useMemo(() => {
    axios.interceptors.response.use(
      response => response,
      async error => {
        const originalRequest = error.config;

        if (
          error.response.status === 401 &&
          originalRequest?.url?.includes('auth')
        ) {
          logout();
          return;
        }

        if (error.response.status === 401) {
          const result = await refresh();

          if (result) {
            // eslint-disable-next-line consistent-return
            return axios(originalRequest);
          }

          throw error;
        }
      },
    );
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, logIn, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthContextProvider };

export const useAuth = (): AuthState => useContext(AuthContext);
