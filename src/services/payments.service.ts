import api from "@/lib/axios";
import { Transaction } from "@/types";

export interface InitiatePaymentPayload {
  orderId: string;
  amount: number;
}

export interface PaymentResponse {
  authorizationUrl: string;
  reference: string;
}

export const paymentsService = {
  getAll: () => api.get<Transaction[]>("/payments").then((r) => r.data),

  initiate: (payload: InitiatePaymentPayload) =>
    api
      .post<PaymentResponse>("/payments/initiate", payload)
      .then((r) => r.data),

  verify: (reference: string) =>
    api.get<Transaction>(`/payments/verify/${reference}`).then((r) => r.data),

  releaseEscrow: (orderId: string) =>
    api.post<Transaction>(`/payments/release/${orderId}`).then((r) => r.data),

  refund: (orderId: string) =>
    api.post<Transaction>(`/payments/refund/${orderId}`).then((r) => r.data),

  getWalletBalance: () =>
    api
      .get<{ available: number; pending: number }>("/payments/wallet")
      .then((r) => r.data),
};
