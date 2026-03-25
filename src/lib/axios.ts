// import axios from "axios";

// const api = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// api.interceptors.request.use((config) => {
//   const token =
//     typeof window !== "undefined" ? localStorage.getItem("token") : null;
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       if (typeof window !== "undefined") {
//         localStorage.removeItem("token");
//         window.location.href = "/auth/login";
//       }
//     }
//     return Promise.reject(error);
//   },
// );

// export default api;

import axios from "axios";

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1",
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  if (typeof window === "undefined") return config;
  try {
    const raw = localStorage.getItem("auth-storage");
    if (raw) {
      const parsed = JSON.parse(raw);
      const token = parsed?.state?.token;
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {}
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("auth-storage");
      document.cookie = "auth-storage=;path=/;max-age=0";
      window.location.href = "/auth/login";
    }
    return Promise.reject(err);
  },
);

export default api;
