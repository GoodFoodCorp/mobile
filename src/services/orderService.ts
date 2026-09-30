import { apiClient } from "./api";
import { ApiReadyOrder } from "../types/order";

export const orderService = {
  async getReadyForDelivery(): Promise<ApiReadyOrder[]> {
    return apiClient<ApiReadyOrder[]>("/api/orders/ready-for-delivery", {
      method: "GET",
      requiresAuth: true,
    });
  },
};
