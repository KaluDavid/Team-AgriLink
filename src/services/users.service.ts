import api from "@/lib/axios";
import { User } from "@/types";

export const usersService = {
  getAll: (): Promise<User[]> => api.get("/admin/users").then((r) => r.data),

  getById: (id: string): Promise<User> =>
    api.get(`/admin/users/${id}`).then((r) => r.data),

  suspend: (id: string): Promise<void> =>
    api.post(`/admin/users/${id}/suspend`).then(() => undefined),

  activate: (id: string): Promise<void> =>
    api.post(`/admin/users/${id}/activate`).then(() => undefined),

  verify: (id: string): Promise<void> =>
    api.post(`/admin/users/${id}/verify`).then(() => undefined),

  updateProfile: (
    payload: Partial<Pick<User, "name" | "location">>,
  ): Promise<User> => api.put("/auth/me", payload).then((r) => r.data),

  search: (query: string): Promise<User[]> =>
    api.get("/users", { params: { q: query } }).then((r) => r.data),
};
