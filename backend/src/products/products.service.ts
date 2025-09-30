import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.product.findMany({
      where: { isActive: true },
    });
  }

  findOne(id: number) {
    return this.prisma.product.findFirst({
      where: { id, isActive: true },
    });
  }

  async create(data: {
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    category: string;
  }) {
    return this.prisma.product.create({ data });
  }

  async update(
    id: number,
    data: Partial<{
      name: string;
      description: string;
      price: number;
      imageUrl: string;
      category: string;
    }>,
  ) {
    const product = await this.prisma.product.update({ where: { id }, data });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async remove(id: number) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (!product.isActive) {
      throw new BadRequestException('Product is already deleted');
    }

    await this.prisma.product.update({
      where: { id },
      data: { isActive: false },
    });

    await this.prisma.cartItem.deleteMany({
      where: { productId: id },
    });

    return { success: true };
  }
}
