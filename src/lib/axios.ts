import axios, { AxiosResponse } from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api",
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// ── Request: attach token ──
api.interceptors.request.use((config) => {
  if (typeof window === "undefined") return config;
  try {
    const raw = localStorage.getItem("auth-storage");
    if (raw) {
      const token = JSON.parse(raw)?.state?.token;
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {}
  return config;
});

// ── Response: unwrap { success, message, data } ──
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // If the BE wraps in { success, data }, unwrap it
    if (
      response.data &&
      typeof response.data === "object" &&
      "data" in response.data
    ) {
      response.data = response.data.data;
    }
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const message =
      error.response?.data?.error ??
      error.response?.data?.message ??
      "Something went wrong";

    if (status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("auth-storage");
      document.cookie = "auth-storage=;path=/;max-age=0";
      window.location.href = "/auth/login";
    }

    // Re-throw with clean message
    return Promise.reject(new Error(message));
  },
);

export default api;
