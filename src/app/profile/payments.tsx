import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { useTheme } from "../../context/ThemeContext";
import { subscreenStyles as styles } from "../../styles/subscreens.styles";

export default function PaymentsScreen() {
  const router = useRouter();
  const [cards] = useState([
    {
      id: "1",
      brand: "Mastercard",
      last4: "4242",
      exp: "08/28",
      isDefault: true,
    },
    { id: "2", brand: "Visa", last4: "8890", exp: "12/26", isDefault: false },
  ]);
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
          Moyens de paiement
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {cards.map((c) => (
          <View
            key={c.id}
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
                  name="card-outline"
                  size={22}
                  color={colors.primary}
                />
                <Text style={[styles.itemTitle, { color: colors.textDark }]}>
                  {c.brand} •••• {c.last4}
                </Text>
              </View>
              {c.isDefault && (
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
                { marginLeft: 32, color: colors.textSecondary },
              ]}
            >
              Expire fin {c.exp}
            </Text>
          </View>
        ))}

        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: colors.primary }]}
          activeOpacity={0.8}
        >
          <Text style={styles.actionBtnText}>Ajouter une carte</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
