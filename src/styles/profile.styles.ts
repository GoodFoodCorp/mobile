import { StyleSheet } from "react-native";
import { COLORS, RADIUS, SPACING } from "../constants/theme";

export const profileStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: SPACING.xl + 10,
  },
  headerCard: {
    alignItems: "center",
    paddingVertical: SPACING.xl,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  avatarBadge: {
    width: 72,
    height: 72,
    borderRadius: RADIUS.round,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.md,
  },
  avatarText: {
    color: COLORS.accent,
    fontSize: 26,
    fontWeight: "bold",
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  userEmail: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  roleTag: {
    backgroundColor: COLORS.accentLight,
    paddingHorizontal: SPACING.md,
    paddingVertical: 4,
    borderRadius: RADIUS.round,
    marginTop: SPACING.sm,
  },
  roleText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.primaryDark,
    textTransform: "uppercase",
  },
  menuSection: {
    marginTop: SPACING.lg,
    paddingHorizontal: SPACING.lg,
  },
  menuTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
  },
  menuItemText: {
    fontSize: 15,
    color: COLORS.textDark,
    fontWeight: "500",
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.xl + 8,
    paddingVertical: 12,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: "#e74c3c",
    backgroundColor: "#fff",
  },
  logoutText: {
    color: "#e74c3c",
    fontSize: 15,
    fontWeight: "bold",
  },
});
