export class RegisterResponse {
  id = 0;
  email = '';
  firstName = '';
  lastName = '';
  isActive = false;
  workspace?: { id: number; name: string };
}
