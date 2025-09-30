// src/users/users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserWithoutPassword, AppRole } from '../types';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) return null;
    const { password: _password, ...result } = user;
    void _password;
    return {
      ...result,
      role: result.role as AppRole,
    } as UserWithoutPassword;
  }

  async findAll() {
    const users = await this.prisma.user.findMany();
    return users.map(({ password: _password, ...user }) => {
      void _password;
      return {
        ...user,
        role: user.role as AppRole,
      };
    }) as UserWithoutPassword[];
  }

  async update(id: number, updateUserDto: Prisma.UserUpdateInput) {
    try {
      const result = await this.prisma.user.update({
        where: { id },
        data: updateUserDto,
      });

      const { password: _password, ...user } = result;
      void _password;
      return {
        ...user,
        role: user.role as AppRole,
      } as UserWithoutPassword;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`User with ID ${id} not found`);
        }
      }
      throw error;
    }
  }

  async remove(id: number) {
    try {
      await this.prisma.$transaction(async (tx) => {
        await tx.cartItem.deleteMany({ where: { userId: id } });

        await tx.orderItem.deleteMany({ where: { order: { userId: id } } });

        await tx.order.deleteMany({ where: { userId: id } });

        await tx.user.delete({ where: { id } });
      });
      return { success: true };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`User with ID ${id} not found`);
        }
        if (error.code === 'P2003') {
          throw new Error(
            'Cannot delete user due to related records. Please remove related data and try again.',
          );
        }
      }
      throw error;
    }
  }
}
