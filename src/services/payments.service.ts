import api from "@/lib/axios";
import { Transaction } from "@/types";

export interface WalletResponse {
  available: number;
  pending: number;
  total_earned: number;
}

export interface WithdrawPayload {
  amount: number;
  bank_account_id: string;
}

export interface BankAccount {
  id: string;
  bank_name: string;
  account_number: string;
  account_name: string;
}

export interface InitiatePaymentPayload {
  orderId: string;
  amount: number;
}

export interface PaymentInitResponse {
  authorization_url: string;
  reference: string;
}

export const paymentsService = {
  getWalletBalance: (): Promise<WalletResponse> =>
    api.get("/wallet").then((r) => r.data),

  getTransactions: (): Promise<Transaction[]> =>
    api.get("/wallet/transactions").then((r) => r.data),

  getAll: (): Promise<Transaction[]> =>
    api.get("/wallet/transactions").then((r) => r.data),

  getBankAccounts: (): Promise<BankAccount[]> =>
    api.get("/wallet/accounts").then((r) => r.data),

  addBankAccount: (payload: Omit<BankAccount, "id">): Promise<BankAccount> =>
    api.post("/wallet/accounts", payload).then((r) => r.data),

  withdraw: (payload: WithdrawPayload): Promise<void> =>
    api.post("/wallet/withdraw", payload).then(() => undefined),

  initiate: (payload: InitiatePaymentPayload): Promise<PaymentInitResponse> =>
    api
      .post("/integrations/payments/initialize", {
        order_id: payload.orderId,
        amount: payload.amount,
      })
      .then((r) => r.data),

  verify: (reference: string): Promise<Transaction> =>
    api
      .post("/integrations/payments/verify", { reference })
      .then((r) => r.data),

  releaseEscrow: (orderId: string): Promise<void> =>
    api.post(`/admin/orders/${orderId}/release-escrow`).then(() => undefined),

  refund: (orderId: string): Promise<void> =>
    api.post(`/admin/orders/${orderId}/refund`).then(() => undefined),
};
