import type { Product } from '../products/type';

export interface CartItemDTO{
  id: number;
  userId: number | null; 
  guestId?: string | null; 
  productId: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  product: Product;
};