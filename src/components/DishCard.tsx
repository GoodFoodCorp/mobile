import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Dish } from "../types/food";
import { useTheme } from "../context/ThemeContext";
import { commonStyles } from "../styles/common.styles";
import { dishCardStyles as styles } from "../styles/dishCard.styles";

interface DishCardProps {
  dish: Dish;
  onAdd?: (dish: Dish) => void;
  onFavorite?: (dish: Dish) => void;
}

export default function DishCard({ dish, onAdd, onFavorite }: DishCardProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      <Image source={{ uri: dish.image }} style={styles.image} />

      <View style={styles.details}>
        <View style={commonStyles.rowBetween}>
          <Text style={[styles.title, { color: colors.primary }]}>
            {dish.name}
          </Text>
          <TouchableOpacity onPress={() => onFavorite?.(dish)}>
            <Ionicons
              name="heart-outline"
              size={18}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        <Text
          style={[styles.description, { color: colors.textSecondary }]}
          numberOfLines={2}
        >
          {dish.description}
        </Text>

        <View style={commonStyles.rowCenter}>
          <Ionicons name="star" size={14} color={colors.accent} />
          <Text style={styles.metaText}>{dish.rating.toFixed(1)}</Text>
          <Ionicons
            name="time-outline"
            size={14}
            color={colors.textSecondary}
            style={{ marginLeft: 8 }}
          />
          <Text style={styles.metaText}>{dish.time}</Text>
        </View>

        <View style={commonStyles.rowBetween}>
          <Text style={[styles.price, { color: colors.primary }]}>
            {dish.price.toFixed(2)} €
          </Text>
          <TouchableOpacity
            style={[styles.addBtn, { backgroundColor: colors.accent }]}
            onPress={() => onAdd?.(dish)}
            activeOpacity={0.8}
          >
            <Text style={[styles.addBtnText, { color: colors.primary }]}>
              Ajouter
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
