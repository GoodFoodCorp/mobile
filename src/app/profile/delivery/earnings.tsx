import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { DeliveryTrip, WeeklyEarning } from "../../../types/delivery";
import { useTheme } from "../../../context/ThemeContext";
import { deliverySpaceStyles as styles } from "../../../styles/deliverySpace.styles";

const WEEKLY_DATA: WeeklyEarning[] = [
  { day: "Lun", amount: 45 },
  { day: "Mar", amount: 62 },
  { day: "Mer", amount: 38 },
  { day: "Jeu", amount: 85 },
  { day: "Ven", amount: 110 },
  { day: "Sam", amount: 135 },
  { day: "Dim", amount: 95 },
];

const TRIPS_HISTORY: DeliveryTrip[] = [
  {
    id: "1",
    orderNumber: "#GF-8921",
    restaurantName: "Burger Deluxe - République",
    date: "Aujourd'hui",
    time: "20:15",
    amount: 7.8,
    tip: 2.0,
    distanceKm: 2.4,
  },
  {
    id: "2",
    orderNumber: "#GF-8910",
    restaurantName: "Pizza Margherita Express",
    date: "Aujourd'hui",
    time: "19:30",
    amount: 6.5,
    distanceKm: 1.8,
  },
  {
    id: "3",
    orderNumber: "#GF-8840",
    restaurantName: "Salade & Co Bastille",
    date: "Hier",
    time: "12:45",
    amount: 5.9,
    tip: 1.5,
    distanceKm: 3.1,
  },
  {
    id: "4",
    orderNumber: "#GF-8822",
    restaurantName: "Le Gourmet Parisien",
    date: "Hier",
    time: "12:10",
    amount: 8.2,
    distanceKm: 2.0,
  },
];

export default function EarningsScreen() {
  const router = useRouter();
  const maxAmount = Math.max(...WEEKLY_DATA.map((d) => d.amount));
  const { colors } = useTheme();

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
        {/* Solde disponible & Virement */}
        <View style={[styles.balanceCard, { backgroundColor: colors.primary }]}>
          <Text style={[styles.balanceLabel, { color: colors.accentLight }]}>
            Solde disponible
          </Text>
          <Text style={[styles.balanceAmount, { color: colors.white }]}>
            142,50 €
          </Text>
          <TouchableOpacity
            style={[styles.payoutBtn, { backgroundColor: colors.accent }]}
            activeOpacity={0.8}
          >
            <Text style={[styles.payoutBtnText, { color: colors.primaryDark }]}>
              Demander un virement
            </Text>
          </TouchableOpacity>
        </View>

        {/* Aperçu de la semaine */}
        <Text style={styles.sectionTitle}>Cette semaine (570,00 €)</Text>
        <View
          style={[
            styles.chartContainer,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          {WEEKLY_DATA.map((item) => {
            const heightPercent = (item.amount / maxAmount) * 100;
            return (
              <View key={item.day} style={styles.chartColumn}>
                <View style={styles.chartBarWrapper}>
                  <View
                    style={[
                      styles.chartBarFill,
                      { height: `${heightPercent}%` },
                    ]}
                  />
                </View>
                <Text style={styles.chartDay}>{item.day}</Text>
              </View>
            );
          })}
        </View>

        {/* Dernières livraisons */}
        <Text style={styles.sectionTitle}>Dernières courses</Text>
        <View
          style={[
            styles.infoCard,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          {TRIPS_HISTORY.map((trip) => (
            <View key={trip.id} style={styles.tripCard}>
              <View style={styles.tripLeft}>
                <Text
                  style={[styles.tripRestaurant, { color: colors.textDark }]}
                >
                  {trip.restaurantName}
                </Text>
                <Text style={styles.tripMeta}>
                  {trip.date} à {trip.time} • {trip.distanceKm} km
                </Text>
              </View>
              <View style={styles.tripRight}>
                <Text style={[styles.tripAmount, { color: colors.primary }]}>
                  +{trip.amount.toFixed(2)} €
                </Text>
                {trip.tip && (
                  <Text style={[styles.tripTip, { color: colors.accent }]}>
                    dont {trip.tip.toFixed(2)} € pourboire
                  </Text>
                )}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
