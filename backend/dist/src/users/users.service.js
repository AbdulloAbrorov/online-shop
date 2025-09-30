"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findOne(id) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user)
            return null;
        const { password: _password, ...result } = user;
        void _password;
        return {
            ...result,
            role: result.role,
        };
    }
    async findAll() {
        const users = await this.prisma.user.findMany();
        return users.map(({ password: _password, ...user }) => {
            void _password;
            return {
                ...user,
                role: user.role,
            };
        });
    }
    async update(id, updateUserDto) {
        try {
            const result = await this.prisma.user.update({
                where: { id },
                data: updateUserDto,
            });
            const { password: _password, ...user } = result;
            void _password;
            return {
                ...user,
                role: user.role,
            };
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new common_1.NotFoundException(`User with ID ${id} not found`);
                }
            }
            throw error;
        }
    }
    async remove(id) {
        try {
            await this.prisma.$transaction(async (tx) => {
                await tx.cartItem.deleteMany({ where: { userId: id } });
                await tx.orderItem.deleteMany({ where: { order: { userId: id } } });
                await tx.order.deleteMany({ where: { userId: id } });
                await tx.user.delete({ where: { id } });
            });
            return { success: true };
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new common_1.NotFoundException(`User with ID ${id} not found`);
                }
                if (error.code === 'P2003') {
                    throw new Error('Cannot delete user due to related records. Please remove related data and try again.');
                }
            }
            throw error;
        }
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map