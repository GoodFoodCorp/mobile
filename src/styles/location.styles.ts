// src/styles/location.styles.ts
import { StyleSheet } from "react-native";
import { COLORS, SPACING } from "../constants/theme";

export const locationStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    paddingVertical: 14,
    gap: SPACING.sm,
  },
  textContainer: {
    flex: 1,
  },
  subtext: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  location: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: "bold",
  },
});
