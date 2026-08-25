import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SPACING } from "../constants/theme";
import { commonStyles } from "../styles/common.styles";
import { useTheme } from "../context/ThemeContext";

interface SectionHeaderProps {
  title: string;
  actionText?: string;
  onActionPress?: () => void;
}

export default function SectionHeader({
  title,
  actionText,
  onActionPress,
}: SectionHeaderProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, commonStyles.rowBetween]}>
      <Text style={[styles.title, { color: colors.primary }]}>{title}</Text>

      {actionText && (
        <TouchableOpacity
          style={commonStyles.rowCenter}
          onPress={onActionPress}
          activeOpacity={0.7}
        >
          <Text style={[styles.actionText, { color: colors.primary }]}>
            {actionText}
          </Text>
          <Ionicons name="chevron-forward" size={14} color={colors.primary} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.lg,
    marginTop: 18,
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  actionText: {
    fontSize: 14,
    fontWeight: "600",
    marginRight: 2,
  },
});
