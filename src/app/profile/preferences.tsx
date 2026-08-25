import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { useTheme } from "../../context/ThemeContext";
import { subscreenStyles as styles } from "../../styles/subscreens.styles";

export default function PreferencesScreen() {
  const router = useRouter();
  const { isDark, colors, toggleTheme } = useTheme();
  const [cutlery, setCutlery] = useState(true);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Barre supérieure */}
      <View style={[styles.topBar, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: colors.inputBg }]}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color={colors.textDark} />
        </TouchableOpacity>
        <Text style={[styles.topBarTitle, { color: colors.textDark }]}>
          Préférences
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Section Application */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          Application
        </Text>
        <View
          style={[
            styles.card,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <View style={styles.rowBetween}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.itemTitle, { color: colors.textDark }]}>
                Mode sombre
              </Text>
              <Text
                style={[styles.itemSubtitle, { color: colors.textSecondary }]}
              >
                {isDark ? "Mode sombre activé" : "Mode clair activé"}
              </Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: "#bdc3c7", true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
        </View>

        {/* Section Livraison */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          Livraison & Repas
        </Text>
        <View
          style={[
            styles.card,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <View style={styles.rowBetween}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.itemTitle, { color: colors.textDark }]}>
                Couverts et serviettes
              </Text>
              <Text
                style={[styles.itemSubtitle, { color: colors.textSecondary }]}
              >
                Inclure systématiquement des couverts jetables
              </Text>
            </View>
            <Switch
              value={cutlery}
              onValueChange={setCutlery}
              trackColor={{ false: "#bdc3c7", true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
