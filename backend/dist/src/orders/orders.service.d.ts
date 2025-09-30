import { PrismaService } from '../prisma/prisma.service';
export declare class OrdersService {
    private prisma;
    constructor(prisma: PrismaService);
    listAll(): Promise<({
        items: ({
            product: {
                name: string;
                id: number;
                createdAt: Date;
                updatedAt: Date;
                description: string;
                price: number;
                imageUrl: string;
                category: string;
                isActive: boolean;
            };
        } & {
            id: number;
            productId: number;
            quantity: number;
            price: number;
            orderId: number;
        })[];
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        total: number;
        status: import("@prisma/client").$Enums.OrderStatus;
    })[]>;
    list(userId: number): Promise<({
        items: ({
            product: {
                name: string;
                id: number;
                createdAt: Date;
                updatedAt: Date;
                description: string;
                price: number;
                imageUrl: string;
                category: string;
                isActive: boolean;
            };
        } & {
            id: number;
            productId: number;
            quantity: number;
            price: number;
            orderId: number;
        })[];
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        total: number;
        status: import("@prisma/client").$Enums.OrderStatus;
    })[]>;
    createFromCart(userId: number, _body: {
        shipping: {
            fullName: string;
            address: string;
            city: string;
            postalCode: string;
            country: string;
        };
        payment: {
            method: string;
        };
    }): Promise<({
        items: ({
            product: {
                name: string;
                id: number;
                createdAt: Date;
                updatedAt: Date;
                description: string;
                price: number;
                imageUrl: string;
                category: string;
                isActive: boolean;
            };
        } & {
            id: number;
            productId: number;
            quantity: number;
            price: number;
            orderId: number;
        })[];
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        total: number;
        status: import("@prisma/client").$Enums.OrderStatus;
    }) | null>;
}
