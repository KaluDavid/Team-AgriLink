import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { paymentsService } from "@/services/payments.service";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { mockOrders } from "@/lib/mockData";
import { toast } from "sonner";

const API_READY = process.env.NEXT_PUBLIC_API_READY === "true";

export function useTransactions() {
  return useQuery({
    queryKey: QUERY_KEYS.transactions.all,
    queryFn: paymentsService.getTransactions,
    enabled: API_READY,
    placeholderData: [],
  });
}

export function useWalletBalance(userId?: string) {
  return useQuery({
    queryKey: ["wallet", "balance", userId],
    queryFn: paymentsService.getWalletBalance,
    enabled: API_READY && !!userId,
    placeholderData: {
      available: mockOrders
        .filter((o) => o.escrowStatus === "released")
        .reduce((s, o) => s + o.totalAmount, 0),
      pending: mockOrders
        .filter((o) => o.escrowStatus === "held")
        .reduce((s, o) => s + o.totalAmount, 0),
      total_earned: 0,
    },
  });
}

export function useReleaseEscrowMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (orderId: string) => paymentsService.releaseEscrow(orderId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.transactions.all });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.orders.all });
      toast.success("Escrow released", {
        description: "Payment sent to farmer.",
      });
    },
    onError: (err: Error) =>
      toast.error("Failed to release escrow", { description: err.message }),
  });
}

export function useRefundMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (orderId: string) => paymentsService.refund(orderId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.transactions.all });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.orders.all });
      toast.success("Refund processed", {
        description: "Payment returned to buyer.",
      });
    },
    onError: (err: Error) =>
      toast.error("Failed to process refund", { description: err.message }),
  });
}
