"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { ROUTES } from "@/constants/routes";

export function useAuth() {
  const router = useRouter();
  const store = useAuthStore();

  const getDashboardPath = () => {
    if (!store.user) return ROUTES.HOME;
    switch (store.user.role) {
      case "farmer":
        return ROUTES.FARMER.DASHBOARD;
      case "buyer":
        return ROUTES.BUYER.MARKETPLACE;
      case "admin":
        return ROUTES.ADMIN.DASHBOARD;
      default:
        return ROUTES.HOME;
    }
  };

  const logout = () => {
    store.logout();
    router.push(ROUTES.HOME);
  };

  return {
    user: store.user,
    token: store.token,
    isAuthenticated: store.isAuthenticated,
    login: store.login,
    signup: store.signup,
    logout,
    getDashboardPath,
  };
}
