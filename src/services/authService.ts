import { apiClient } from "./api";
import {
  LoginFormData,
  RegisterFormData,
  AuthApiResponse,
} from "../types/auth";

export const authService = {
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
