import { TouchableOpacity, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { commonStyles } from "../styles/common.styles";
import { locationStyles as styles } from "../styles/location.styles";

interface LocationSelectorProps {
  address: string;
  onPress?: () => void;
}

export default function LocationSelector({
  address,
  onPress,
}: LocationSelectorProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderWidth: 1,
          borderRadius: 12,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Ionicons name="location-outline" size={22} color={colors.primary} />
      <View style={styles.textContainer}>
        <Text style={[styles.subtext, { color: colors.textSecondary }]}>
          Restaurant :
        </Text>
        <View style={commonStyles.rowCenter}>
          <Text style={[styles.location, { color: colors.primary }]}>
            {address}
          </Text>
          <Ionicons name="chevron-forward" size={16} color={colors.primary} />
        </View>
      </View>
    </TouchableOpacity>
  );
}
