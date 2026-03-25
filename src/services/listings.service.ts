import api from "@/lib/axios";
import { Listing, ListingStatus } from "@/types";

export interface CreateListingPayload {
  cropName: string;
  quantity: number;
  unit: string;
  price: number;
  location: string;
}

export interface UpdateListingPayload extends Partial<CreateListingPayload> {
  status?: ListingStatus;
}

export interface ListingsResponse {
  data: Listing[];
  total: number;
  page: number;
  limit: number;
}

export const listingsService = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    status?: ListingStatus;
    search?: string;
  }) => api.get<ListingsResponse>("/listings", { params }).then((r) => r.data),

  getById: (id: string) =>
    api.get<Listing>(`/listings/${id}`).then((r) => r.data),

  getMyListings: () => api.get<Listing[]>("/listings/my").then((r) => r.data),

  create: (payload: CreateListingPayload) =>
    api.post<Listing>("/listings", payload).then((r) => r.data),

  update: (id: string, payload: UpdateListingPayload) =>
    api.patch<Listing>(`/listings/${id}`, payload).then((r) => r.data),

  delete: (id: string) => api.delete(`/listings/${id}`).then((r) => r.data),
};
