import { StyleSheet } from "react-native";
import { COLORS, RADIUS, SPACING } from "../constants/theme";

export const personalInfoStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.round,
    backgroundColor: COLORS.inputBg,
    alignItems: "center",
    justifyContent: "center",
  },
  topBarTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    paddingBottom: 40,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: SPACING.xl,
  },
  avatarBadge: {
    width: 80,
    height: 80,
    borderRadius: RADIUS.round,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.sm,
    position: "relative",
  },
  avatarText: {
    color: COLORS.accent,
    fontSize: 28,
    fontWeight: "bold",
  },
  editAvatarBtn: {
    position: "absolute",
    bottom: 0,
    right: -4,
    backgroundColor: COLORS.accent,
    width: 28,
    height: 28,
    borderRadius: RADIUS.round,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  form: {
    gap: SPACING.md,
  },
  saveBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    marginTop: SPACING.xl,
  },
  saveBtnText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "bold",
  },
  deleteBtn: {
    marginTop: SPACING.xl,
    paddingVertical: SPACING.sm,
    alignItems: "center",
  },
  deleteBtnText: {
    color: "#e74c3c",
    fontSize: 14,
    fontWeight: "600",
  },
});
