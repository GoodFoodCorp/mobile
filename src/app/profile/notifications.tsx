import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { notificationService } from "../../services/notificationService";
import { useTheme } from "../../context/ThemeContext";
import { subscreenStyles as styles } from "../../styles/subscreens.styles";

const STORAGE_KEY = "@goodfood_notifications_prefs";

interface NotificationPrefs {
  orderTracking: boolean;
  promos: boolean;
  newsletter: boolean;
}

export default function NotificationsScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const [prefs, setPrefs] = useState<NotificationPrefs>({
    orderTracking: true,
    promos: false,
    newsletter: true,
  });

  useEffect(() => {
    async function loadPreferences() {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) {
        setPrefs(JSON.parse(saved));
      }
    }
    loadPreferences();
  }, []);

  const togglePreference = async (key: keyof NotificationPrefs) => {
    const nextState = !prefs[key];

    // Si on active le suivi et qu'aucune permission n'a été accordée
    if (nextState && (key === "orderTracking" || key === "promos")) {
      const token = await notificationService.registerForPushNotifications();
      if (!token && nextState) {
        Alert.alert(
          "Notifications désactivées",
          "Veuillez activer les notifications dans les réglages de votre téléphone pour recevoir des alertes.",
        );
      }
    }

    const updated = { ...prefs, [key]: nextState };
    setPrefs(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

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
          <Ionicons name="arrow-back" size={22} color={colors.textDark} />
        </TouchableOpacity>
        <Text style={[styles.topBarTitle, { color: colors.textDark }]}>
          Notifications
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.card,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <View style={styles.rowBetween}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <Text style={[styles.itemTitle, { color: colors.textDark }]}>
                Suivi des commandes
              </Text>
              <Text
                style={[styles.itemSubtitle, { color: colors.textSecondary }]}
              >
                Statut en temps réel (préparation, en livraison, livrée)
              </Text>
            </View>
            <Switch
              value={prefs.orderTracking}
              onValueChange={() => togglePreference("orderTracking")}
              trackColor={{ false: "#bdc3c7", true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
        </View>

        <View
          style={[
            styles.card,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <View style={styles.rowBetween}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <Text style={[styles.itemTitle, { color: colors.textDark }]}>
                Offres et promotions
              </Text>
              <Text
                style={[styles.itemSubtitle, { color: colors.textSecondary }]}
              >
                Bons de réduction et promotions du jour
              </Text>
            </View>
            <Switch
              value={prefs.promos}
              onValueChange={() => togglePreference("promos")}
              trackColor={{ false: "#bdc3c7", true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
        </View>

        <View
          style={[
            styles.card,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <View style={styles.rowBetween}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <Text style={[styles.itemTitle, { color: colors.textDark }]}>
                Nouveautés menu
              </Text>
              <Text
                style={[styles.itemSubtitle, { color: colors.textSecondary }]}
              >
                Nouveaux plats saisonniers et restaurants partenaires
              </Text>
            </View>
            <Switch
              value={prefs.newsletter}
              onValueChange={() => togglePreference("newsletter")}
              trackColor={{ false: "#bdc3c7", true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
