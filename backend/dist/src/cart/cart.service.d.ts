import { PrismaService } from '../prisma/prisma.service';
export declare class CartService {
    private prisma;
    constructor(prisma: PrismaService);
    getCart(identity: {
        userId?: number;
        guestId?: string;
    }): Promise<{
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
            createdAt: Date;
            updatedAt: Date;
            guestId: string | null;
            userId: number | null;
            productId: number;
            quantity: number;
        })[];
        total: number;
    }>;
    addItem(identity: {
        userId?: number;
        guestId?: string;
    }, productId: number, quantity?: number): Promise<{
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
        createdAt: Date;
        updatedAt: Date;
        guestId: string | null;
        userId: number | null;
        productId: number;
        quantity: number;
    }>;
    updateQuantity(identity: {
        userId?: number;
        guestId?: string;
    }, productId: number, quantity: number): Promise<{
        success: boolean;
    } | ({
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
        createdAt: Date;
        updatedAt: Date;
        guestId: string | null;
        userId: number | null;
        productId: number;
        quantity: number;
    })>;
    removeItem(identity: {
        userId?: number;
        guestId?: string;
    }, productId: number): Promise<{
        success: boolean;
    }>;
    clearCart(identity: {
        userId?: number;
        guestId?: string;
    }): Promise<{
        success: boolean;
    }>;
    mergeGuestCart(guestId: string, userId: number): Promise<{
        success: boolean;
    }>;
}
