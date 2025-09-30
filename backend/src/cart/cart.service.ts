import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async getCart(identity: { userId?: number; guestId?: string }) {
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

  async addItem(
    identity: { userId?: number; guestId?: string },
    productId: number,
    quantity: number = 1,
  ) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) throw new NotFoundException('Product not found');

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
    } else {
      const guestId = identity.guestId as string;
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

  async updateQuantity(
    identity: { userId?: number; guestId?: string },
    productId: number,
    quantity: number,
  ) {
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
    } else {
      const guestId = identity.guestId as string;
      return this.prisma.cartItem.update({
        where: { guestId_productId: { guestId, productId } },
        data: { quantity },
        include: { product: true },
      });
    }
  }

  async removeItem(
    identity: { userId?: number; guestId?: string },
    productId: number,
  ) {
    if (identity.userId) {
      const userId = identity.userId;
      await this.prisma.cartItem.delete({
        where: { userId_productId: { userId, productId } },
      });
    } else {
      const guestId = identity.guestId as string;
      await this.prisma.cartItem.delete({
        where: { guestId_productId: { guestId, productId } },
      });
    }
    return { success: true };
  }

  async clearCart(identity: { userId?: number; guestId?: string }) {
    if (identity.userId) {
      await this.prisma.cartItem.deleteMany({
        where: { userId: identity.userId },
      });
    } else {
      await this.prisma.cartItem.deleteMany({
        where: { guestId: identity.guestId },
      });
    }
    return { success: true };
  }

  async mergeGuestCart(guestId: string, userId: number) {
    if (!guestId) return { success: true };
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
      } else {
        await this.prisma.cartItem.create({
          data: { userId, productId: gi.productId, quantity: gi.quantity },
        });
      }
    }
    await this.prisma.cartItem.deleteMany({ where: { guestId } });
    return { success: true };
  }
}
