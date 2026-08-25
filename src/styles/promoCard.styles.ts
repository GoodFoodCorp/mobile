import { StyleSheet } from "react-native";
import { COLORS, RADIUS, SPACING } from "../constants/theme";

export const promoCardStyles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.accentLight,
    marginHorizontal: SPACING.lg,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: SPACING.sm + 2,
  },
  content: {
    flex: 1,
  },
  tag: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: "600",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.textDark,
    marginVertical: 2,
  },
  subtitle: {
    fontSize: 12,
    color: "#2f3542",
  },
  btn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.md,
  },
  btnText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 13,
  },
});
