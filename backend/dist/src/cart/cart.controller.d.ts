import { CartService } from './cart.service';
import type { Request, Response } from 'express';
export declare class CartController {
    private readonly cartService;
    constructor(cartService: CartService);
    getCart(req: Request, res: Response): Promise<{
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
    addItem(req: Request, res: Response, body: {
        productId: number;
        quantity?: number;
    }): Promise<{
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
    updateQuantity(req: Request, productId: number, body: {
        quantity: number;
    }): Promise<{
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
    removeItem(req: Request, productId: number): Promise<{
        success: boolean;
    }>;
    clearCart(req: Request): Promise<{
        success: boolean;
    }>;
}
