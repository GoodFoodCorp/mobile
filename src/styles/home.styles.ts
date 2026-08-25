import { StyleSheet } from "react-native";
import { COLORS, SPACING } from "../constants/theme";

export const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: SPACING.xl + 4,
  },
  sectionHeader: {
    paddingHorizontal: SPACING.lg,
    marginTop: 18,
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  seeAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  seeAllText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "600",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 10,
  },
  gridItem: {
    width: "50%",
  },
});
