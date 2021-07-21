import axios from 'axios';
import { AddToWorkspaceDto } from '../dto/add-to-workspace.dto';
import {
  ENDPOINT,
  REQUEST_STATUS,
  ServiceResponse,
} from '../resources/endpoints';
import { ProfileResponse } from '../response/profile.response';

class WorkspacesService {
  static async addUserToWorkspace(
    dto: AddToWorkspaceDto,
  ): Promise<ServiceResponse> {
    try {
      const { data }: { data: ProfileResponse } = await axios.post(
        ENDPOINT.workspaces.addUser,
        dto,
      );
      return { status: REQUEST_STATUS.SUCCESS, data };
    } catch (error) {
      return { status: REQUEST_STATUS.ERROR, error };
    }
  }
}

export default WorkspacesService;
