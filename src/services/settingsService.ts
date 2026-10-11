import { apiClient } from "./api";
import { SettingsUpdate, UserSettings } from "../types/settings";

export const settingsService = {
  get() {
    return apiClient<UserSettings>("/api/users/me/settings", {
      requiresAuth: true,
    });
  },
  update(input: SettingsUpdate) {
    return apiClient<UserSettings>("/api/users/me/settings", {
      method: "PATCH",
      body: JSON.stringify(input),
      requiresAuth: true,
    });
  },
};
