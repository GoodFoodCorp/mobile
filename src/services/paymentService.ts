import { apiClient } from "./api";
import { PaymentMethod, PaymentMethodInput } from "../types/payment";

export const paymentService = {
  listMethods() {
    return apiClient<PaymentMethod[]>("/api/payments/methods", {
      requiresAuth: true,
    });
  },
  addMethod(input: PaymentMethodInput) {
    return apiClient<PaymentMethod>("/api/payments/methods", {
      method: "POST",
      body: JSON.stringify(input),
      requiresAuth: true,
    });
  },
  deleteMethod(id: string) {
    return apiClient<void>(`/api/payments/methods/${id}`, {
      method: "DELETE",
      requiresAuth: true,
    });
  },
};
