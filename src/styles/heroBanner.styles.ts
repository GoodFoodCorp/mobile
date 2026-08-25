import { StyleSheet } from "react-native";
import { COLORS, RADIUS, SPACING } from "../constants/theme";

export const heroBannerStyles = StyleSheet.create({
  banner: {
    width: "100%",
    height: 220,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(3, 69, 44, 0.72)",
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.xl,
  },
  title: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    color: "#f1f2f6",
    fontSize: 13,
    marginTop: 6,
    textAlign: "center",
  },
  button: {
    backgroundColor: COLORS.accent,
    paddingVertical: SPACING.md,
    paddingHorizontal: 24,
    borderRadius: RADIUS.md,
    marginTop: SPACING.lg,
  },
  buttonText: {
    color: COLORS.primary,
    fontWeight: "bold",
    fontSize: 14,
  },
});
