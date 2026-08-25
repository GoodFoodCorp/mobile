import { View, ScrollView } from "react-native";

import Header from "../../components/Header";
import HeroBanner from "../../components/HeroBanner";
import LocationSelector from "../../components/LocationSelector";
import PromoCard from "../../components/PromoCard";
import SectionHeader from "../../components/SectionHeader";
import CategoryCard from "../../components/CategoryCard";
import DishCard from "../../components/DishCard";
import DeliveryHomeView from "../../components/DeliveryHomeView";

import { useAuth } from "../../context/AuthContext";

import { useTheme } from "../../context/ThemeContext";
import { Category, Dish } from "../../types/food";
import { homeStyles as styles } from "../../styles/home.styles";

import { notificationService } from "../../services/notificationService";
import { Text, TouchableOpacity } from "react-native";

const CATEGORIES: Category[] = [
  {
    id: "1",
    title: "Burgers",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400",
  },
  {
    id: "2",
    title: "Pizzas",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400",
  },
  {
    id: "3",
    title: "Salades",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400",
  },
  {
    id: "4",
    title: "Desserts",
    image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=400",
  },
];

const POPULAR_DISHES: Dish[] = [
  {
    id: "1",
    name: "Burger Deluxe",
    description: "Steak haché, cheddar, bacon, oignons caramélisés",
    rating: 4.8,
    time: "20-30 min",
    price: 12.99,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400",
  },
  {
    id: "2",
    name: "Pizza Margherita",
    description: "Mozzarella, tomates fraîches, basilic",
    rating: 4.9,
    time: "20-30 min",
    price: 14.99,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400",
  },
  {
    id: "3",
    name: "Salade César",
    description: "Poulet grillé, parmesan, croûtons, sauce César",
    rating: 4.7,
    time: "20-30 min",
    price: 9.99,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400",
  },
  {
    id: "4",
    name: "Fondant au Chocolat",
    description: "Cœur coulant, glace vanille",
    rating: 4.9,
    time: "20-30 min",
    price: 6.99,
    image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=400",
  },
];

export default function HomeScreen() {
  const { user } = useAuth();
  const { colors } = useTheme();
  const isDelivery = user?.role?.name?.toLowerCase() === "livreur";

  // 1. Vue spécifique LIVREUR
  if (user && isDelivery) {
    return <DeliveryHomeView user={user} />;
  }

  // 2. Vue standard CLIENT / NON CONNECTÉ
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <HeroBanner onOrderPress={() => {}} />

        <LocationSelector
          address="Paris République, 75001"
          onPress={() => {}}
        />

        <PromoCard onClaim={() => {}} />

        <SectionHeader title="Nos Menus" />

        <View style={styles.gridContainer}>
          {CATEGORIES.map((category) => (
            <View key={category.id} style={styles.gridItem}>
              <CategoryCard category={category} onPress={() => {}} />
            </View>
          ))}
        </View>

        <SectionHeader
          title="Plats Populaires"
          actionText="Voir tout"
          onActionPress={() => {}}
        />

        {POPULAR_DISHES.map((dish) => (
          <DishCard key={dish.id} dish={dish} />
        ))}
      </ScrollView>
    </View>
  );
}
