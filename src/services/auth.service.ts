import api from "@/lib/axios";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: "farmer" | "buyer";
  location: string;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: "farmer" | "buyer" | "admin";
    location: string;
    createdAt: string;
  };
  token: string;
}

export const authService = {
  login: (payload: LoginPayload) =>
    api.post<AuthResponse>("/auth/login", payload).then((r) => r.data),

  register: (payload: RegisterPayload) =>
    api.post<AuthResponse>("/auth/register", payload).then((r) => r.data),

  logout: () => api.post("/auth/logout").then((r) => r.data),

  me: () => api.get<AuthResponse["user"]>("/auth/me").then((r) => r.data),
};
