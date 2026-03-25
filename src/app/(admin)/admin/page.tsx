"use client";

import { useAllUsers } from "@/queries/users.queries";
import { useAllOrders } from "@/queries/orders.queries";
import { useListings } from "@/queries/listings.queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";
import {
  Users,
  Package,
  CreditCard,
  ShoppingCart,
  UserCheck,
  TrendingUp,
} from "lucide-react";

export default function AdminDashboardPage() {
  const { data: users = [], isLoading: usersLoading } = useAllUsers();
  const { data: orders = [], isLoading: ordersLoading } = useAllOrders();
  const { data: listingsData, isLoading: listingsLoading } = useListings();
  const listings = listingsData?.data ?? [];

  const isLoading = usersLoading || ordersLoading || listingsLoading;

  const farmers = users.filter((u) => u.role === "farmer");
  const buyers = users.filter((u) => u.role === "buyer");
  const activeListings = listings.filter((l) => l.status === "active");
  const totalTransactions = orders.reduce((s, o) => s + o.totalAmount, 0);
  const pendingOrders = orders.filter((o) => o.status === "pending").length;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: "Total Users",
      value: users.length,
      sub: `${farmers.length} farmers, ${buyers.length} buyers`,
      icon: Users,
    },
    {
      label: "Active Listings",
      value: activeListings.length,
      sub: `of ${listings.length} total`,
      icon: Package,
    },
    {
      label: "Total Transactions",
      value: formatCurrency(totalTransactions),
      sub: `${orders.length} orders`,
      icon: CreditCard,
      isString: true,
    },
    {
      label: "Pending Orders",
      value: pendingOrders,
      sub: "Awaiting action",
      icon: ShoppingCart,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="section-title">Admin Dashboard</h1>
        <p className="text-muted-foreground text-[15px]">
          Platform overview and management
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 ">
        {stats.map(({ label, value, sub, icon: Icon }) => (
          <Card
            key={label}
            className="rounded-lg flex justify-center px-2 py-5"
          >
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {label}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{value}</div>
              <p className="text-xs text-muted-foreground mt-1">{sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="rounded-lg px-2 py-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              Recent Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.slice(0, 5).map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">
                        {user.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <StatusBadge
                    status={user.role === "farmer" ? "active" : "accepted"}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-lg  px-2 py-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Recent Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orders.slice(0, 5).map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium">{order.cropName}</p>
                    <p className="text-xs text-muted-foreground">
                      {order.buyerName} → {order.farmerName}
                    </p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="font-semibold">
                      {formatCurrency(order.totalAmount)}
                    </p>
                    <StatusBadge status={order.status} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
