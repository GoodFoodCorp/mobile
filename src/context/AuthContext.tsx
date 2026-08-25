import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  User,
  LoginFormData,
  RegisterFormData,
  AuthResponse,
} from "../types/auth";
import { BecomeDeliveryFormData } from "../types/delivery";

const USER_STORAGE_KEY = "@goodfood_user_session";
const TOKEN_STORAGE_KEY = "@goodfood_auth_token";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (data: LoginFormData) => Promise<void>;
  register: (data: RegisterFormData) => Promise<void>;
  logout: () => Promise<void>;
  upgradeToDelivery: (data: BecomeDeliveryFormData) => Promise<void>;
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
          TOKEN_STORAGE_KEY,
          USER_STORAGE_KEY,
        ]);

        const tokenVal = storedToken[1];
        const userVal = storedUser[1];

        if (tokenVal && userVal) {
          setToken(tokenVal);
          setUser(JSON.parse(userVal));
        }
      } catch (error) {
        console.error("Erreur lors du chargement de la session :", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadStoredSession();
  }, []);

  const handleAuthSuccess = async (response: AuthResponse) => {
    setUser(response.user);
    setToken(response.token);

    await AsyncStorage.multiSet([
      [TOKEN_STORAGE_KEY, response.token],
      [USER_STORAGE_KEY, JSON.stringify(response.user)],
    ]);
  };

  const login = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      // Simulation d'un retour d'API
      const mockResponse: AuthResponse = {
        token: "jwt_token_async_storage_123",
        user: {
          id: "usr_101",
          fullName: "Jean Dupont",
          email: data.email,
          role: {
            id: "role_client",
            name: "Livreur",
          },
          createdAt: new Date().toISOString(),
        },
      };

      await handleAuthSuccess(mockResponse);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      // Simulation d'un retour d'API
      const mockResponse: AuthResponse = {
        token: "jwt_token_async_storage_456",
        user: {
          id: "usr_102",
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          role: {
            id: "role_client",
            name: "Livreur",
          },
          createdAt: new Date().toISOString(),
        },
      };

      await handleAuthSuccess(mockResponse);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      setUser(null);
      setToken(null);
      await AsyncStorage.multiRemove([TOKEN_STORAGE_KEY, USER_STORAGE_KEY]);
    } finally {
      setIsLoading(false);
    }
  };

  const upgradeToDelivery = async (data: BecomeDeliveryFormData) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const updatedUser: User = {
        ...user,
        role: {
          id: "role_delivery",
          name: "Livreur",
        },
      };

      setUser(updatedUser);
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
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

    setIsLoading(true);
    try {
      const updatedUser: User = {
        ...user,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
      };

      setUser(updatedUser);
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
    } finally {
      setIsLoading(false);
    }
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
        upgradeToDelivery,
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
