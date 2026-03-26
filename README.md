# AgriLink — Frontend

> **Enyata Community × Interswitch Hackathon**
> Official frontend repository of Team AgriLink.

AgriLink is a digital marketplace platform built to improve market access and economic opportunities for smallholder farmers across Nigeria. It connects farmers directly to buyers, eliminates middlemen, and secures every transaction through an escrow payment system.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [User Roles & Flows](#user-roles--flows)
- [API Integration](#api-integration)
- [Key Architectural Decisions](#key-architectural-decisions)
- [Demo Accounts](#demo-accounts)
- [Related Repositories](#related-repositories)
- [Design](#design)
- [Team](#team)

---

## Overview

AgriLink addresses the challenge smallholder farmers face in accessing fair markets. The platform provides:

- A **Farmer Portal** to list produce, manage orders, and track wallet earnings
- A **Buyer Marketplace** to browse, purchase, and track fresh farm produce
- An **Admin Dashboard** to moderate users, listings, and escrow transactions
- **Escrow-protected payments** — funds are held until delivery is confirmed by both parties

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui (Radix primitives) |
| State Management | Zustand (with persistence) |
| Server State / Data Fetching | TanStack Query v5 |
| HTTP Client | Axios (with interceptors) |
| Form Handling | React Hook Form + Zod |
| Notifications | Sonner |
| Icons | Lucide React |
| Package Manager | Bun |

---

## Project Structure

```
src/
├── app/                        # Next.js App Router
│   ├── (auth)/                 # Auth route group (login, register)
│   ├── (farmer)/               # Farmer portal (dashboard, listings, orders, wallet)
│   ├── (buyer)/                # Buyer portal (marketplace, products, checkout, orders)
│   ├── (admin)/                # Admin portal (users, listings, payments)
│   ├── layout.tsx              # Root layout + providers
│   ├── page.tsx                # Landing page
│   └── not-found.tsx           # 404 page
│
├── components/
│   ├── ui/                     # shadcn auto-generated components
│   ├── common/                 # Shared: Navbar, Logo, NavLink, StatusBadge, Providers
│   ├── layout/                 # Role sidebars and navbars
│   ├── farmer/                 # Farmer-specific components (ListingCard)
│   ├── buyer/                  # Buyer-specific components
│   └── admin/                  # Admin-specific components
│
├── store/                      # Zustand stores
│   ├── authStore.ts            # Auth state + cookie sync for middleware
│   ├── cartStore.ts            # Cart state
│   └── uiStore.ts              # Sidebar / modal state
│
├── queries/                    # TanStack Query hooks (per domain)
│   ├── auth.queries.ts
│   ├── listings.queries.ts
│   ├── orders.queries.ts
│   ├── payments.queries.ts
│   └── users.queries.ts
│
├── services/                   # Raw Axios API call functions
│   ├── auth.service.ts
│   ├── listings.service.ts
│   ├── orders.service.ts
│   ├── payments.service.ts
│   └── users.service.ts
│
├── hooks/                      # Custom React hooks
│   ├── useAuth.ts
│   └── useMobile.ts
│
├── lib/
│   ├── axios.ts                # Axios instance + request/response interceptors
│   ├── queryClient.ts          # TanStack Query client config
│   ├── mockData.ts             # Mock data (active until API_READY=true)
│   └── utils.ts                # cn(), formatCurrency(), formatDate()
│
├── types/                      # TypeScript interfaces (split by domain)
│   ├── user.types.ts
│   ├── product.types.ts
│   ├── order.types.ts
│   └── payment.types.ts
│
├── constants/
│   ├── routes.ts               # Typed route constants
│   └── queryKeys.ts            # TanStack Query key factory
│
├── middleware.ts               # Route protection + role-based access guards
└── app/globals.css             # Tailwind v4 theme + design tokens
```

---

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) v1.0+
- Node.js 18+ (for tooling compatibility)

### Installation

```bash
# Clone the repository
git clone https://github.com/KaluDavid/agri-market1.git
cd agri-market1

# Install dependencies
bun install

# Copy environment file
cp .env.example .env.local

# Start development server
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
bun run build
bun start
```

### Type Check

```bash
bun x tsc --noEmit
```

---

## Environment Variables

Create a `.env.local` file at the root:

```env
# Backend API base URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1

# Set to "true" to switch from mock data to live API calls
NEXT_PUBLIC_API_READY=false

# Environment label
NEXT_PUBLIC_APP_ENV=development
```

> **`NEXT_PUBLIC_API_READY`** is the single switch that controls whether the app uses mock data or live API calls. When the backend is deployed and ready, flip this to `true` — no other code changes needed.

---

## User Roles & Flows

### Farmer
| Route | Description |
|---|---|
| `/farmer` | Dashboard — stats, recent orders, quick actions |
| `/farmer/listings` | View and manage produce listings |
| `/farmer/listings/create` | Create a new produce listing |
| `/farmer/orders` | Accept or reject incoming orders |
| `/farmer/wallet` | View earnings, escrow balance, transaction history |
| `/farmer/profile` | Edit account details |

### Buyer
| Route | Description |
|---|---|
| `/buyer` | Marketplace — browse and filter all active listings |
| `/buyer/products/:id` | Listing detail — quantity selector, buy now |
| `/buyer/checkout` | Order summary + mock payment |
| `/buyer/orders` | Track orders, confirm delivery |
| `/buyer/profile` | Edit account details |

### Admin
| Route | Description |
|---|---|
| `/admin` | Platform overview — users, listings, transaction stats |
| `/admin/users` | Search, filter, and suspend users |
| `/admin/listings` | Approve or suspend marketplace listings |
| `/admin/payments` | Monitor escrow — release or refund transactions |

---

## API Integration

The backend is a **PHP REST API** with MySQL. Full API documentation is available in the backend repository.

### Base URL
```
https://yourdomain.com/api/
```

### Authentication
All protected endpoints require a JWT Bearer token:
```
Authorization: Bearer <token>
```

### Key Domains

| Domain | Base Path |
|---|---|
| Auth | `/auth` |
| Listings | `/listings` |
| Orders | `/orders` |
| Wallet | `/wallet` |
| Users | `/users` |
| Notifications | `/notifications` |
| Admin | `/admin` |
| Integrations | `/integrations` |

### Switching to Live API

1. Deploy the backend (see [backend repo](https://github.com/apreezofficial/agriclink-mvp-backend))
2. Set `NEXT_PUBLIC_API_BASE_URL` to your deployed backend URL
3. Set `NEXT_PUBLIC_API_READY=true` in `.env.local`
4. Restart the dev server

All queries have `enabled: API_READY` — they automatically activate when the flag is flipped. Mock data in `src/lib/mockData.ts` remains as a safe fallback during transition.

---

## Key Architectural Decisions

### Route Groups for Role Isolation
Each user role (`farmer`, `buyer`, `admin`) lives in its own App Router route group with a dedicated `layout.tsx`. This keeps role-specific navigation, sidebars, and layouts completely isolated without any manual wrapping.

### Services / Queries Separation
- `services/` — raw Axios functions, one per domain. Only these files change when the API is ready.
- `queries/` — TanStack Query hooks that wrap services. Pages import from here, never directly from services.

### Middleware-Based Auth Guard
`src/middleware.ts` handles all route protection and role-based redirects at the edge — before any page renders. Auth state is synced to a cookie by `authStore.ts` so the middleware can read it server-side.

### Zustand + Cookie Sync
Zustand persists auth state to `localStorage` (for the client) and manually writes to a cookie (for the middleware). On logout, both are cleared atomically.

### Mock → API in One Line
The `NEXT_PUBLIC_API_READY` environment variable controls whether queries hit the real API or serve `placeholderData` from mock data. No conditional logic scattered across pages.

---

## Demo Accounts

Use these to test all three portals without registration:

| Role | Email | Password |
|---|---|---|
| Farmer | farmer@demo.com | password |
| Buyer | buyer@demo.com | password |
| Admin | admin@demo.com | password |

---

## Related Repositories

| Repository | Description |
|---|---|
| [agriclink-mvp-backend](https://github.com/apreezofficial/agriclink-mvp-backend) | PHP + MySQL REST API backend |

---

## Design

Figma design files for AgriLink are available here:
[AgriMarketplace — Figma](https://www.figma.com/design/rKCSewA9JXkdY4QOZ8mpCB/AgriMarketplace?node-id=5-2405&t=yyFzCrtirQBVZ3ic-0)

---

## Contributors

- [Kalu David](https://github.com/KaluDavid/)
- [Precious Adedokun](https://github.com/apreezofficial)
---

<p align="center">Built with care for Nigerian farmers 🌱</p>

