import api from "../../config/api";
import type { Order } from "./order-type";
import type { CreateOrderPayload } from "./info-type";

export const ordersApi = {
  async list(): Promise<Order[]> {
    const res = await api.get<Order[]>("/orders");
    return res.data;
  },

  async listAll(): Promise<Order[]> {
    const res = await api.get<Order[]>("/orders/all");
    return res.data;
  },

  async createFromCart(payload: CreateOrderPayload): Promise<Order> {
    const res = await api.post<Order>("/orders", payload);
    return res.data;
  },
};