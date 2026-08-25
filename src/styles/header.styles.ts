import { StyleSheet } from "react-native";
import { COLORS, RADIUS, SPACING } from "../constants/theme";

export const headerStyles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingBottom: 14,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: SPACING.sm,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm + 2,
  },
  logoBadge: {
    borderWidth: 1.5,
    borderColor: COLORS.accent,
    borderRadius: RADIUS.lg,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignItems: "center",
  },
  logoBadgeText: {
    color: COLORS.accent,
    fontSize: 9,
    fontWeight: "900",
    textAlign: "center",
  },
  brandTitle: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: "bold",
  },
  actionsRow: {
    flexDirection: "row",
    gap: SPACING.md,
  },
  iconButton: {
    position: "relative",
    padding: SPACING.xs,
  },
  badge: {
    position: "absolute",
    right: -2,
    top: -2,
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.round,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: COLORS.textDark,
    fontSize: 11,
    fontWeight: "bold",
  },
  searchBar: {
    backgroundColor: COLORS.inputBg,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    height: 42,
    marginTop: SPACING.xs,
    gap: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#2d3436",
  },
});
