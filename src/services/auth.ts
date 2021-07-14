import axios from 'axios';
import { LoginDto } from '../dto/login.dto';
import { RefreshDto } from '../dto/refresh.dto';
import { RegisterDto } from '../dto/register.dto';
import {
  ENDPOINT,
  REQUEST_STATUS,
  ServiceResponse,
} from '../resources/endpoints';
import { LoginResponse } from '../response/login.response';
import { RefreshResponse } from '../response/refresh.response';
import { RegisterResponse } from '../response/register.response';

class AuthService {
  static async register(dto: RegisterDto): Promise<ServiceResponse> {
    try {
      const { data }: { data: RegisterResponse } = await axios.post(
        ENDPOINT.auth.register,
        dto,
      );
      return { status: REQUEST_STATUS.SUCCESS, data };
    } catch (error) {
      return { status: REQUEST_STATUS.ERROR, error };
    }
  }

  static async login(dto: LoginDto): Promise<ServiceResponse> {
    try {
      const { data }: { data: LoginResponse } = await axios.post(
        ENDPOINT.auth.login,
        dto,
      );
      return { status: REQUEST_STATUS.SUCCESS, data };
    } catch (error) {
      return { status: REQUEST_STATUS.ERROR, error };
    }
  }

  static async refresh(dto: RefreshDto): Promise<ServiceResponse> {
    try {
      const { data }: { data: RefreshResponse } = await axios.post(
        ENDPOINT.auth.refresh,
        dto,
      );
      return { status: REQUEST_STATUS.SUCCESS, data };
    } catch (error) {
      return { status: REQUEST_STATUS.ERROR, error };
    }
  }
}

export default AuthService;
