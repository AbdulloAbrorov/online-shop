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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let OrdersService = class OrdersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async listAll() {
        return this.prisma.order.findMany({
            include: { items: { include: { product: true } } },
            orderBy: { createdAt: 'desc' },
        });
    }
    async list(userId) {
        return this.prisma.order.findMany({
            where: { userId },
            include: { items: { include: { product: true } } },
            orderBy: { createdAt: 'desc' },
        });
    }
    async createFromCart(userId, _body) {
        void _body;
        const cartItems = await this.prisma.cartItem.findMany({
            where: { userId },
            include: { product: true },
        });
        if (cartItems.length === 0)
            throw new common_1.BadRequestException('Cart is empty');
        const total = cartItems.reduce((s, i) => s + i.quantity * i.product.price, 0);
        const order = await this.prisma.$transaction(async (tx) => {
            const created = await tx.order.create({
                data: {
                    userId,
                    total,
                },
            });
            await tx.orderItem.createMany({
                data: cartItems.map((ci) => ({
                    orderId: created.id,
                    productId: ci.productId,
                    quantity: ci.quantity,
                    price: ci.product.price,
                })),
            });
            await tx.cartItem.deleteMany({ where: { userId } });
            return created;
        });
        return this.prisma.order.findUnique({
            where: { id: order.id },
            include: { items: { include: { product: true } } },
        });
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map