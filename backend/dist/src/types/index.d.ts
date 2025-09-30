import { User, Role } from '@prisma/client';
export * from '@prisma/client';
export type UserWithoutPassword = Omit<User, 'password'> & {
    role: Role;
};
export declare enum AppRole {
    USER = "USER",
    ADMIN = "ADMIN"
}
export declare enum AppOrderStatus {
    PENDING = "PENDING",
    PROCESSING = "PROCESSING",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED"
}
