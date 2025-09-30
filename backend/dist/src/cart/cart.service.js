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
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CartService = class CartService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getCart(identity) {
        const where = identity.userId
            ? { userId: identity.userId }
            : { guestId: identity.guestId };
        const items = await this.prisma.cartItem.findMany({
            where,
            include: { product: true },
            orderBy: { createdAt: 'asc' },
        });
        const total = items.reduce((s, i) => s + i.quantity * i.product.price, 0);
        return { items, total };
    }
    async addItem(identity, productId, quantity = 1) {
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        });
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        if (identity.userId) {
            const userId = identity.userId;
            const existing = await this.prisma.cartItem.findUnique({
                where: { userId_productId: { userId, productId } },
            });
            if (existing) {
                return this.prisma.cartItem.update({
                    where: { userId_productId: { userId, productId } },
                    data: { quantity: existing.quantity + quantity },
                    include: { product: true },
                });
            }
            return this.prisma.cartItem.create({
                data: { userId, productId, quantity },
                include: { product: true },
            });
        }
        else {
            const guestId = identity.guestId;
            const existing = await this.prisma.cartItem.findUnique({
                where: { guestId_productId: { guestId, productId } },
            });
            if (existing) {
                return this.prisma.cartItem.update({
                    where: { guestId_productId: { guestId, productId } },
                    data: { quantity: existing.quantity + quantity },
                    include: { product: true },
                });
            }
            return this.prisma.cartItem.create({
                data: { guestId, productId, quantity },
                include: { product: true },
            });
        }
    }
    async updateQuantity(identity, productId, quantity) {
        if (quantity <= 0) {
            return this.removeItem(identity, productId);
        }
        if (identity.userId) {
            const userId = identity.userId;
            return this.prisma.cartItem.update({
                where: { userId_productId: { userId, productId } },
                data: { quantity },
                include: { product: true },
            });
        }
        else {
            const guestId = identity.guestId;
            return this.prisma.cartItem.update({
                where: { guestId_productId: { guestId, productId } },
                data: { quantity },
                include: { product: true },
            });
        }
    }
    async removeItem(identity, productId) {
        if (identity.userId) {
            const userId = identity.userId;
            await this.prisma.cartItem.delete({
                where: { userId_productId: { userId, productId } },
            });
        }
        else {
            const guestId = identity.guestId;
            await this.prisma.cartItem.delete({
                where: { guestId_productId: { guestId, productId } },
            });
        }
        return { success: true };
    }
    async clearCart(identity) {
        if (identity.userId) {
            await this.prisma.cartItem.deleteMany({
                where: { userId: identity.userId },
            });
        }
        else {
            await this.prisma.cartItem.deleteMany({
                where: { guestId: identity.guestId },
            });
        }
        return { success: true };
    }
    async mergeGuestCart(guestId, userId) {
        if (!guestId)
            return { success: true };
        const guestItems = await this.prisma.cartItem.findMany({
            where: { guestId },
        });
        for (const gi of guestItems) {
            const existing = await this.prisma.cartItem.findUnique({
                where: { userId_productId: { userId, productId: gi.productId } },
            });
            if (existing) {
                await this.prisma.cartItem.update({
                    where: { userId_productId: { userId, productId: gi.productId } },
                    data: { quantity: existing.quantity + gi.quantity },
                });
            }
            else {
                await this.prisma.cartItem.create({
                    data: { userId, productId: gi.productId, quantity: gi.quantity },
                });
            }
        }
        await this.prisma.cartItem.deleteMany({ where: { guestId } });
        return { success: true };
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CartService);
//# sourceMappingURL=cart.service.js.map