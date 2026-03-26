"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, UserRole } from "@/types";
import { authService } from "@/services/auth.service";

function setCookie(value: string) {
  if (typeof document === "undefined") return;
  document.cookie = `auth-storage=${encodeURIComponent(value)};path=/;max-age=${60 * 60 * 24 * 7};SameSite=Lax`;
}

function clearCookie() {
  if (typeof document === "undefined") return;
  document.cookie = "auth-storage=;path=/;max-age=0";
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    name: string,
    email: string,
    password: string,
    role: UserRole,
    location: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (user, token) => {
        const state = { user, token, isAuthenticated: true };
        set(state);
        setCookie(JSON.stringify({ state }));
      },

      login: async (email, password) => {
        const data = await authService.login({ email, password });
        get().setAuth(data.user, data.token);
      },

      signup: async (name, email, password, role, location) => {
        const data = await authService.register({
          name,
          email,
          password,
          role,
          location,
        });
        get().setAuth(data.user, data.token);
      },

      logout: async () => {
        try {
          await authService.logout();
        } catch {
          // logout silently even if API fails
        }
        set({ user: null, token: null, isAuthenticated: false });
        clearCookie();
      },

      refreshUser: async () => {
        try {
          const user = await authService.me();
          set({ user });
          const current = get();
          setCookie(
            JSON.stringify({
              state: { user, token: current.token, isAuthenticated: true },
            }),
          );
        } catch {
          // token expired — clear everything
          set({ user: null, token: null, isAuthenticated: false });
          clearCookie();
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (s) => ({
        user: s.user,
        token: s.token,
        isAuthenticated: s.isAuthenticated,
      }),
    },
  ),
);

// "use client";

// import { create } from "zustand";
// import { persist } from "zustand/middleware";
// import { User, UserRole } from "@/types";
// // import { authService } from '@/services/auth.service'; // ← UNCOMMENT when API ready

// const mockUsers: Record<string, User & { password: string }> = {
//   "farmer@demo.com": {
//     id: "farmer-1",
//     name: "John Farmer",
//     email: "farmer@demo.com",
//     role: "farmer",
//     location: "Lagos, Nigeria",
//     password: "password",
//     createdAt: new Date("2024-01-15"),
//   },
//   "buyer@demo.com": {
//     id: "buyer-1",
//     name: "Sarah Buyer",
//     email: "buyer@demo.com",
//     role: "buyer",
//     location: "Abuja, Nigeria",
//     password: "password",
//     createdAt: new Date("2024-02-10"),
//   },
//   "admin@demo.com": {
//     id: "admin-1",
//     name: "Admin User",
//     email: "admin@demo.com",
//     role: "admin",
//     location: "Lagos, Nigeria",
//     password: "password",
//     createdAt: new Date("2024-01-01"),
//   },
// };

// function setCookie(value: string) {
//   if (typeof document === "undefined") return;
//   document.cookie = `auth-storage=${encodeURIComponent(value)};path=/;max-age=${60 * 60 * 24 * 7};SameSite=Lax`;
// }

// function clearCookie() {
//   if (typeof document === "undefined") return;
//   document.cookie = "auth-storage=;path=/;max-age=0";
// }

// interface AuthState {
//   user: User | null;
//   token: string | null;
//   isAuthenticated: boolean;
//   login: (email: string, password: string) => Promise<void>;
//   signup: (
//     name: string,
//     email: string,
//     password: string,
//     role: UserRole,
//     location: string,
//   ) => Promise<void>;
//   logout: () => void;
//   setAuth: (user: User, token: string) => void;
// }

// export const useAuthStore = create<AuthState>()(
//   persist(
//     (set) => ({
//       user: null,
//       token: null,
//       isAuthenticated: false,

//       setAuth: (user, token) => {
//         const state = { user, token, isAuthenticated: true };
//         set(state);
//         setCookie(JSON.stringify({ state }));
//       },

//       // ─────────────────────────────────────────────────────
//       // MOCK IMPLEMENTATION — swap body for API call when ready
//       // Replace with:
//       //   const data = await authService.login({ email, password });
//       //   get().setAuth(data.user, data.token);
//       // ─────────────────────────────────────────────────────
//       login: async (email, password) => {
//         await new Promise((r) => setTimeout(r, 500));
//         const found = mockUsers[email.toLowerCase()];
//         if (!found || found.password !== password) {
//           throw new Error("Invalid email or password");
//         }
//         const { password: _, ...user } = found;
//         const token = `mock-token-${user.id}`;
//         const state = { user, token, isAuthenticated: true };
//         set(state);
//         setCookie(JSON.stringify({ state }));
//       },

//       // Replace with:
//       //   const data = await authService.register({ name, email, password, role, location });
//       //   get().setAuth(data.user, data.token);
//       signup: async (name, email, password, role, location) => {
//         await new Promise((r) => setTimeout(r, 500));
//         if (mockUsers[email.toLowerCase()])
//           throw new Error("Email already exists");
//         const newUser: User = {
//           id: `user-${Date.now()}`,
//           name,
//           email: email.toLowerCase(),
//           role,
//           location,
//           createdAt: new Date(),
//         };
//         mockUsers[email.toLowerCase()] = { ...newUser, password };
//         const token = `mock-token-${newUser.id}`;
//         const state = { user: newUser, token, isAuthenticated: true };
//         set(state);
//         setCookie(JSON.stringify({ state }));
//       },

//       logout: () => {
//         set({ user: null, token: null, isAuthenticated: false });
//         clearCookie();
//       },
//     }),
//     {
//       name: "auth-storage",
//       partialize: (s) => ({
//         user: s.user,
//         token: s.token,
//         isAuthenticated: s.isAuthenticated,
//       }),
//     },
//   ),
// );
