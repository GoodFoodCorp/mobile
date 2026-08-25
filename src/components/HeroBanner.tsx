import { View, Text, ImageBackground, TouchableOpacity } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { heroBannerStyles as styles } from "../styles/heroBanner.styles";

interface HeroBannerProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  imageUri?: string;
  onOrderPress?: () => void;
}

export default function HeroBanner({
  title = "Bienvenue chez\nGood Food !",
  subtitle = "Les repas de qualité, à coté de chez vous !",
  buttonText = "Commander maintenant",
  imageUri = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
  onOrderPress,
}: HeroBannerProps) {
  const { colors } = useTheme();

  return (
    <ImageBackground source={{ uri: imageUri }} style={styles.banner}>
      <View
        style={[styles.overlay, { backgroundColor: `${colors.primaryDark}CC` }]}
      >
        <Text style={[styles.title, { color: colors.white }]}>{title}</Text>
        <Text style={[styles.subtitle, { color: colors.white }]}>
          {subtitle}
        </Text>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.accent }]}
          onPress={onOrderPress}
          activeOpacity={0.8}
        >
          <Text style={[styles.buttonText, { color: colors.primary }]}>
            {buttonText}
          </Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}
