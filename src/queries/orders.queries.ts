import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ordersService, CreateOrderPayload } from "@/services/orders.service";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { mockOrders } from "@/lib/mockData";
import { OrderStatus } from "@/types";
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
    onError: () => toast.error("Failed to place order"),
  });
}

export function useUpdateOrderStatusMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      ordersService.updateStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.orders.all });
    },
    onError: () => toast.error("Failed to update order"),
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
    onError: () => toast.error("Failed to confirm delivery"),
  });
}
