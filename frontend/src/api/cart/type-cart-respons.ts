import type { CartItemDTO } from './type-cart-item';

export interface CartResponse{
  items: CartItemDTO[];
  total: number;
};