import { apiClient } from "./api";
import { LoginFormData, AuthApiResponse } from "../types/auth";

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
  async login(credentials: LoginFormData): Promise<AuthApiResponse> {
    return apiClient<AuthApiResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });
  },

  /** Révoque un refresh token côté serveur (sans erreur si déjà invalide). */
  async revokeSession(refreshToken?: string): Promise<void> {
    if (!refreshToken) return;
    await apiClient<void>("/api/auth/logout", {
      method: "POST",
      body: JSON.stringify({ refresh_token: refreshToken }),
    }).catch(() => undefined);
  },
};
