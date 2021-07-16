export const BASE_API_URL = process.env.REACT_APP_API_URL;

const AUTH_CONTROLLER = 'auth';
const USERS_CONTROLLER = 'users';

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
  },
  user: {
    current: createUrl(USERS_CONTROLLER, 'current/profile'),
  },
};
