import { PrismaService } from '../prisma/prisma.service';
import { UserWithoutPassword } from '../types';
import { Prisma } from '@prisma/client';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findOne(id: number): Promise<UserWithoutPassword | null>;
    findAll(): Promise<UserWithoutPassword[]>;
    update(id: number, updateUserDto: Prisma.UserUpdateInput): Promise<UserWithoutPassword>;
    remove(id: number): Promise<{
        success: boolean;
    }>;
}
