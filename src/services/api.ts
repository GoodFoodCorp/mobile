import AsyncStorage from "@react-native-async-storage/async-storage";

// Surchargeable pour tester contre une pile locale : EXPO_PUBLIC_API_URL=http://<ip-du-pc>:3000
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? "https://api.c-mbk.fr";
const TOKEN_STORAGE_KEY = "@goodfood_auth_token";
const REFRESH_TOKEN_STORAGE_KEY = "@goodfood_refresh_token";

type AuthListeners = {
  onTokenRefreshed?: (accessToken: string) => void;
  onSessionExpired?: () => void;
};
let authListeners: AuthListeners = {};

/** Permet à l'AuthContext d'être informé des renouvellements / expirations. */
export function setAuthListeners(listeners: AuthListeners) {
  authListeners = listeners;
}

// Le backend révoque l'ancien refresh token à chaque renouvellement :
// les appels concurrents doivent partager une seule requête de refresh.
let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const refreshToken = await AsyncStorage.getItem(
          REFRESH_TOKEN_STORAGE_KEY,
        );
        if (!refreshToken) return null;

        const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ refresh_token: refreshToken }),
        });

        // Refresh token refusé (expiré / révoqué) : la session est perdue.
        if (response.status === 401 || response.status === 403) {
          return null;
        }
        // Erreur transitoire (5xx) : on garde la session.
        if (!response.ok) {
          throw new Error(
            `Renouvellement de session en échec (${response.status})`,
          );
        }

        const data = await response.json();
        if (!data?.access_token) return null;

        await AsyncStorage.multiSet([
          [TOKEN_STORAGE_KEY, data.access_token],
          [REFRESH_TOKEN_STORAGE_KEY, data.refresh_token || refreshToken],
        ]);
        authListeners.onTokenRefreshed?.(data.access_token);
        return data.access_token as string;
      } finally {
        refreshPromise = null;
      }
    })();
  }
  return refreshPromise;
}

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

    if (!token) {
      console.warn(
        `[API] Requête vers ${endpoint} bloquée : aucun token trouvé dans le stockage.`,
      );
      throw new Error("Session expirée ou utilisateur non authentifié.");
    }

    requestHeaders["Authorization"] = `Bearer ${token}`;
  }

  let response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...customConfig,
    headers: requestHeaders,
  });

  // Access token expiré : on le renouvelle une fois puis on rejoue la requête.
  if (requiresAuth && response.status === 401) {
    const newToken = await refreshAccessToken();
    if (!newToken) {
      authListeners.onSessionExpired?.();
      throw new Error("Session expirée, veuillez vous reconnecter.");
    }
    requestHeaders["Authorization"] = `Bearer ${newToken}`;
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...customConfig,
      headers: requestHeaders,
    });
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    // Les services Go renvoient `message`, le Delivery-service (NestJS) `error`.
    const errorMessage =
      data?.message || data?.error || `Erreur serveur (${response.status})`;
    throw new Error(errorMessage);
  }

  return data as T;
}
