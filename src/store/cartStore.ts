"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Listing } from "@/types";

interface CartItem {
  listing: Listing;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (listing: Listing, quantity: number) => void;
  removeItem: (listingId: string) => void;
  updateQuantity: (listingId: string, quantity: number) => void;
  clearCart: () => void;
  total: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (listing, quantity) => {
        const exists = get().items.find((i) => i.listing.id === listing.id);
        if (exists) {
          set((state) => ({
            items: state.items.map((i) =>
              i.listing.id === listing.id
                ? { ...i, quantity: i.quantity + quantity }
                : i,
            ),
          }));
        } else {
          set((state) => ({ items: [...state.items, { listing, quantity }] }));
        }
      },

      removeItem: (listingId) =>
        set((state) => ({
          items: state.items.filter((i) => i.listing.id !== listingId),
        })),

      updateQuantity: (listingId, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.listing.id === listingId ? { ...i, quantity } : i,
          ),
        })),

      clearCart: () => set({ items: [] }),

      total: () =>
        get().items.reduce(
          (sum, item) => sum + item.listing.price * item.quantity,
          0,
        ),
    }),
    { name: "cart-storage" },
  ),
);
