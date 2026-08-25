import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { useTheme } from "../../context/ThemeContext";
import { subscreenStyles as styles } from "../../styles/subscreens.styles";

const INITIAL_ADDRESSES = [
  {
    id: "1",
    label: "Domicile",
    address: "12 Rue de la République, 75001 Paris",
    isDefault: true,
    icon: "home-outline",
  },
  {
    id: "2",
    label: "Travail",
    address: "45 Avenue des Champs-Élysées, 75008 Paris",
    isDefault: false,
    icon: "business-outline",
  },
];

export default function AddressesScreen() {
  const router = useRouter();
  const [addresses] = useState(INITIAL_ADDRESSES);
  const { colors } = useTheme();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={[styles.topBar, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: colors.inputBg }]}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color={colors.primary} />
        </TouchableOpacity>
        <Text style={[styles.topBarTitle, { color: colors.primary }]}>
          Mes adresses
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {addresses.map((item) => (
          <View
            key={item.id}
            style={[
              styles.card,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <View style={styles.rowBetween}>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
              >
                <Ionicons
                  name={item.icon as any}
                  size={20}
                  color={colors.primary}
                />
                <Text style={[styles.itemTitle, { color: colors.textDark }]}>
                  {item.label}
                </Text>
              </View>
              {item.isDefault && (
                <View
                  style={[
                    styles.badgeDefault,
                    { backgroundColor: colors.accentLight },
                  ]}
                >
                  <Text style={styles.badgeDefaultText}>Par défaut</Text>
                </View>
              )}
            </View>
            <Text
              style={[
                styles.itemSubtitle,
                { marginLeft: 30, color: colors.textSecondary },
              ]}
            >
              {item.address}
            </Text>
          </View>
        ))}

        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: colors.primary }]}
          activeOpacity={0.8}
        >
          <Text style={styles.actionBtnText}>Ajouter une adresse</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
