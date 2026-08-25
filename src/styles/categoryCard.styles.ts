import { StyleSheet } from "react-native";
import { COLORS, RADIUS, SPACING } from "../constants/theme";

export const categoryCardStyles = StyleSheet.create({
  card: {
    flex: 1,
    height: 100,
    margin: 6,
    borderRadius: RADIUS.lg,
    overflow: "hidden",
  },
  image: {
    flex: 1,
    justifyContent: "flex-end",
    padding: SPACING.sm + 2,
  },
  imageRadius: {
    borderRadius: RADIUS.lg,
  },
  text: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 16,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
});
