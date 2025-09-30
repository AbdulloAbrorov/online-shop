import { PrismaService } from '../prisma/prisma.service';
export declare class ProductsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): import("@prisma/client").Prisma.PrismaPromise<{
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
    findOne(id: number): import("@prisma/client").Prisma.Prisma__ProductClient<{
        name: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        price: number;
        imageUrl: string;
        category: string;
        isActive: boolean;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    create(data: {
        name: string;
        description: string;
        price: number;
        imageUrl: string;
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
    update(id: number, data: Partial<{
        name: string;
        description: string;
        price: number;
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
