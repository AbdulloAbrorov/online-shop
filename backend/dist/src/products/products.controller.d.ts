import { ProductsService } from './products.service';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    findAll(): import(".prisma/client/client").Prisma.PrismaPromise<{
        name: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        price: number;
        imageUrl: string;
        category: string;
        isActive: boolean;
    }[]>;
    findOne(id: number): import(".prisma/client/client").Prisma.Prisma__ProductClient<{
        name: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        price: number;
        imageUrl: string;
        category: string;
        isActive: boolean;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client/client").Prisma.PrismaClientOptions>;
    create(file: Express.Multer.File, body: {
        name: string;
        description: string;
        price: number | string;
        imageUrl?: string;
        category: string;
    }): Promise<{
        name: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        price: number;
        imageUrl: string;
        category: string;
        isActive: boolean;
    }>;
    update(id: number, file: Express.Multer.File, body: Partial<{
        name: string;
        description: string;
        price: number | string;
        imageUrl: string;
        category: string;
    }>): Promise<{
        name: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        price: number;
        imageUrl: string;
        category: string;
        isActive: boolean;
    }>;
    remove(id: number): Promise<{
        success: boolean;
    }>;
}
