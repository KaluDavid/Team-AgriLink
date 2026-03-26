import api from "@/lib/axios";
import { Order, OrderStatus } from "@/types";

export interface CreateOrderPayload {
  listingId: string;
  quantity: number;
}

export const ordersService = {
  getAll: (): Promise<Order[]> => api.get("/orders").then((r) => r.data),

  getMyOrders: (): Promise<Order[]> =>
    api.get("/orders/my").then((r) => r.data),

  getFarmerOrders: (): Promise<Order[]> =>
    api.get("/orders/my").then((r) => r.data),

  getById: (id: string): Promise<Order> =>
    api.get(`/orders/${id}`).then((r) => r.data),

  create: (payload: CreateOrderPayload): Promise<Order> =>
    api.post("/orders", payload).then((r) => r.data),

  accept: (id: string): Promise<Order> =>
    api.post(`/orders/${id}/accept`).then((r) => r.data),

  reject: (id: string): Promise<Order> =>
    api.post(`/orders/${id}/reject`).then((r) => r.data),

  confirmDelivery: (id: string): Promise<Order> =>
    api.post(`/orders/${id}/deliver`).then((r) => r.data),

  cancel: (id: string): Promise<Order> =>
    api.post(`/orders/${id}/cancel`).then((r) => r.data),

  complete: (id: string): Promise<Order> =>
    api.post(`/orders/${id}/complete`).then((r) => r.data),

  updateStatus: (id: string, status: OrderStatus): Promise<Order> => {
    const endpointMap: Record<string, string> = {
      accepted: "accept",
      cancelled: "cancel",
      completed: "complete",
    };
    const endpoint = endpointMap[status];
    if (!endpoint)
      return Promise.reject(new Error(`No endpoint for status: ${status}`));
    return api.post(`/orders/${id}/${endpoint}`).then((r) => r.data);
  },
};
