import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AppRole } from '../types';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import type { Express } from 'express';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AppRole.ADMIN)
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (
          _req: any,
          file: Express.Multer.File,
          cb: (error: any, filename: string) => void,
        ) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body()
    body: {
      name: string;
      description: string;
      price: number | string;
      imageUrl?: string;
      category: string;
    },
  ) {
    const imageUrl = file ? `/uploads/${file.filename}` : body.imageUrl || '';
    const price = Number(body.price);
    if (Number.isNaN(price)) {
      throw new BadRequestException('Price must be a number');
    }
    return this.productsService.create({ ...body, price, imageUrl });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AppRole.ADMIN)
  @Put(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (
          _req: any,
          file: Express.Multer.File,
          cb: (error: any, filename: string) => void,
        ) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  update(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body()
    body: Partial<{
      name: string;
      description: string;
      price: number | string;
      imageUrl: string;
      category: string;
    }>,
  ) {
    type ProductPatch = Partial<{
      name: string;
      description: string;
      price: number;
      imageUrl: string;
      category: string;
    }>;
    const { price: bodyPrice, ...rest } = body;
    const patch: ProductPatch = { ...rest };
    if (file) {
      patch.imageUrl = `/uploads/${file.filename}`;
    }
    if (bodyPrice !== undefined) {
      const price = Number(bodyPrice);
      if (Number.isNaN(price)) {
        throw new BadRequestException('Price must be a number');
      }
      patch.price = price;
    }
    return this.productsService.update(id, patch);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AppRole.ADMIN)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }
}
