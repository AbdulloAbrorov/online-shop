import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import type { Request, Response } from 'express';
import { randomUUID } from 'crypto';

@UseGuards(OptionalJwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const userId = req.user?.id;
    let guestId = req.cookies?.guestId as string | undefined;
    if (!userId && !guestId) {
      guestId = randomUUID();
      res.cookie('guestId', guestId, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
      });
    }
    const identity = userId ? { userId } : { guestId: guestId as string };
    return this.cartService.getCart(identity);
  }

  @Post()
  async addItem(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body() body: { productId: number; quantity?: number },
  ) {
    const userId = req.user?.id;
    let guestId = req.cookies?.guestId as string | undefined;
    if (!userId && !guestId) {
      guestId = randomUUID();
      res.cookie('guestId', guestId, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24 * 30,
      });
    }
    const identity = userId ? { userId } : { guestId: guestId as string };
    return this.cartService.addItem(
      identity,
      body.productId,
      body.quantity ?? 1,
    );
  }

  @Patch(':productId')
  async updateQuantity(
    @Req() req: Request,
    @Param('productId', ParseIntPipe) productId: number,
    @Body() body: { quantity: number },
  ) {
    const userId = req.user?.id;
    const guestId = req.cookies?.guestId as string | undefined;
    const identity = userId ? { userId } : { guestId: guestId as string };
    return this.cartService.updateQuantity(identity, productId, body.quantity);
  }

  @Delete(':productId')
  async removeItem(
    @Req() req: Request,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    const userId = req.user?.id;
    const guestId = req.cookies?.guestId as string | undefined;
    const identity = userId ? { userId } : { guestId: guestId as string };
    return this.cartService.removeItem(identity, productId);
  }

  @Post('clear')
  async clearCart(@Req() req: Request) {
    const userId = req.user?.id;
    const guestId = req.cookies?.guestId as string | undefined;
    const identity = userId ? { userId } : { guestId: guestId as string };
    return this.cartService.clearCart(identity);
  }
}
