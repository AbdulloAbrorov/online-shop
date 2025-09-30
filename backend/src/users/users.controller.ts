import {
  Controller,
  Get,
  Param,
  Put,
  Delete,
  Body,
  UseGuards,
  Req,
  ForbiddenException,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AppRole } from '../types';
import type { Request } from 'express';

type UpdateUserDto = {
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: AppRole;
};

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req: Request) {
    return req.user!;
  }

  @Get()
  @Roles(AppRole.ADMIN)
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Roles(AppRole.ADMIN)
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Put('profile')
  async updateProfile(
    @Req() req: Request,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(req.user!.id, updateUserDto);
  }

  @Put(':id')
  @Roles(AppRole.ADMIN)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(AppRole.ADMIN)
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    if (req.user!.role !== AppRole.ADMIN && req.user!.id !== id) {
      throw new ForbiddenException('You can only delete your own account');
    }
    return this.usersService.remove(id);
  }
}
