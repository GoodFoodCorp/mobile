import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

import {
  User,
  LoginFormData,
  RegisterFormData,
  AuthApiResponse,
} from "../types/auth";
import { authService } from "../services/authService";
import { mapJwtToUser } from "../utils/jwt";

const USER_STORAGE_KEY = "@goodfood_user_session";
const ACCESS_TOKEN_KEY = "@goodfood_auth_token";
const REFRESH_TOKEN_KEY = "@goodfood_refresh_token";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (data: LoginFormData) => Promise<void>;
  register: (data: RegisterFormData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: {
    fullName: string;
    email: string;
    phone: string;
  }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStoredSession() {
      try {
        const [storedToken, storedUser] = await AsyncStorage.multiGet([
          ACCESS_TOKEN_KEY,
          USER_STORAGE_KEY,
        ]);

        const tokenVal = storedToken[1];
        const userVal = storedUser[1];

        if (tokenVal && userVal) {
          setToken(tokenVal);
          setUser(JSON.parse(userVal));
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
    const userFromJwt = mapJwtToUser(response.access_token);

    setUser(userFromJwt);
    setToken(response.access_token);

    await AsyncStorage.multiSet([
      [ACCESS_TOKEN_KEY, response.access_token],
      [REFRESH_TOKEN_KEY, response.refresh_token],
      [USER_STORAGE_KEY, JSON.stringify(userFromJwt)],
    ]);
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

  const register = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      const response = await authService.register(data);
      await handleAuthSuccess(response);
    } catch (error: any) {
      Alert.alert(
        "Échec de l’inscription",
        error.message || "Une erreur est survenue.",
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
    const updatedUser: User = { ...user, ...data };
    setUser(updatedUser);
    await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
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
