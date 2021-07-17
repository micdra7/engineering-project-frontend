import { Roles } from '../resources/roles';

export class UserWorkspacesResponse {
  id?: number;
  role = Roles.User;
  workspaceName = '';
  isDefault = false;
}
