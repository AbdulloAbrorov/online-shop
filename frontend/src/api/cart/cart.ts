import api from '../../config/api';
import type { CartResponse } from './type-cart-respons';
import type { CartItemDTO } from './type-cart-item';




export const cartApi = {
  async get(): Promise<CartResponse> {
    const res = await api.get<CartResponse>('/cart');
    return res.data;
  },
  async add(productId: number, quantity: number = 1): Promise<CartItemDTO> {
    const res = await api.post<CartItemDTO>('/cart', { productId, quantity });
    return res.data;
  },
  async update(productId: number, quantity: number): Promise<CartItemDTO> {
    const res = await api.patch<CartItemDTO>(`/cart/${productId}`, { quantity });
    return res.data;
  },
  async remove(productId: number): Promise<{ success: boolean }> {
    const res = await api.delete<{ success: boolean }>(`/cart/${productId}`);
    return res.data;
  },
  async clear(): Promise<{ success: boolean }> {
    const res = await api.post<{ success: boolean }>(`/cart/clear`);
    return res.data;
  },
};
