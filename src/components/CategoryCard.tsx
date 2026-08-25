import { Text, ImageBackground, TouchableOpacity } from "react-native";
import { Category } from "../types/food";
import { categoryCardStyles as styles } from "../styles/categoryCard.styles";
import { useTheme } from "../context/ThemeContext";

interface CategoryCardProps {
  category: Category;
  onPress?: (category: Category) => void;
}

export default function CategoryCard({ category, onPress }: CategoryCardProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress?.(category)}
      activeOpacity={0.8}
    >
      <ImageBackground
        source={{ uri: category.image }}
        style={styles.image}
        imageStyle={styles.imageRadius}
      >
        <Text style={[styles.text, { color: colors.white }]}>
          {category.title}
        </Text>
      </ImageBackground>
    </TouchableOpacity>
  );
}
