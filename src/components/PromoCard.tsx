import { View, Text, TouchableOpacity } from "react-native";
import { promoCardStyles as styles } from "../styles/promoCard.styles";
import { useTheme } from "../context/ThemeContext";

interface PromoCardProps {
  discount?: string;
  subtitle?: string;
  onClaim?: () => void;
}

export default function PromoCard({
  discount = "20% de réduction",
  subtitle = "Sur votre première commande",
  onClaim,
}: PromoCardProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={styles.content}>
        <Text style={[styles.tag, { color: colors.textSecondary }]}>
          OFFRE SPÉCIALE
        </Text>
        <Text style={[styles.title, { color: colors.primary }]}>
          {discount}
        </Text>
        <Text style={[styles.subtitle, { color: colors.textDark }]}>
          {subtitle}
        </Text>
      </View>
      <TouchableOpacity
        style={[styles.btn, { backgroundColor: colors.accent }]}
        onPress={onClaim}
        activeOpacity={0.8}
      >
        <Text style={[styles.btnText, { color: colors.primary }]}>
          Commander
        </Text>
      </TouchableOpacity>
    </View>
  );
}
