import axios from 'axios';
import { UpdateDto } from '../dto/update.dto';
import {
  ENDPOINT,
  REQUEST_STATUS,
  ServiceResponse,
} from '../resources/endpoints';
import { ProfileResponse } from '../response/profile.response';
import { UserListResponse } from '../response/user-list.response';

class UsersService {
  static async getCurrentUserProfile(): Promise<ServiceResponse> {
    try {
      const { data }: { data: ProfileResponse } = await axios.get(
        ENDPOINT.user.current,
      );
      return { status: REQUEST_STATUS.SUCCESS, data };
    } catch (error) {
      return { status: REQUEST_STATUS.ERROR, error };
    }
  }

  static async updateCurrentUser(dto: UpdateDto): Promise<ServiceResponse> {
    try {
      const { data }: { data: ProfileResponse } = await axios.patch(
        ENDPOINT.user.current,
        dto,
      );
      return { status: REQUEST_STATUS.SUCCESS, data };
    } catch (error) {
      return { status: REQUEST_STATUS.ERROR, error };
    }
  }

  static async getUsersList(
    page: number,
    limit: number,
  ): Promise<ServiceResponse> {
    try {
      const { data }: { data: UserListResponse } = await axios.get(
        ENDPOINT.user.list(page, limit),
      );
      return { status: REQUEST_STATUS.SUCCESS, data };
    } catch (error) {
      return { status: REQUEST_STATUS.ERROR, error };
    }
  }

  static async findByEmail(email: string): Promise<ServiceResponse> {
    try {
      const { data }: { data: ProfileResponse } = await axios.post(
        ENDPOINT.user.findByEmail,
        { email },
      );
      return { status: REQUEST_STATUS.SUCCESS, data };
    } catch (error) {
      return { status: REQUEST_STATUS.ERROR, error };
    }
  }
}

export default UsersService;
