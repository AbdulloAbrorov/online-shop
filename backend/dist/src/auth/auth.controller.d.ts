import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { AppRole } from '../types';
import type { Response } from 'express';
import { CartService } from '../cart/cart.service';
export declare class AuthController {
    private readonly authService;
    private readonly cartService;
    constructor(authService: AuthService, cartService: CartService);
    login(loginDto: LoginDto, req: {
        cookies?: Record<string, string>;
    }, res: Response): Promise<AuthResponseDto>;
    register(registerDto: RegisterDto, req: {
        cookies?: Record<string, string>;
    }, res: Response): Promise<AuthResponseDto>;
    logout(): {
        success: boolean;
    };
    refreshToken(body: {
        refreshToken: string;
    }): Promise<AuthResponseDto>;
    getProfile(req: {
        user: {
            id: number;
            email: string;
            role: AppRole;
        };
    }): {
        id: number;
        email: string;
        role: AppRole;
    };
}
