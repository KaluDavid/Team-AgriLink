import api from "@/lib/axios";
import { Order, OrderStatus } from "@/types";

export interface CreateOrderPayload {
  listingId: string;
  quantity: number;
}

export const ordersService = {
  getAll: () => api.get<Order[]>("/orders").then((r) => r.data),

  getMyOrders: () => api.get<Order[]>("/orders/my").then((r) => r.data),

  getFarmerOrders: () => api.get<Order[]>("/orders/farmer").then((r) => r.data),

  getById: (id: string) => api.get<Order>(`/orders/${id}`).then((r) => r.data),

  create: (payload: CreateOrderPayload) =>
    api.post<Order>("/orders", payload).then((r) => r.data),

  updateStatus: (id: string, status: OrderStatus) =>
    api.patch<Order>(`/orders/${id}/status`, { status }).then((r) => r.data),

  confirmDelivery: (id: string) =>
    api.post<Order>(`/orders/${id}/confirm`).then((r) => r.data),
};
