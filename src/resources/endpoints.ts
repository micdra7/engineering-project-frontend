export const BASE_API_URL = process.env.REACT_APP_API_URL;

const AUTH_CONTROLLER = 'auth';
const USERS_CONTROLLER = 'users';
const WORKSPACE_CONTROLLER = 'workspaces';

export const REQUEST_STATUS = {
  ERROR: 'ERROR',
  SUCCESS: 'SUCCESS',
};

export interface ServiceResponse {
  status: string;
  data?: unknown;
  error?: unknown;
}

const createUrl = (
  controller: string,
  endpoint: string,
  params?: string,
): string =>
  `${BASE_API_URL}/${controller}${endpoint ? `/${endpoint}` : ''}${
    params ? `?${params}` : ''
  }`;

export const ENDPOINT = {
  auth: {
    register: createUrl(AUTH_CONTROLLER, 'register'),
    login: createUrl(AUTH_CONTROLLER, 'login'),
    refresh: createUrl(AUTH_CONTROLLER, 'refresh'),
    switchWorkspace: createUrl(AUTH_CONTROLLER, 'switch'),
  },
  user: {
    current: createUrl(USERS_CONTROLLER, 'current/profile'),
    list: (page: number, limit: number): string =>
      createUrl(USERS_CONTROLLER, '', `page=${page}&limit=${limit}`),
    findByEmail: createUrl(USERS_CONTROLLER, 'find-by-email'),
    single: (id: number): string => createUrl(USERS_CONTROLLER, `${id}`),
  },
  workspaces: {
    addUser: createUrl(WORKSPACE_CONTROLLER, 'add-user'),
  },
};
