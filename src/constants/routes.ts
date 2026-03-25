export const ROUTES = {
  HOME: "/",
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  FARMER: {
    DASHBOARD: "/farmer",
    LISTINGS: "/farmer/listings",
    CREATE_LISTING: "/farmer/listings/create",
    ORDERS: "/farmer/orders",
    WALLET: "/farmer/wallet",
    PROFILE: "/farmer/profile",
  },
  BUYER: {
    MARKETPLACE: "/buyer",
    PRODUCT: (id: string) => `/buyer/products/${id}`,
    CHECKOUT: "/buyer/checkout",
    ORDERS: "/buyer/orders",
    PROFILE: "/buyer/profile",
  },
  ADMIN: {
    DASHBOARD: "/admin",
    USERS: "/admin/users",
    LISTINGS: "/admin/listings",
    PAYMENTS: "/admin/payments",
  },
} as const;
