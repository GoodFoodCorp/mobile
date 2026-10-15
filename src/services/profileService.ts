import { apiClient } from "./api";
import { ProfileUpdate, UserProfile } from "../types/profile";

export const profileService = {
  getProfile(): Promise<UserProfile> {
    return apiClient<UserProfile>("/api/users/me", { requiresAuth: true });
  },

  updateProfile(input: ProfileUpdate): Promise<UserProfile> {
    return apiClient<UserProfile>("/api/users/me", {
      method: "PUT",
      body: JSON.stringify(input),
      requiresAuth: true,
    });
  },
};
