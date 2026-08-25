export const LIGHT_COLORS = {
  primary: "#03452c",
  primaryDark: "#02301f",
  accent: "#f5b800",
  accentLight: "#fbc531",
  white: "#ffffff",
  background: "#ffffff",
  surface: "#ffffff",
  border: "#f1f2f6",
  inputBg: "#e6eaeb",
  textPrimary: "#03452c",
  textDark: "#000000",
  textSecondary: "#7f8c8d",
  textMuted: "#576574",
  inactive: "#8395a7",
} as const;

export const DARK_COLORS = {
  primary: "#056642",
  primaryDark: "#011a11",
  accent: "#f5b800",
  accentLight: "#fbc531",
  white: "#ffffff",
  background: "#121212",
  surface: "#1e1e1e",
  border: "#2c2c2c",
  inputBg: "#2a2a2a",
  textPrimary: "#4cd9a1",
  textDark: "#f5f6fa",
  textSecondary: "#a4b0be",
  textMuted: "#747d8c",
  inactive: "#57606f",
} as const;

export type ThemeColors = {
  [K in keyof typeof LIGHT_COLORS]: string;
};

// Rétrocompatibilité par défaut
export const COLORS = LIGHT_COLORS;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
} as const;

export const RADIUS = {
  sm: 6,
  md: 8,
  lg: 12,
  xl: 14,
  round: 9999,
} as const;
