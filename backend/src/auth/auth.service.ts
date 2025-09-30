import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { AppRole, UserWithoutPassword } from '../types';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserWithoutPassword | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password: _password, ...result } = user;
      void _password;
      return { ...result, role: result.role as AppRole } as UserWithoutPassword;
    }
    return null;
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateTokens(user);
  }

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ForbiddenException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: registerDto.email,
        password: hashedPassword,
        name: `${registerDto.firstName} ${registerDto.lastName}`,
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
        role: AppRole.USER,
      },
    });

    const { password: _password, ...result } = user;
    void _password;
    return this.generateTokens({
      ...result,
      role: result.role as AppRole,
    } as UserWithoutPassword);
  }

  private generateTokens(user: UserWithoutPassword): AuthResponseDto {
    const payload: { email: string; sub: number; role: AppRole } = {
      email: user.email,
      sub: user.id,
      role: user.role as AppRole,
    };

    const refreshExpiresIn =
      this.config.get<string>('JWT_REFRESH_EXPIRES_IN') || '7d';

    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, {
        expiresIn: refreshExpiresIn,
      }),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    } as AuthResponseDto;
  }

  validateToken(
    token: string,
  ): { sub: number; email?: string; role?: AppRole } | null {
    try {
      return this.jwtService.verify<{
        sub: number;
        email?: string;
        role?: AppRole;
      }>(token);
    } catch {
      return null;
    }
  }

  async refreshToken(refreshToken: string): Promise<AuthResponseDto> {
    try {
      const decoded = this.jwtService.verify<{ sub: number }>(refreshToken);
      const user = await this.prisma.user.findUnique({
        where: { id: decoded.sub },
      });
      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      const { password: _password, ...result } = user;
      void _password;
      return this.generateTokens({
        ...result,
        role: result.role as AppRole,
      } as UserWithoutPassword);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
