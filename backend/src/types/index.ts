import { User, Role } from '@prisma/client';

export * from '@prisma/client';

export type UserWithoutPassword = Omit<User, 'password'> & {
  role: Role;
};

export enum AppRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export enum AppOrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}
