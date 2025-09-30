import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { AppRole, UserWithoutPassword } from '../types';
import { ConfigService } from '@nestjs/config';
export declare class AuthService {
    private prisma;
    private jwtService;
    private config;
    constructor(prisma: PrismaService, jwtService: JwtService, config: ConfigService);
    validateUser(email: string, password: string): Promise<UserWithoutPassword | null>;
    login(loginDto: LoginDto): Promise<AuthResponseDto>;
    register(registerDto: RegisterDto): Promise<AuthResponseDto>;
    private generateTokens;
    validateToken(token: string): {
        sub: number;
        email?: string;
        role?: AppRole;
    } | null;
    refreshToken(refreshToken: string): Promise<AuthResponseDto>;
}
