import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LIGHT_COLORS, DARK_COLORS, ThemeColors } from "../constants/theme";

const THEME_STORAGE_KEY = "@goodfood_theme_mode";

interface ThemeContextType {
  isDark: boolean;
  colors: ThemeColors;
  toggleTheme: () => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    async function loadTheme() {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme !== null) {
          setIsDark(savedTheme === "dark");
        }
      } catch (error) {
        console.error("Erreur lors du chargement du thème :", error);
      }
    }
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const nextValue = !isDark;
    setIsDark(nextValue);
    await AsyncStorage.setItem(THEME_STORAGE_KEY, nextValue ? "dark" : "light");
  };

  const colors = isDark ? DARK_COLORS : LIGHT_COLORS;

  return (
    <ThemeContext.Provider value={{ isDark, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme doit être utilisé au sein d’un ThemeProvider");
  }
  return context;
}
