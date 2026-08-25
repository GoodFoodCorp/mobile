import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";
import { headerStyles as styles } from "../styles/header.styles";
import { useAuth } from "../context/AuthContext";

interface HeaderProps {
  cartCount?: number;
  onSearchChange?: (text: string) => void;
  onCartPress?: () => void;
  onFavoritesPress?: () => void;
}

export default function Header({
  cartCount = 0,
  onSearchChange,
  onCartPress,
  onFavoritesPress,
}: HeaderProps) {
  const { user, token } = useAuth();
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <SafeAreaView edges={["top"]}>
        <View style={styles.topRow}>
          <View style={styles.brandRow}>
            <View style={[styles.logoBadge, { borderColor: colors.accent }]}>
              <Text style={[styles.logoBadgeText, { color: colors.accent }]}>
                GOOD{"\n"}FOOD
              </Text>
            </View>
            <Text style={[styles.brandTitle, { color: colors.white }]}>
              Good Food
            </Text>
          </View>

          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={onFavoritesPress}
            >
              <Ionicons name="heart-outline" size={24} color={colors.white} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconButton} onPress={onCartPress}>
              <Ionicons name="cart-outline" size={24} color={colors.white} />
              {cartCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{cartCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={colors.textSecondary} />
          <TextInput
            placeholder="Rechercher..."
            placeholderTextColor={colors.textSecondary}
            style={[styles.searchInput, { color: colors.textDark }]}
            onChangeText={onSearchChange}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}
