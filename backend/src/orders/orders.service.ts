import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async listAll() {
    return this.prisma.order.findMany({
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async list(userId: number) {
    return this.prisma.order.findMany({
      where: { userId },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createFromCart(
    userId: number,
    _body: {
      shipping: {
        fullName: string;
        address: string;
        city: string;
        postalCode: string;
        country: string;
      };
      payment: { method: string };
    },
  ) {
    void _body;
    const cartItems = await this.prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
    });
    if (cartItems.length === 0) throw new BadRequestException('Cart is empty');

    const total = cartItems.reduce(
      (s, i) => s + i.quantity * i.product.price,
      0,
    );

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
}
