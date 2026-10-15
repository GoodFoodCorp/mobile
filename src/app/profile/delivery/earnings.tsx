import { useEffect, useState } from "react";
import { Alert, View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { useTheme } from "../../../context/ThemeContext";
import { deliverySpaceStyles as styles } from "../../../styles/deliverySpace.styles";
import { deliveryService } from "../../../services/deliveryService";
import { CourierHistory } from "../../../types/delivery";

export default function EarningsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [history, setHistory] = useState<CourierHistory>({
    totalEarned: 0,
    availableBalance: 0,
    completedTrips: 0,
    trips: [],
  });

  useEffect(() => {
    deliveryService
      .getHistory()
      .then(setHistory)
      .catch((error: any) => Alert.alert("Gains indisponibles", error.message));
  }, []);

  const formatEuro = (value: number) =>
    `${value.toFixed(2).replace(".", ",")} €`;
  const formatDate = (iso: string | null) =>
    iso
      ? new Date(iso).toLocaleString("fr-FR", {
          day: "2-digit",
          month: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "";

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
            {formatEuro(history.availableBalance)}
          </Text>
        </View>
        <Text style={styles.sectionTitle}>
          Total gagné : {formatEuro(history.totalEarned)}
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
            {history.completedTrips}
          </Text>
        </View>
        {history.trips.length === 0 ? (
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            Aucune course rémunérée pour le moment.
          </Text>
        ) : (
          history.trips.map((trip) => (
            <View key={trip.id} style={styles.tripCard}>
              <View style={[styles.tripLeft, { flex: 1, paddingRight: 12 }]}>
                <Text
                  style={[styles.tripRestaurant, { color: colors.textDark }]}
                  numberOfLines={1}
                >
                  {trip.pickupAddress}
                </Text>
                <Text
                  style={[styles.tripMeta, { color: colors.textSecondary }]}
                  numberOfLines={1}
                >
                  → {trip.dropoffAddress}
                </Text>
                <Text
                  style={[styles.tripMeta, { color: colors.textSecondary }]}
                >
                  {formatDate(trip.deliveredAt)}
                </Text>
              </View>
              <Text style={[styles.tripAmount, { color: colors.primary }]}>
                +{formatEuro(trip.amount)}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
