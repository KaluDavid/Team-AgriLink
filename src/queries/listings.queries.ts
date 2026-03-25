import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listingsService,
  CreateListingPayload,
  UpdateListingPayload,
} from "@/services/listings.service";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { mockListings } from "@/lib/mockData";
import { Listing, ListingStatus } from "@/types";
import { toast } from "sonner";

const API_READY = process.env.NEXT_PUBLIC_API_READY === "true";

export function useListings(params?: {
  search?: string;
  crop?: string;
  location?: string;
}) {
  return useQuery({
    queryKey: [...QUERY_KEYS.listings.all, params],
    queryFn: () => listingsService.getAll(params),
    enabled: API_READY,
    placeholderData: {
      data: mockListings.filter((l) => {
        if (params?.search) {
          const s = params.search.toLowerCase();
          return (
            l.cropName.toLowerCase().includes(s) ||
            l.farmerName.toLowerCase().includes(s)
          );
        }
        return true;
      }),
      total: mockListings.length,
      page: 1,
      limit: 20,
    },
  });
}

export function useListing(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.listings.detail(id),
    queryFn: () => listingsService.getById(id),
    enabled: API_READY && !!id,
    placeholderData: mockListings.find((l) => l.id === id),
  });
}

export function useMyListings(farmerId?: string) {
  return useQuery({
    queryKey: ["listings", "my", farmerId],
    queryFn: listingsService.getMyListings,
    enabled: API_READY && !!farmerId,
    placeholderData: mockListings.filter(
      (l) => l.farmerId === farmerId || l.farmerName === "John Farmer",
    ),
  });
}

export function useCreateListingMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateListingPayload) =>
      listingsService.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.listings.all });
      toast.success("Listing created!", {
        description: "Your produce is now visible in the marketplace.",
      });
    },
    onError: () => toast.error("Failed to create listing"),
  });
}

export function useUpdateListingMutation(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateListingPayload) =>
      listingsService.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.listings.detail(id) });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.listings.all });
      toast.success("Listing updated!");
    },
    onError: () => toast.error("Failed to update listing"),
  });
}

export function useDeleteListingMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => listingsService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.listings.all });
      toast.success("Listing deleted");
    },
    onError: () => toast.error("Failed to delete listing"),
  });
}
