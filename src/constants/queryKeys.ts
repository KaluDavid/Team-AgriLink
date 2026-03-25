export const QUERY_KEYS = {
  listings: {
    all: ["listings"] as const,
    byFarmer: (farmerId: string) => ["listings", "farmer", farmerId] as const,
    detail: (id: string) => ["listings", id] as const,
  },
  orders: {
    all: ["orders"] as const,
    byBuyer: (buyerId: string) => ["orders", "buyer", buyerId] as const,
    byFarmer: (farmerId: string) => ["orders", "farmer", farmerId] as const,
    detail: (id: string) => ["orders", id] as const,
  },
  users: {
    all: ["users"] as const,
    detail: (id: string) => ["users", id] as const,
  },
  transactions: {
    all: ["transactions"] as const,
  },
} as const;
