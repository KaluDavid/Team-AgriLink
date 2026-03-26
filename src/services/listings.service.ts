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
  }): Promise<ListingsResponse> =>
    api.get("/listings", { params }).then((r) => r.data),

  getById: (id: string): Promise<Listing> =>
    api.get(`/listings/${id}`).then((r) => r.data),

  getMyListings: (): Promise<Listing[]> =>
    api.get("/listings/my").then((r) => r.data),

  search: (query: string): Promise<Listing[]> =>
    api.get("/listings/search", { params: { q: query } }).then((r) => r.data),

  create: (payload: CreateListingPayload): Promise<Listing> =>
    api.post("/listings", payload).then((r) => r.data),

  update: (id: string, payload: UpdateListingPayload): Promise<Listing> =>
    api.put(`/listings/${id}`, payload).then((r) => r.data),

  updateStatus: (id: string, status: ListingStatus): Promise<Listing> =>
    api.patch(`/listings/${id}/status`, { status }).then((r) => r.data),

  delete: (id: string): Promise<void> =>
    api.delete(`/listings/${id}`).then(() => undefined),
};
