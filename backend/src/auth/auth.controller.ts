// src/auth/auth.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AppRole } from '../types';
import type { Response } from 'express';
import { CartService } from '../cart/cart.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cartService: CartService,
  ) {}

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Request() req: { cookies?: Record<string, string> },
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseDto> {
    const auth = await this.authService.login(loginDto);
    const guestId: string | undefined = req.cookies?.guestId;
    if (guestId) {
      await this.cartService.mergeGuestCart(guestId, auth.user.id);
      res.clearCookie('guestId');
    }
    return auth;
  }

  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
    @Request() req: { cookies?: Record<string, string> },
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseDto> {
    const auth = await this.authService.register(registerDto);
    const guestId: string | undefined = req.cookies?.guestId;
    if (guestId) {
      await this.cartService.mergeGuestCart(guestId, auth.user.id);
      res.clearCookie('guestId');
    }
    return auth;
  }

  @Post('logout')
  logout() {
    return { success: true };
  }

  @Post('refresh-token')
  async refreshToken(
    @Body() body: { refreshToken: string },
  ): Promise<AuthResponseDto> {
    return this.authService.refreshToken(body.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(
    @Request() req: { user: { id: number; email: string; role: AppRole } },
  ) {
    return req.user;
  }
}
