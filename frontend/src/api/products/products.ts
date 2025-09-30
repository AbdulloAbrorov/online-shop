import api from '../../config/api';
import type { Product } from './type';

export const productsApi = {
  async list(params?: { name?: string; category?: string; minPrice?: number; maxPrice?: number }): Promise<Product[]> {
    const res = await api.get<Product[]>('/products', { params });
    return res.data;
  },
  async get(id: number): Promise<Product> {
    const res = await api.get<Product>(`/products/${id}`);
    return res.data;
  },
  async create(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'> | FormData): Promise<Product> {
    if (typeof FormData !== 'undefined' && data instanceof FormData) {
      const res = await api.post<Product>('/products', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    }
    const res = await api.post<Product>('/products', data);
    return res.data;
  },
  async update(id: number, data: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>> | FormData): Promise<Product> {
    if (typeof FormData !== 'undefined' && data instanceof FormData) {
      const res = await api.put<Product>(`/products/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    }
    const res = await api.put<Product>(`/products/${id}`, data);
    return res.data;
  },
  async remove(id: number): Promise<{ success: boolean }> {
    const res = await api.delete<{ success: boolean }>(`/products/${id}`);
    return res.data;
  },
};
