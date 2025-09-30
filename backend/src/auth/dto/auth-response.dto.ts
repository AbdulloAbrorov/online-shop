import { AppRole } from '../../types';

export class AuthResponseDto {
  access_token!: string;
  refresh_token?: string;
  user!: {
    id: number;
    email: string;
    name: string;
    role: AppRole;
  };
}
