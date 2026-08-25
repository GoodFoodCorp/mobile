import { StyleSheet } from "react-native";
import { COLORS, RADIUS, SPACING } from "../constants/theme";

export const deliverySpaceStyles = StyleSheet.create({
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
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
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
  // Bloc de statut Actif / Inactif
  statusCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    backgroundColor: "#f6faf8",
    borderWidth: 1,
    borderColor: "#cce6db",
    marginBottom: SPACING.lg,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  statusSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
    marginTop: SPACING.md,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  // Sélecteur de véhicule
  vehicleRow: {
    flexDirection: "row",
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  vehicleBtn: {
    flex: 1,
    alignItems: "center",
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.inputBg,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: "transparent",
    gap: 6,
  },
  vehicleBtnActive: {
    borderColor: COLORS.primary,
    backgroundColor: "#e8f5e9",
  },
  vehicleBtnText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  vehicleBtnTextActive: {
    color: COLORS.primary,
    fontWeight: "bold",
  },
  // Bloc d'information / Liste
  infoCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    gap: SPACING.md,
  },
  infoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textDark,
  },
  // Page Gains (Earnings)
  balanceCard: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: "center",
    marginBottom: SPACING.lg,
  },
  balanceLabel: {
    fontSize: 13,
    color: "#a3cbbe",
    fontWeight: "600",
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: "bold",
    color: COLORS.white,
    marginVertical: 4,
  },
  payoutBtn: {
    backgroundColor: COLORS.accent,
    paddingVertical: 10,
    paddingHorizontal: SPACING.xl,
    borderRadius: RADIUS.md,
    marginTop: SPACING.md,
  },
  payoutBtnText: {
    color: COLORS.primaryDark,
    fontWeight: "bold",
    fontSize: 13,
  },
  // Graphique simplifié des gains
  chartContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 140,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  chartColumn: {
    alignItems: "center",
    flex: 1,
  },
  chartBarWrapper: {
    height: 90,
    width: 14,
    backgroundColor: COLORS.inputBg,
    borderRadius: RADIUS.round,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  chartBarFill: {
    backgroundColor: COLORS.accent,
    width: "100%",
    borderRadius: RADIUS.round,
  },
  chartDay: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 6,
  },
  // Course / Historique
  tripCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tripLeft: {
    gap: 4,
  },
  tripRestaurant: {
    fontSize: 15,
    fontWeight: "bold",
    color: COLORS.textDark,
  },
  tripMeta: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  tripRight: {
    alignItems: "flex-end",
  },
  tripAmount: {
    fontSize: 15,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  tripTip: {
    fontSize: 11,
    color: "#27ae60",
    fontWeight: "600",
  },
});
