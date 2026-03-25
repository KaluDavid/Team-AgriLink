import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usersService } from "@/services/users.service";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { mockUsers } from "@/lib/mockData";
import { toast } from "sonner";

const API_READY = process.env.NEXT_PUBLIC_API_READY === "true";

export function useAllUsers() {
  return useQuery({
    queryKey: QUERY_KEYS.users.all,
    queryFn: usersService.getAll,
    enabled: API_READY,
    placeholderData: mockUsers,
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.users.detail(id),
    queryFn: () => usersService.getById(id),
    enabled: API_READY && !!id,
    placeholderData: mockUsers.find((u) => u.id === id),
  });
}

export function useSuspendUserMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => usersService.suspend(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.users.all });
      toast.success("User suspended");
    },
    onError: () => toast.error("Failed to suspend user"),
  });
}

export function useUpdateProfileMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: usersService.updateProfile,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.users.all });
      toast.success("Profile updated");
    },
    onError: () => toast.error("Failed to update profile"),
  });
}
