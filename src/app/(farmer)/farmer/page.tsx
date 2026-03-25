"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { useMyListings } from "@/queries/listings.queries";
import { useFarmerOrders } from "@/queries/orders.queries";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";
import { ROUTES } from "@/constants/routes";
import {
  Package,
  ShoppingCart,
  Wallet,
  PlusCircle,
  TrendingUp,
  Clock,
  CheckCircle2,
} from "lucide-react";

export default function FarmerDashboardPage() {
  const user = useAuthStore((s) => s.user);
  const { data: listings = [], isLoading: listingsLoading } = useMyListings(
    user?.id,
  );
  const { data: orders = [], isLoading: ordersLoading } = useFarmerOrders(
    user?.id,
  );

  const isLoading = listingsLoading || ordersLoading;

  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const completedOrders = orders.filter((o) => o.status === "completed").length;
  const totalEarnings = orders
    .filter((o) => o.escrowStatus === "released")
    .reduce((sum, o) => sum + o.totalAmount, 0);

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
      label: "Active Listings",
      value: listings.filter((l) => l.status === "active").length,
      icon: Package,
      color: "",
    },
    {
      label: "Pending Orders",
      value: pendingOrders,
      icon: Clock,
      color: "text-yellow-500",
    },
    {
      label: "Completed",
      value: completedOrders,
      icon: CheckCircle2,
      color: "text-green-500",
    },
    {
      label: "Total Earnings",
      value: formatCurrency(totalEarnings),
      icon: TrendingUp,
      color: "text-primary",
      isString: true,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="section-title">
            Welcome back, {user?.name?.split(" ")[0]}
          </h1>
          <p className="text-muted-foreground text-[15px]">
            Here&apos;s what&apos;s happening with your farm
          </p>
        </div>
        <Button asChild className="py-5.5 px-6">
          <Link href={ROUTES.FARMER.CREATE_LISTING}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Produce
          </Link>
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, isString }) => (
          <Card key={label} className="h-28 flex justify-center px-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {label}
              </CardTitle>
              <Icon className={`h-4 w-4 ${color || "text-muted-foreground"}`} />
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold ${isString ? "text-primary" : ""}`}
              >
                {value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          {
            href: ROUTES.FARMER.CREATE_LISTING,
            icon: PlusCircle,
            title: "Add New Produce",
            desc: "List your farm produce for buyers",
            highlight: true,
          },
          {
            href: ROUTES.FARMER.ORDERS,
            icon: ShoppingCart,
            title: "View Orders",
            desc:
              pendingOrders > 0
                ? `${pendingOrders} orders need attention`
                : "Check your order status",
            highlight: false,
          },
          {
            href: ROUTES.FARMER.WALLET,
            icon: Wallet,
            title: "Wallet",
            desc: "Check your earnings and payments",
            highlight: false,
          },
        ].map(({ href, icon: Icon, title, desc, highlight }) => (
          <Link
            key={href}
            href={href}
            className={`rounded-xl p-6 border h-40 justify-center flex flex-col transition-colors ${
              highlight
                ? "bg-primary/5 border-primary/20 hover:bg-primary/10"
                : "bg-card border-border hover:border-primary/50"
            }`}
          >
            <Icon
              className={`h-8 w-8 mb-3 ${highlight ? "text-primary" : "text-muted-foreground"}`}
            />
            <h3 className="font-semibold text-lg">{title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{desc}</p>
          </Link>
        ))}
      </div>

      {orders.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recent Orders</h2>

            <Link
              href={ROUTES.FARMER.ORDERS}
              className="underline cursor-pointer mb-6 font-semibold text-[15px]"
            >
              View All
            </Link>
          </div>
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    {["Crop", "Buyer", "Amount", "Status"].map((h) => (
                      <th
                        key={h}
                        className="text-left p-4 text-sm font-medium text-muted-foreground"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 3).map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-border last:border-0"
                    >
                      <td className="p-4 font-medium">{order.cropName}</td>
                      <td className="p-4 text-muted-foreground">
                        {order.buyerName}
                      </td>
                      <td className="p-4">
                        {formatCurrency(order.totalAmount)}
                      </td>
                      <td className="p-4">
                        <StatusBadge status={order.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
