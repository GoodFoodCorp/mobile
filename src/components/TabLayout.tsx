import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function TabLayout() {
  const { user } = useAuth();
  const { colors } = useTheme();

  const firstName = user?.fullName ? user.fullName.split(" ")[0] : null;
  const profileTabTitle = firstName ?? "Connexion / Inscription";

  // Détection des rôles (en ignorant la casse)
  const roleName = user?.role?.name?.toLowerCase();
  const isClient = roleName === "client";
  const isDelivery = roleName === "livreur";

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.inactive,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 65,
          paddingBottom: 10,
          paddingTop: 8,
          borderTopWidth: 1,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "500",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Accueil",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />

      {/* Visible uniquement si connecté ET rôle Client */}
      <Tabs.Screen
        name="orders"
        options={{
          title: "Commandes",
          href: isClient ? "/orders" : null,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cube-outline" size={size} color={color} />
          ),
        }}
      />

      {/* Visible uniquement si connecté ET rôle Livreur */}
      <Tabs.Screen
        name="delivery"
        options={{
          title: "Livraison",
          href: isDelivery ? "/delivery" : null,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="car-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: profileTabTitle,
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name={user ? "person" : "person-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
