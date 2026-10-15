import { View, ActivityIndicator } from "react-native";

import DeliveryHomeView from "../../components/DeliveryHomeView";
import LoginView from "../../components/LoginView";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

/** Accueil : connexion si non connecté, sinon les commandes à prendre en charge. */
export default function HomeScreen() {
  const { user, isLoading } = useAuth();
  const { colors } = useTheme();

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return user ? <DeliveryHomeView user={user} /> : <LoginView />;
}
