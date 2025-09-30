import { OrdersService } from './orders.service';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    list(req: {
        user: {
            id: number;
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
        status: import(".prisma/client/client").$Enums.OrderStatus;
    })[]>;
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
        status: import(".prisma/client/client").$Enums.OrderStatus;
    })[]>;
    createFromCart(req: {
        user: {
            id: number;
        };
    }, body: {
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
        status: import(".prisma/client/client").$Enums.OrderStatus;
    }) | null>;
}
