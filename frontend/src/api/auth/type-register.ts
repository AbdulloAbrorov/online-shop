import type { LoginData } from './type-login';

export interface RegisterData extends Omit<LoginData, 'rememberMe'> {
  firstName: string;
  lastName: string;
}
