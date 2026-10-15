import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function TabLayout() {
  const { user } = useAuth();
  const { colors } = useTheme();

  const firstName = user?.fullName ? user.fullName.split(" ")[0] : null;
  const profileTabTitle = firstName ?? "Profil";

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.inactive,
        // Non connecté : l'accueil affiche la connexion en plein écran, sans onglets.
        tabBarStyle: user
          ? {
              backgroundColor: colors.surface,
              borderTopColor: colors.border,
              height: 65,
              paddingBottom: 10,
              paddingTop: 8,
              borderTopWidth: 1,
            }
          : { display: "none" },
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

      <Tabs.Screen
        name="delivery"
        options={{
          title: "Livraison",
          href: user ? "/delivery" : null,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="car-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: profileTabTitle,
          href: user ? "/profile" : null,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
