import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  paymentsService,
  InitiatePaymentPayload,
} from "@/services/payments.service";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { mockOrders } from "@/lib/mockData";
import { toast } from "sonner";

const API_READY = process.env.NEXT_PUBLIC_API_READY === "true";

export function useTransactions() {
  return useQuery({
    queryKey: QUERY_KEYS.transactions.all,
    queryFn: paymentsService.getAll,
    enabled: API_READY,
    placeholderData: mockOrders,
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
    },
  });
}

export function useInitiatePaymentMutation() {
  return useMutation({
    mutationFn: (payload: InitiatePaymentPayload) =>
      paymentsService.initiate(payload),
    onError: () => toast.error("Payment initiation failed"),
  });
}

export function useReleaseEscrowMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (orderId: string) => paymentsService.releaseEscrow(orderId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.transactions.all });
      toast.success("Escrow released", {
        description: "Payment sent to farmer.",
      });
    },
    onError: () => toast.error("Failed to release escrow"),
  });
}

export function useRefundMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (orderId: string) => paymentsService.refund(orderId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.transactions.all });
      toast.success("Refund processed", {
        description: "Payment returned to buyer.",
      });
    },
    onError: () => toast.error("Failed to process refund"),
  });
}
