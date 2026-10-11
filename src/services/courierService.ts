import { apiClient } from "./api";
import { CourierApplication, CourierProfile } from "../types/courier";

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
};
