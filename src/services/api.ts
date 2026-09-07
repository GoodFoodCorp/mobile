import AsyncStorage from "@react-native-async-storage/async-storage";

export const API_BASE_URL = "https://api.c-mbk.fr";
const TOKEN_STORAGE_KEY = "@goodfood_auth_token";

interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const { requiresAuth = false, headers, ...customConfig } = options;

  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(headers as Record<string, string>),
  };

  if (requiresAuth) {
    const token = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
    if (token) {
      requestHeaders["Authorization"] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...customConfig,
    headers: requestHeaders,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMessage = data?.message || `Erreur serveur (${response.status})`;
    throw new Error(errorMessage);
  }

  return data as T;
}
