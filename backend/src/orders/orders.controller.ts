import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AppRole } from '../types';

@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async list(
    @Req()
    req: {
      user: { id: number };
    },
  ) {
    const userId = req.user.id;
    return this.ordersService.list(userId);
  }

  @Get('all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AppRole.ADMIN)
  async listAll() {
    return this.ordersService.listAll();
  }

  @Post()
  async createFromCart(
    @Req()
    req: {
      user: { id: number };
    },
    @Body()
    body: {
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
    const userId = req.user.id;
    return this.ordersService.createFromCart(userId, body);
  }
}
