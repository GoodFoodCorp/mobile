import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { User } from "../types/auth";
import { AvailableDelivery } from "../types/delivery";
import SectionHeader from "./SectionHeader";
import { useTheme } from "../context/ThemeContext";
import { deliveryHomeStyles as styles } from "../styles/deliveryHome.styles";

interface DeliveryHomeViewProps {
  user: User;
}

const MOCK_AVAILABLE_ORDERS: AvailableDelivery[] = [
  {
    id: "del_1",
    orderNumber: "#GF-1044",
    restaurantName: "Burger Deluxe (République)",
    restaurantAddress: "12 Rue du Faubourg du Temple",
    deliveryAddress: "48 Boulevard Voltaire",
    distanceRestaurantKm: 0.6,
    deliveryDistanceKm: 1.8,
    earnings: 7.2,
    itemsCount: 3,
    pickupTimeLimit: "10 min",
  },
  {
    id: "del_2",
    orderNumber: "#GF-1049",
    restaurantName: "Pizza Margherita Express",
    restaurantAddress: "5 Place de la Bastille",
    deliveryAddress: "19 Rue de Charonne",
    distanceRestaurantKm: 1.1,
    deliveryDistanceKm: 2.2,
    earnings: 8.5,
    itemsCount: 2,
    pickupTimeLimit: "15 min",
  },
];

export default function DeliveryHomeView({ user }: DeliveryHomeViewProps) {
  const [isOnline, setIsOnline] = useState(true);
  const { colors } = useTheme();

  const handleAcceptOrder = (order: AvailableDelivery) => {
    Alert.alert(
      "Course acceptée !",
      `Rendez-vous à : ${order.restaurantName}\nRécupération sous ${order.pickupTimeLimit}.`,
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* En-tête statut du livreur */}
      <View style={[styles.statusHeader, { backgroundColor: colors.primary }]}>
        <SafeAreaView edges={["top"]}>
          <View style={styles.statusTopRow}>
            <View>
              <Text
                style={[styles.greetingText, { color: colors.accentLight }]}
              >
                Espace Coursier
              </Text>
              <Text style={[styles.driverName, { color: colors.white }]}>
                {user.fullName}
              </Text>
            </View>

            <View style={styles.onlineToggleWrapper}>
              <View
                style={[
                  styles.statusDot,
                  isOnline ? styles.statusDotOnline : styles.statusDotOffline,
                ]}
              />
              <Text style={styles.statusLabelText}>
                {isOnline ? "En ligne" : "Hors ligne"}
              </Text>
              <Switch
                value={isOnline}
                onValueChange={setIsOnline}
                trackColor={{ false: colors.inactive, true: colors.accent }}
                thumbColor={colors.white}
              />
            </View>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Résumé journalier */}
        <View
          style={[
            styles.statsGrid,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <View style={styles.statItem}>
            <Text style={styles.statValue}>48,50 €</Text>
            <Text style={styles.statLabel}>Aujourd'hui</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>6</Text>
            <Text style={styles.statLabel}>Courses</Text>
          </View>
          <View style={[styles.statItem, styles.statItemLast]}>
            <Text style={styles.statValue}>2h 15m</Text>
            <Text style={styles.statLabel}>En ligne</Text>
          </View>
        </View>

        {isOnline ? (
          <>
            <View
              style={[
                styles.zoneAlert,
                {
                  backgroundColor: colors.accentLight,
                  borderColor: colors.border,
                },
              ]}
            >
              <Ionicons
                name="flame-outline"
                size={20}
                color={colors.primaryDark}
              />
              <Text style={styles.zoneAlertText}>
                Forte demande actuellement vers Paris République / Bastille
                (+1,50 € / course).
              </Text>
            </View>

            <SectionHeader title="Courses disponibles à proximité" />

            {MOCK_AVAILABLE_ORDERS.map((order) => (
              <View
                key={order.id}
                style={[
                  styles.orderCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                ]}
              >
                <View style={styles.orderCardHeader}>
                  <Text style={styles.orderNumber}>{order.orderNumber}</Text>
                  <View style={styles.earningsTag}>
                    <Text style={styles.earningsText}>
                      +{order.earnings.toFixed(2)} €
                    </Text>
                  </View>
                </View>

                {/* Étape 1 : Retrait */}
                <View style={styles.routeStep}>
                  <Ionicons
                    name="storefront-outline"
                    size={16}
                    color={colors.primary}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.routeStepText}>
                      {order.restaurantName}
                    </Text>
                    <Text style={styles.routeStepSub}>
                      {order.restaurantAddress} ({order.distanceRestaurantKm}{" "}
                      km)
                    </Text>
                  </View>
                </View>

                {/* Étape 2 : Livraison */}
                <View style={styles.routeStep}>
                  <Ionicons
                    name="location-outline"
                    size={16}
                    color={colors.accent}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.routeStepText}>
                      {order.deliveryAddress}
                    </Text>
                    <Text style={styles.routeStepSub}>
                      Distance client : {order.deliveryDistanceKm} km
                    </Text>
                  </View>
                </View>

                <View style={styles.orderFooter}>
                  <Text style={styles.orderDistanceMeta}>
                    {order.itemsCount} articles • Prêt dans{" "}
                    {order.pickupTimeLimit}
                  </Text>
                  <TouchableOpacity
                    style={styles.acceptBtn}
                    onPress={() => handleAcceptOrder(order)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.acceptBtnText}>Accepter</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </>
        ) : (
          <View style={styles.offlinePlaceholder}>
            <Ionicons
              name="moon-outline"
              size={48}
              color={colors.textSecondary}
            />
            <Text style={styles.offlineTitle}>
              Vous êtes actuellement hors ligne
            </Text>
            <Text style={styles.offlineSubtitle}>
              Activez le switch en haut pour vous rendre disponible et recevoir
              des commandes en direct.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
