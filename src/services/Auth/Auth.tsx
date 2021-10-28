import React, { useCallback, useContext, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { API } from 'services/api';
import { useLogger } from 'services/toast';
import { TUserWorkspace } from 'types/UserWorkspaces';
import { TLoginValues, TRegisterValues } from 'types/Auth';

export const LocalStorageAuthKey = 'game-call-auth';

export type TAuthProviderState = {
  getCurrentState: () => TAuthState;
  login: (dto: TLoginValues) => Promise<boolean>;
  register: (dto: TRegisterValues) => Promise<boolean>;
  logout: () => void;
  switchWorkspace: (id: number, name: string) => Promise<boolean>;
};

export type TAuthState = {
  isAuthenticated: boolean;
  id: number;
  email: string;
  accessToken: string;
  refreshToken: string;
  role: number;
  workspaces: TUserWorkspace[];
  currentWorkspace: TUserWorkspace;
};

const defaultAuthState: TAuthState = {
  isAuthenticated: false,
  id: 0,
  email: '',
  accessToken: '',
  refreshToken: '',
  role: 0,
  workspaces: [],
  currentWorkspace: { id: 0, role: 0, isDefault: false, workspaceName: '' },
};

const getCurrentState = (): TAuthState => {
  const localStorageState = localStorage.getItem(LocalStorageAuthKey);

  if (localStorageState) {
    return JSON.parse(localStorageState);
  }

  return defaultAuthState;
};

const saveCurrentState = (state: TAuthState) => {
  localStorage.setItem(LocalStorageAuthKey, JSON.stringify(state));
};

const initialState = getCurrentState();

if (initialState.isAuthenticated) {
  API.defaults.headers.Authorization = `Bearer ${initialState.accessToken}`;
}

const defaultAuthProviderState: TAuthProviderState = {
  getCurrentState,
  login: () => Promise.resolve(true),
  logout: () => {},
  register: () => Promise.resolve(true),
  switchWorkspace: () => Promise.resolve(true),
};

const AuthContext = React.createContext(defaultAuthProviderState);

type TAuthContextProviderProps = {
  children: JSX.Element | JSX.Element[];
};

const AuthContextProvider = ({
  children,
}: TAuthContextProviderProps): JSX.Element => {
  const history = useHistory();
  const logger = useLogger();

  const login = useCallback(async (dto: TLoginValues) => {
    try {
      const { data } = await API.post('/auth/login', dto);

      const defaultWorkspace: TUserWorkspace = data.workspaces?.filter(
        w => w.isDefault,
      )[0];
      const newState: TAuthState = {
        id: data.userId,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        isAuthenticated: true,
        role: defaultWorkspace?.role ?? 0,
        workspaces: data.workspaces || [],
        currentWorkspace: defaultWorkspace,
        email: dto.email,
      };

      API.defaults.headers.Authorization = `Bearer ${newState.accessToken}`;
      saveCurrentState(newState);

      logger.success({ title: 'Login successful' });
      return true;
    } catch (error) {
      logger.error({
        title: 'Error',
        description:
          error?.response?.status === 401
            ? 'Invalid credentials'
            : error?.response?.data?.message ?? 'Something went wrong',
      });
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    saveCurrentState(defaultAuthState);
    logger.success({ title: 'Logout successful' });
    history.push('/');
  }, []);

  const refresh = useCallback(async () => {
    const currentState = getCurrentState();

    try {
      const { data } = await API.post('/auth/refresh', {
        email: currentState.email,
        accessToken: currentState.accessToken,
        refreshToken: currentState.refreshToken,
      });

      const newState: TAuthState = {
        ...currentState,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      };

      API.defaults.headers.Authorization = `Bearer ${newState.accessToken}`;
      saveCurrentState(newState);
      return true;
    } catch (error) {
      return false;
    }
  }, []);

  const register = useCallback(async (dto: TRegisterValues) => {
    try {
      await API.post('/auth/register', dto);

      logger.success({
        title: 'Registration successful',
        description: 'You can now log in',
      });
      return true;
    } catch (error) {
      logger.error({
        title: 'Registration failed',
        description: error?.response?.data?.message ?? 'Something went wrong',
      });
      return false;
    }
  }, []);

  const switchWorkspace = useCallback(async (id: number, name: string) => {
    const currentState = getCurrentState();

    try {
      const { data } = await API.post('/auth/switch', {
        workspaceId: id,
        workspaceName: name,
        accessToken: currentState.accessToken,
        refreshToken: currentState.refreshToken,
      });

      const newState: TAuthState = {
        ...currentState,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        currentWorkspace: currentState.workspaces.filter(w => w.id === id)[0],
        role: currentState.workspaces.filter(w => w.id === id)[0].role,
      };

      API.defaults.headers.Authorization = `Bearer ${newState.accessToken}`;
      saveCurrentState(newState);
      return true;
    } catch (error) {
      logger.error({
        title: `Switching to ${name} failed`,
        description: error?.response?.data?.message ?? 'Something went wrong',
      });
      return false;
    }
  }, []);

  useMemo(() => {
    API.interceptors.response.use(
      response => response,
      async error => {
        const originalRequest = error.config;

        if (
          error.response.status === 401 &&
          originalRequest?.url?.includes('/auth/refresh')
        ) {
          logout();
          return;
        }

        if (
          error.response.status === 401 &&
          !originalRequest?.url?.includes('/auth/login')
        ) {
          const result = await refresh();

          if (result) {
            originalRequest.headers.Authorization = `Bearer ${
              getCurrentState().accessToken
            }`;

            // eslint-disable-next-line consistent-return
            return API(originalRequest);
          }
        }

        throw error;
      },
    );
  }, []);

  return (
    <AuthContext.Provider
      value={{
        getCurrentState,
        login,
        logout,
        register,
        switchWorkspace,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthContextProvider };

export const useAuth = (): TAuthProviderState => useContext(AuthContext);
