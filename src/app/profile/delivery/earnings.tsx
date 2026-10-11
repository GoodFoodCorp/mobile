import { useEffect, useState } from "react";
import { Alert, View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { useTheme } from "../../../context/ThemeContext";
import { deliverySpaceStyles as styles } from "../../../styles/deliverySpace.styles";
import { courierService } from "../../../services/courierService";

export default function EarningsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [earnings, setEarnings] = useState({
    availableBalance: 0,
    totalEarned: 0,
    completedTrips: 0,
  });

  useEffect(() => {
    courierService
      .getEarnings()
      .then(setEarnings)
      .catch((error: any) => Alert.alert("Gains indisponibles", error.message));
  }, []);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={[styles.topBar, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: colors.inputBg }]}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={22} color={colors.primary} />
        </TouchableOpacity>
        <Text style={[styles.topBarTitle, { color: colors.primary }]}>
          Historique des gains
        </Text>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.balanceCard, { backgroundColor: colors.primary }]}>
          <Text style={[styles.balanceLabel, { color: colors.accentLight }]}>
            Solde disponible
          </Text>
          <Text style={[styles.balanceAmount, { color: colors.white }]}>
            {earnings.availableBalance.toFixed(2).replace(".", ",")} €
          </Text>
        </View>
        <Text style={styles.sectionTitle}>
          Total gagné : {earnings.totalEarned.toFixed(2).replace(".", ",")} €
        </Text>
        <View
          style={[
            styles.infoCard,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.tripMeta, { color: colors.textSecondary }]}>
            Courses terminées
          </Text>
          <Text style={[styles.balanceAmount, { color: colors.primary }]}>
            {earnings.completedTrips}
          </Text>
        </View>
        {earnings.completedTrips === 0 && (
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            Aucune course rémunérée pour le moment.
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
