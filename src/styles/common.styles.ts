import { StyleSheet } from "react-native";
import { COLORS, RADIUS, SPACING } from "../constants/theme";

export const commonStyles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  rowCenter: {
    flexDirection: "row",
    alignItems: "center",
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardShadow: {
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  primaryBtn: {
    backgroundColor: COLORS.accent,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnText: {
    color: COLORS.primary,
    fontWeight: "bold",
    fontSize: 14,
  },
});
