import { TouchableOpacity, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { profileStyles as styles } from "../styles/profile.styles";

interface ProfileMenuItemProps {
  iconName: keyof typeof Ionicons.glyphMap;
  title: string;
  onPress: () => void;
}

export default function ProfileMenuItem({
  iconName,
  title,
  onPress,
}: ProfileMenuItemProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.menuItem, { borderBottomColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.menuItemLeft}>
        <Ionicons name={iconName} size={20} color={colors.primary} />
        <Text style={[styles.menuItemText, { color: colors.textDark }]}>
          {title}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
    </TouchableOpacity>
  );
}
