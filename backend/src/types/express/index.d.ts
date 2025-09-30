import { AppRole } from '..';

declare global {
  namespace Express {
    interface User {
      id: number;
      email: string;
      role: AppRole;
    }
    interface Request {
      user?: User;
    }
  }
}
