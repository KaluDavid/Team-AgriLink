import { useMutation, useQuery } from "@tanstack/react-query";
import {
  authService,
  LoginPayload,
  RegisterPayload,
} from "@/services/auth.service";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { toast } from "sonner";

export function useLoginMutation() {
  const router = useRouter();
  const { login } = useAuthStore();

  return useMutation({
    mutationFn: (payload: LoginPayload) =>
      // swap authService.login(payload) here once API is ready
      login(payload.email, payload.password),
    onSuccess: () => {
      toast.success("Welcome back!");
      router.push(ROUTES.HOME);
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "An error occurred";
      toast.error("Login failed", { description: message });
    },
  });
}

export function useRegisterMutation() {
  const { signup } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: RegisterPayload) =>
      signup(
        payload.name,
        payload.email,
        payload.password,
        payload.role,
        payload.location,
      ),
    onSuccess: () => {
      toast.success("Account created!");
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "An error occurred";
      toast.error("Registration failed", { description: message });
    },
  });
}
