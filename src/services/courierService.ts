import { apiClient } from "./api";
import { CourierApplication, CourierProfile } from "../types/courier";
import { Withdrawal } from "../types/delivery";

export const courierService = {
  getProfile() {
    return apiClient<CourierProfile>("/api/courier-profile", {
      requiresAuth: true,
    });
  },
  apply(input: CourierApplication) {
    return apiClient<CourierProfile>("/api/courier-profile", {
      method: "PUT",
      body: JSON.stringify(input),
      requiresAuth: true,
    });
  },
  setAvailability(isAvailable: boolean) {
    return apiClient<CourierProfile>("/api/courier-profile/availability", {
      method: "PATCH",
      body: JSON.stringify({ isAvailable }),
      requiresAuth: true,
    });
  },
  setIban(iban: string) {
    return apiClient<CourierProfile>("/api/courier-profile/iban", {
      method: "PUT",
      body: JSON.stringify({ iban }),
      requiresAuth: true,
    });
  },
  requestWithdrawal() {
    return apiClient<Withdrawal>("/api/courier-profile/withdrawals", {
      method: "POST",
      requiresAuth: true,
    });
  },
  registerPushToken(pushToken: string) {
    return apiClient<{ ok: boolean }>("/api/courier-profile/push-token", {
      method: "PUT",
      body: JSON.stringify({ pushToken }),
      requiresAuth: true,
    });
  },
  getEarnings() {
    return apiClient<{
      availableBalance: number;
      totalEarned: number;
      completedTrips: number;
    }>("/api/courier-profile/earnings", { requiresAuth: true });
  },

  /** Position du livreur, pour lui proposer les courses proches. */
  async reportLocation(lat: number, lng: number): Promise<void> {
    await apiClient<void>("/api/courier-profile/location", {
      method: "PUT",
      body: JSON.stringify({ lat, lng }),
      requiresAuth: true,
    });
  },
};
