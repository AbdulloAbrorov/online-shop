import { AppRole } from '../../types';

export class RegisterDto {
  email!: string;
  password!: string;
  firstName!: string;
  lastName!: string;
  role: AppRole = AppRole.USER;
}
