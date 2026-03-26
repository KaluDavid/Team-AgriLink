"use client";

import { useAuthStore } from "@/store/authStore";
import { useWalletBalance, useTransactions } from "@/queries/payments.queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle2,
} from "lucide-react";

export default function FarmerWalletPage() {
  const user = useAuthStore((s) => s.user);
  const { data: balance, isLoading: balanceLoading } = useWalletBalance(
    user?.id,
  );
  const { data: transactions = [], isLoading: txLoading } = useTransactions();

  const isLoading = balanceLoading || txLoading;

  const available = balance?.available ?? 0;
  const pending = balance?.pending ?? 0;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
        </div>
        <Skeleton className="h-20 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="section-title">Wallet</h1>
        <p className="text-muted-foreground text-[15px]">
          Your earnings and payment history
        </p>
      </div>

      <div className="grid sm:grid-cols-2 *:rounded-lg *:flex *:justify-center *:px-2 *:h-35 gap-4">
        <Card className="gradient-hero text-white">
          <CardHeader>
            <CardTitle className="text-xs font-medium text-white/80">
              Available Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {formatCurrency(available)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Pending in Escrow
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(pending)}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="py-3 px-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Wallet className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold">Withdraw Funds</p>
                <p className="text-sm text-muted-foreground">
                  Transfer your balance to your bank account
                </p>
              </div>
            </div>
            <Button
              className="py-5.5 px-6 cursor-pointer"
              disabled={available === 0}
            >
              <ArrowUpRight className="h-4 w-4 mr-2" />
              Withdraw {formatCurrency(available)}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
        {transactions.length > 0 ? (
          <div className="bg-card border border-border rounded-xl divide-y divide-border">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      tx.status === "completed"
                        ? "bg-green-100"
                        : "bg-yellow-100"
                    }`}
                  >
                    {tx.status === "completed" ? (
                      <ArrowDownLeft className="h-5 w-5 text-green-600" />
                    ) : (
                      <Clock className="h-5 w-5 text-yellow-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium capitalize">
                      {tx.type.replace("_", " ")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(tx.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`font-semibold ${tx.status === "completed" ? "text-green-600" : ""}`}
                  >
                    {formatCurrency(tx.amount)}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center justify-end gap-1">
                    {tx.status === "completed" ? (
                      <>
                        <CheckCircle2 className="h-3 w-3" />
                        Completed
                      </>
                    ) : (
                      <>
                        <Clock className="h-3 w-3" />
                        Pending
                      </>
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-muted/50 rounded-xl">
            <p className="text-muted-foreground">No transactions yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
