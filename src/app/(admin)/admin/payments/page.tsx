"use client";

import { useState } from "react";
import { useAllOrders } from "@/queries/orders.queries";
import {
  useReleaseEscrowMutation,
  useRefundMutation,
} from "@/queries/payments.queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";
import { Search, ShieldCheck, RefreshCw } from "lucide-react";

export default function AdminPaymentsPage() {
  const { data: orders = [], isLoading } = useAllOrders();
  const releaseEscrow = useReleaseEscrowMutation();
  const refund = useRefundMutation();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = orders.filter((o) => {
    const matchSearch =
      o.cropName.toLowerCase().includes(search.toLowerCase()) ||
      (o.buyerName?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (o.farmerName?.toLowerCase() || "").includes(search.toLowerCase());
    return matchSearch && (statusFilter === "all" || o.status === statusFilter);
  });

  const totalVolume = orders.reduce((s, o) => s + o.totalAmount, 0);
  const inEscrow = orders
    .filter((o) => o.escrowStatus === "held")
    .reduce((s, o) => s + o.totalAmount, 0);
  const released = orders
    .filter((o) => o.escrowStatus === "released")
    .reduce((s, o) => s + o.totalAmount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="section-title">Transactions</h1>
        <p className="text-muted-foreground text-[15px]">
          Monitor all platform transactions and escrow
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {[
          {
            label: "Total Volume",
            value: formatCurrency(totalVolume),
            color: "text-primary",
          },
          { label: "In Escrow", value: formatCurrency(inEscrow), color: "" },
          {
            label: "Released",
            value: formatCurrency(released),
            color: "text-green-600",
          },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className="bg-card border border-border rounded-lg py-5.5 space-y-1 px-4"
          >
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10! input-large h-12!"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-50! cursor-pointer input-large h-12!">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent className="p-1.5">
            <SelectItem value="all" className="p-2 cursor-pointer">
              All Status
            </SelectItem>
            <SelectItem value="pending" className="p-2 cursor-pointer">
              Pending
            </SelectItem>
            <SelectItem value="accepted" className="p-2 cursor-pointer">
              Accepted
            </SelectItem>
            <SelectItem value="completed" className="p-2 cursor-pointer">
              Completed
            </SelectItem>
            <SelectItem value="cancelled" className="p-2 cursor-pointer">
              Cancelled
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                {[
                  "Order ID",
                  "Crop",
                  "Buyer",
                  "Farmer",
                  "Amount",
                  "Status",
                  "Escrow",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className={`p-4 text-sm font-medium text-muted-foreground ${h === "Actions" ? "text-right" : "text-left"}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="*:text-sm">
              {isLoading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 8 }).map((_, j) => (
                        <td key={j} className="p-4">
                          <Skeleton className="h-4 w-full" />
                        </td>
                      ))}
                    </tr>
                  ))
                : filtered.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-border last:border-0"
                    >
                      <td className="p-4 font-mono text-sm">{order.id}</td>
                      <td className="p-4 font-medium">{order.cropName}</td>
                      <td className="p-4 text-muted-foreground">
                        {order.buyerName}
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {order.farmerName}
                      </td>
                      <td className="p-4 font-semibold">
                        {formatCurrency(order.totalAmount)}
                      </td>
                      <td className="p-4">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          <ShieldCheck
                            className={`h-4 w-4 ${
                              order.escrowStatus === "held"
                                ? "text-yellow-500"
                                : order.escrowStatus === "released"
                                  ? "text-green-600"
                                  : "text-muted-foreground"
                            }`}
                          />
                          <span className="text-sm capitalize">
                            {order.escrowStatus}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        {order.escrowStatus === "held" && (
                          <div className="flex justify-end gap-8">
                            <button
                              onClick={() => releaseEscrow.mutate(order.id)}
                              disabled={releaseEscrow.isPending}
                              className="text-green-600 hover:text-green-700 cursor-pointer text-sm"
                            >
                              Release
                            </button>
                            <button
                              onClick={() => refund.mutate(order.id)}
                              disabled={refund.isPending}
                              className="text-destructive hover:text-destructive cursor-pointer text-sm flex items-center"
                            >
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Refund
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">
        Showing {filtered.length} of {orders.length} transactions
      </p>
    </div>
  );
}
