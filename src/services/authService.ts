import { apiClient } from "./api";
import {
  LoginFormData,
  RegisterFormData,
  AuthApiResponse,
} from "../types/auth";

export const authService = {
  async deleteAccount(): Promise<void> {
    await apiClient<void>("/api/auth/account", {
      method: "DELETE",
      requiresAuth: true,
    });
  },
  async changePassword(
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    await apiClient<void>("/api/auth/change-password", {
      method: "POST",
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword,
      }),
      requiresAuth: true,
    });
  },
  async upgradeToDelivery(data: object): Promise<void> {
    await apiClient<void>("/api/auth/upgrade-to-delivery", {
      method: "POST",
      body: JSON.stringify(data),
      requiresAuth: true,
    });
  },
  async login(credentials: LoginFormData): Promise<AuthApiResponse> {
    return apiClient<AuthApiResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });
  },

  async register(data: RegisterFormData): Promise<AuthApiResponse> {
    return apiClient<AuthApiResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};
