import api from "@/lib/axios";
import { User } from "@/types";

export const usersService = {
  getAll: () => api.get<User[]>("/users").then((r) => r.data),

  getById: (id: string) => api.get<User>(`/users/${id}`).then((r) => r.data),

  updateProfile: (payload: Partial<Pick<User, "name" | "location">>) =>
    api.patch<User>("/users/me", payload).then((r) => r.data),

  suspend: (id: string) =>
    api.patch(`/users/${id}/suspend`).then((r) => r.data),

  unsuspend: (id: string) =>
    api.patch(`/users/${id}/unsuspend`).then((r) => r.data),
};
