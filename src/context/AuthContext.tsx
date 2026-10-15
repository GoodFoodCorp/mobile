import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

import { User, LoginFormData, AuthApiResponse } from "../types/auth";
import { authService } from "../services/authService";
import { setAuthListeners } from "../services/api";
import { profileService } from "../services/profileService";
import { hasCourierRole, mapJwtToUser } from "../utils/jwt";

const USER_STORAGE_KEY = "@goodfood_user_session";
const ACCESS_TOKEN_KEY = "@goodfood_auth_token";
const REFRESH_TOKEN_KEY = "@goodfood_refresh_token";

const NOT_COURIER_MESSAGE =
  "Cette application est réservée aux livreurs. Connectez-vous avec un compte livreur.";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (data: LoginFormData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: {
    fullName: string;
    email: string;
    phone: string;
  }) => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Synchronise l'état avec les renouvellements de token faits par apiClient
  useEffect(() => {
    setAuthListeners({
      onTokenRefreshed: (accessToken) => setToken(accessToken),
      onSessionExpired: () => {
        setUser(null);
        setToken(null);
        AsyncStorage.multiRemove([
          ACCESS_TOKEN_KEY,
          REFRESH_TOKEN_KEY,
          USER_STORAGE_KEY,
        ]).catch(() => {});
      },
    });
    return () => setAuthListeners({});
  }, []);

  useEffect(() => {
    async function loadStoredSession() {
      try {
        const [storedToken, storedUser] = await AsyncStorage.multiGet([
          ACCESS_TOKEN_KEY,
          USER_STORAGE_KEY,
        ]);

        const tokenVal = storedToken[1];
        const userVal = storedUser[1];

        // Une session sans rôle livreur (ancienne version de l'app) est abandonnée.
        if (tokenVal && !hasCourierRole(tokenVal)) {
          await AsyncStorage.multiRemove([
            ACCESS_TOKEN_KEY,
            REFRESH_TOKEN_KEY,
            USER_STORAGE_KEY,
          ]);
        } else if (tokenVal && userVal) {
          setToken(tokenVal);
          const storedUser = JSON.parse(userVal) as User;
          try {
            const profile = await profileService.getProfile();
            const hydratedUser = {
              ...storedUser,
              fullName:
                `${profile.first_name} ${profile.last_name}`.trim() ||
                storedUser.fullName,
              phone: profile.phone,
            };
            setUser(hydratedUser);
            await AsyncStorage.setItem(
              USER_STORAGE_KEY,
              JSON.stringify(hydratedUser),
            );
          } catch {
            setUser(storedUser);
          }
        }
      } catch (error) {
        console.error("Erreur chargement session :", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadStoredSession();
  }, []);

  const handleAuthSuccess = async (response: AuthApiResponse) => {
    if (!response.access_token) {
      throw new Error("Réponse d’authentification invalide.");
    }
    // L'application est réservée aux livreurs : on ne garde aucune session
    // pour un autre rôle, et on révoque le refresh token qui vient d'être émis.
    if (!hasCourierRole(response.access_token)) {
      await authService.revokeSession(response.refresh_token);
      throw new Error(NOT_COURIER_MESSAGE);
    }
    const userFromJwt = mapJwtToUser(response.access_token);

    // Les tokens doivent être en stockage avant tout appel authentifié
    // (apiClient les lit depuis AsyncStorage), sinon getProfile échoue.
    await AsyncStorage.multiSet([
      [ACCESS_TOKEN_KEY, response.access_token],
      [REFRESH_TOKEN_KEY, response.refresh_token || ""],
    ]);

    let hydratedUser = userFromJwt;
    try {
      const profile = await profileService.getProfile();
      hydratedUser = {
        ...userFromJwt,
        fullName:
          `${profile.first_name} ${profile.last_name}`.trim() ||
          userFromJwt.fullName,
        phone: profile.phone,
      };
    } catch (error) {
      console.warn("Profil distant indisponible, utilisation du JWT", error);
    }

    setUser(hydratedUser);
    setToken(response.access_token);

    await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(hydratedUser));
  };

  const login = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const response = await authService.login(data);
      await handleAuthSuccess(response);
    } catch (error: any) {
      Alert.alert(
        "Échec de la connexion",
        error.message || "Identifiants incorrects.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      setUser(null);
      setToken(null);
      await AsyncStorage.multiRemove([
        ACCESS_TOKEN_KEY,
        REFRESH_TOKEN_KEY,
        USER_STORAGE_KEY,
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: {
    fullName: string;
    email: string;
    phone: string;
  }) => {
    if (!user) return;
    const names = data.fullName.trim().split(/\s+/);
    const profile = await profileService.updateProfile({
      first_name: names.shift() || "",
      last_name: names.join(" "),
      phone: data.phone.trim(),
    });
    const updatedUser: User = {
      ...user,
      fullName: `${profile.first_name} ${profile.last_name}`.trim(),
      phone: profile.phone,
    };
    setUser(updatedUser);
    await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
  };

  const deleteAccount = async () => {
    await authService.deleteAccount();
    await logout();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        logout,
        updateProfile,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé au sein d’un AuthProvider");
  }
  return context;
}
