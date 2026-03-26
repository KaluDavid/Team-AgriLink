import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ordersService, CreateOrderPayload } from "@/services/orders.service";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { mockOrders } from "@/lib/mockData";
import { toast } from "sonner";

const API_READY = process.env.NEXT_PUBLIC_API_READY === "true";

export function useMyOrders(buyerId?: string) {
  return useQuery({
    queryKey: [...QUERY_KEYS.orders.all, "buyer", buyerId],
    queryFn: ordersService.getMyOrders,
    enabled: API_READY && !!buyerId,
    placeholderData: mockOrders.filter(
      (o) => o.buyerId === buyerId || o.buyerName === "Sarah Buyer",
    ),
  });
}

export function useFarmerOrders(farmerId?: string) {
  return useQuery({
    queryKey: [...QUERY_KEYS.orders.all, "farmer", farmerId],
    queryFn: ordersService.getFarmerOrders,
    enabled: API_READY && !!farmerId,
    placeholderData: mockOrders.filter(
      (o) => o.farmerId === farmerId || o.farmerName === "John Farmer",
    ),
  });
}

export function useAllOrders() {
  return useQuery({
    queryKey: QUERY_KEYS.orders.all,
    queryFn: ordersService.getAll,
    enabled: API_READY,
    placeholderData: mockOrders,
  });
}

export function useCreateOrderMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateOrderPayload) => ordersService.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.orders.all });
      toast.success("Order placed!");
    },
    onError: (err: Error) =>
      toast.error("Failed to place order", { description: err.message }),
  });
}

export function useAcceptOrderMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ordersService.accept(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.orders.all });
      toast.success("Order accepted!", {
        description: "Prepare the produce for delivery.",
      });
    },
    onError: (err: Error) =>
      toast.error("Failed to accept order", { description: err.message }),
  });
}

export function useRejectOrderMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ordersService.reject(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.orders.all });
      toast.info("Order rejected", {
        description: "The buyer will be notified and refunded.",
      });
    },
    onError: (err: Error) =>
      toast.error("Failed to reject order", { description: err.message }),
  });
}

export function useConfirmDeliveryMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ordersService.confirmDelivery(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.orders.all });
      toast.success("Delivery confirmed!", {
        description: "Payment released to farmer.",
      });
    },
    onError: (err: Error) =>
      toast.error("Failed to confirm delivery", { description: err.message }),
  });
}

export function useCancelOrderMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ordersService.cancel(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.orders.all });
      toast.info("Order cancelled");
    },
    onError: (err: Error) =>
      toast.error("Failed to cancel order", { description: err.message }),
  });
}
