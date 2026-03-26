import api from "@/lib/axios";
import { User, UserRole } from "@/types";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  location: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const authService = {
  login: (payload: LoginPayload): Promise<AuthResponse> =>
    api.post("/auth/login", payload).then((r) => r.data),

  register: (payload: RegisterPayload): Promise<AuthResponse> =>
    api.post("/auth/register", payload).then((r) => r.data),

  me: (): Promise<User> => api.get("/auth/me").then((r) => r.data),

  updateProfile: (
    payload: Partial<Pick<User, "name" | "location">>,
  ): Promise<User> => api.put("/auth/me", payload).then((r) => r.data),

  logout: (): Promise<void> => api.post("/auth/logout").then(() => undefined),

  changePassword: (payload: {
    current_password: string;
    new_password: string;
  }): Promise<void> =>
    api.post("/auth/password", payload).then(() => undefined),
};
