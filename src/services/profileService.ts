import { apiClient } from "./api";
import {
  Address,
  AddressInput,
  ProfileUpdate,
  UserProfile,
} from "../types/profile";

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

  listAddresses(): Promise<Address[]> {
    return apiClient<Address[]>("/api/users/me/addresses", {
      requiresAuth: true,
    });
  },

  addAddress(input: AddressInput): Promise<Address> {
    return apiClient<Address>("/api/users/me/addresses", {
      method: "POST",
      body: JSON.stringify(input),
      requiresAuth: true,
    });
  },

  deleteAddress(id: string): Promise<void> {
    return apiClient<void>(`/api/users/me/addresses/${id}`, {
      method: "DELETE",
      requiresAuth: true,
    });
  },
};
