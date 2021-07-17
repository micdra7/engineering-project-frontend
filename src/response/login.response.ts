import { UserWorkspacesResponse } from './userWorkspaces.response';

export class LoginResponse {
  accessToken = '';
  refreshToken = '';
  workspaces?: UserWorkspacesResponse[];
}
