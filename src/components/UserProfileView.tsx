import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { User } from "../types/auth";
import ProfileMenuItem from "./ProfileMenuItem";
import { profileStyles as styles } from "../styles/profile.styles";
import { router } from "expo-router";
import { useTheme } from "../context/ThemeContext";

interface UserProfileViewProps {
  user: User;
  onLogout: () => void;
}

export default function UserProfileView({
  user,
  onLogout,
}: UserProfileViewProps) {
  const { colors } = useTheme();
  const initials = user.fullName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const isDelivery = user.role.name.toLowerCase() === "livreur";
  const isClient = user.role.name.toLowerCase() === "client";

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Carte identité */}
      <View
        style={[
          styles.headerCard,
          { backgroundColor: colors.surface, borderBottomColor: colors.border },
        ]}
      >
        <View style={styles.avatarBadge}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <Text style={[styles.userName, { color: colors.primary }]}>
          {user.fullName}
        </Text>
        <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
          {user.email}
        </Text>
        {user.phone && (
          <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
            {user.phone}
          </Text>
        )}

        <View style={[styles.roleTag, { backgroundColor: colors.accentLight }]}>
          <Text style={[styles.roleText, { color: colors.primaryDark }]}>
            {user.role.name}
          </Text>
        </View>
      </View>

      {/* Menu spécifique Livreur */}
      {isDelivery && (
        <View style={styles.menuSection}>
          <Text style={styles.menuTitle}>Espace Livreur</Text>
          <ProfileMenuItem
            iconName="bicycle-outline"
            title="Mon véhicule et statut"
            onPress={() => router.push("/profile/delivery/vehicleStatus")}
          />
          <ProfileMenuItem
            iconName="cash-outline"
            title="Historique des gains"
            onPress={() => router.push("/profile/delivery/earnings")}
          />
        </View>
      )}

      {/* Menu Compte général */}
      <View style={styles.menuSection}>
        <Text style={styles.menuTitle}>Compte</Text>
        <ProfileMenuItem
          iconName="person-outline"
          title="Mes infos personnelles"
          onPress={() => router.push("/profile/personalInfo")}
        />
        <ProfileMenuItem
          iconName="location-outline"
          title="Mes adresses"
          onPress={() => router.push("/profile/addresses")}
        />
        <ProfileMenuItem
          iconName="card-outline"
          title="Moyens de paiement"
          onPress={() => router.push("/profile/payments")}
        />
        <ProfileMenuItem
          iconName="notifications-outline"
          title="Notifications"
          onPress={() => router.push("/profile/notifications")}
        />
        <ProfileMenuItem
          iconName="lock-closed-outline"
          title="Sécurité & Mot de passe"
          onPress={() => router.push("/profile/security")}
        />
        <ProfileMenuItem
          iconName="settings-outline"
          title="Préférences"
          onPress={() => router.push("/profile/preferences")}
        />
        {isClient && (
          <ProfileMenuItem
            iconName="bicycle-outline"
            title="Devenir Livreur"
            onPress={() => router.push("/profile/becomeDelivery")}
          />
        )}
      </View>

      {/* Déconnexion */}
      <TouchableOpacity
        style={[
          styles.logoutBtn,
          { backgroundColor: colors.surface, borderColor: "#e74c3c" },
        ]}
        onPress={onLogout}
        activeOpacity={0.8}
      >
        <Ionicons name="log-out-outline" size={18} color="#e74c3c" />
        <Text style={styles.logoutText}>Se déconnecter</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
