import { StyleSheet } from "react-native";
import { COLORS, RADIUS, SPACING } from "../constants/theme";

export const deliveryHomeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: SPACING.xl + 20,
  },
  statusHeader: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
  },
  statusTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greetingText: {
    color: "#a3cbbe",
    fontSize: 13,
  },
  driverName: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: "bold",
  },
  onlineToggleWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: RADIUS.round,
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: RADIUS.round,
  },
  statusDotOnline: {
    backgroundColor: "#2ecc71",
  },
  statusDotOffline: {
    backgroundColor: "#e74c3c",
  },
  statusLabelText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "600",
  },
  // Statistiques du jour
  statsGrid: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.lg,
    marginTop: -20,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
  },
  statItemLast: {
    borderRightWidth: 0,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  // Alertes / Zone
  zoneAlert: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fef9e7",
    borderWidth: 1,
    borderColor: "#f9e79f",
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    gap: 10,
  },
  zoneAlertText: {
    flex: 1,
    fontSize: 12,
    color: "#7d6608",
    lineHeight: 16,
  },
  // Carte de mission disponible
  orderCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.lg,
    marginVertical: 6,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  orderCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  orderNumber: {
    fontSize: 13,
    fontWeight: "bold",
    color: COLORS.textSecondary,
  },
  earningsTag: {
    backgroundColor: "#e8f5e9",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
  },
  earningsText: {
    color: "#27ae60",
    fontWeight: "bold",
    fontSize: 15,
  },
  routeStep: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginVertical: 4,
  },
  routeStepText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textDark,
  },
  routeStepSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: SPACING.md,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  orderDistanceMeta: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  acceptBtn: {
    backgroundColor: COLORS.accent,
    paddingVertical: 8,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.md,
  },
  acceptBtnText: {
    color: COLORS.primaryDark,
    fontWeight: "bold",
    fontSize: 13,
  },
  offlinePlaceholder: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    paddingHorizontal: SPACING.xl,
  },
  offlineTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.textDark,
    marginTop: 12,
  },
  offlineSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: 4,
  },
});
