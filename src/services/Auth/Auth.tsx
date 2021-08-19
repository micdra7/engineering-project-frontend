export interface AuthState {
  isAuthenticated: boolean;
  email: string;
  accessToken: string;
  refreshToken: string;
  role: Roles;
  workspaces: UserWorkspacesResponse[];
  currentWorkspaceName: string;
  currentWorkspaceId: number;
  [others: string]: unknown;
}
