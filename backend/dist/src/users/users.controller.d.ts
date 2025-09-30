import { UsersService } from './users.service';
import { AppRole } from '../types';
import type { Request } from 'express';
type UpdateUserDto = {
    name?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: AppRole;
};
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(req: Request): Express.User;
    findAll(): Promise<import("../types").UserWithoutPassword[]>;
    findOne(id: string): Promise<import("../types").UserWithoutPassword | null>;
    updateProfile(req: Request, updateUserDto: UpdateUserDto): Promise<import("../types").UserWithoutPassword>;
    update(id: number, updateUserDto: UpdateUserDto): Promise<import("../types").UserWithoutPassword>;
    remove(id: number, req: Request): Promise<{
        success: boolean;
    }>;
}
export {};
