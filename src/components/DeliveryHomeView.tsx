import { useState, useEffect, useMemo, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { backgroundLocationService } from "../services/backgroundLocationService";
import { deliveryService } from "../services/deliveryService";
import { useTheme } from "../context/ThemeContext";
import { User } from "../types/auth";
import { DeliveryDetail } from "../types/delivery";
import SectionHeader from "./SectionHeader";
import { deliveryHomeStyles as styles } from "../styles/deliveryHome.styles";

interface DeliveryHomeViewProps {
  user: User;
}

export default function DeliveryHomeView({ user }: DeliveryHomeViewProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [deliveries, setDeliveries] = useState<DeliveryDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const { colors } = useTheme();

  // Récupération des commandes réelles depuis l'API
  const fetchOrders = useCallback(async () => {
    try {
      const data = await deliveryService.getAvailableDeliveries();
      setDeliveries(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error("Erreur récupération commandes prêtes :", error);
    }
  }, []);

  useEffect(() => {
    if (isOnline) {
      setLoading(true);
      fetchOrders().finally(() => setLoading(false));
    }
  }, [isOnline, fetchOrders]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  };

  // Toggle du statut en ligne
  const handleToggleOnline = async (value: boolean) => {
    setIsOnline(value);
    if (value) {
      const ok = await backgroundLocationService.startTracking();
      if (!ok) {
        Alert.alert(
          "Autorisation requise",
          'Veuillez activer la localisation "Toujours autoriser" dans vos réglages pour recevoir des commandes.',
        );
      }
      fetchOrders();
    } else {
      await backgroundLocationService.stopTracking();
      setDeliveries([]);
    }
  };

  // Tri par date de commande (les plus anciennes à livrer en priorité)
  const sortedDeliveries = useMemo(() => {
    return [...deliveries].sort(
      (a, b) =>
        new Date(a.estimatedDeliveryTime).getTime() -
        new Date(b.estimatedDeliveryTime).getTime(),
    );
  }, [deliveries]);

  const handleAcceptDelivery = async (delivery: DeliveryDetail) => {
    try {
      await deliveryService.acceptDelivery(delivery._id);
      Alert.alert(
        "Course acceptée !",
        "Rendez-vous au restaurant pour récupérer la commande.",
        [
          {
            text: "Voir la course",
            onPress: () =>
              router.push({
                pathname: "/delivery",
                params: { deliveryId: delivery._id },
              }),
          },
        ],
      );
      fetchOrders();
    } catch (error: any) {
      Alert.alert(
        "Erreur",
        error.message || "Impossible de prendre en charge cette course.",
      );
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* En-tête */}
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
                onValueChange={handleToggleOnline}
                trackColor={{ false: "#7f8c8d", true: "#27ae60" }}
                thumbColor="#ffffff"
              />
            </View>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {isOnline ? (
          <>
            <SectionHeader title="Commandes prêtes à livrer" />

            {loading ? (
              <ActivityIndicator
                size="large"
                color={colors.primary}
                style={{ marginTop: 30 }}
              />
            ) : sortedDeliveries.length === 0 ? (
              <View
                style={{
                  alignItems: "center",
                  marginTop: 40,
                  paddingHorizontal: 20,
                }}
              >
                <Ionicons
                  name="bicycle-outline"
                  size={40}
                  color={colors.textSecondary}
                />
                <Text
                  style={{
                    color: colors.textDark,
                    fontWeight: "bold",
                    marginTop: 10,
                    fontSize: 16,
                  }}
                >
                  Aucune commande prête
                </Text>
                <Text
                  style={{
                    color: colors.textSecondary,
                    textAlign: "center",
                    marginTop: 4,
                  }}
                >
                  Tirez vers le bas pour actualiser ou restez connecté.
                </Text>
              </View>
            ) : (
              sortedDeliveries.map((delivery) => {
                const courierFee = (4.5).toFixed(2); // Rémunération estimée

                return (
                  <View
                    key={delivery._id}
                    style={[
                      styles.orderCard,
                      {
                        backgroundColor: colors.surface,
                        borderColor: colors.border,
                      },
                    ]}
                  >
                    <View style={styles.orderCardHeader}>
                      <Text style={styles.orderNumber}>
                        #{delivery.orderId.slice(0, 8)}
                      </Text>
                      <View style={styles.earningsTag}>
                        <Text style={styles.earningsText}>+{courierFee} €</Text>
                      </View>
                    </View>

                    {/* Adresse de destination */}
                    <View style={styles.routeStep}>
                      <Ionicons
                        name="location-outline"
                        size={18}
                        color={colors.accent}
                      />
                      <View style={{ flex: 1 }}>
                        <Text
                          style={[
                            styles.routeStepText,
                            { color: colors.textDark, fontWeight: "600" },
                          ]}
                        >
                          Adresse de livraison
                        </Text>
                        <Text
                          style={[
                            styles.routeStepSub,
                            { color: colors.textSecondary },
                          ]}
                        >
                          {delivery.dropoff.address}
                        </Text>
                      </View>
                    </View>

                    {/* Pied de carte */}
                    <View style={styles.orderFooter}>
                      <View>
                        <Text style={styles.orderDistanceMeta}>
                          Départ : {delivery.pickup.address}
                        </Text>
                        <Text
                          style={[styles.orderDistanceMeta, { fontSize: 11 }]}
                        >
                          Livraison estimée à{" "}
                          {new Date(
                            delivery.estimatedDeliveryTime,
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </Text>
                      </View>

                      <TouchableOpacity
                        style={styles.acceptBtn}
                        onPress={() => handleAcceptDelivery(delivery)}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.acceptBtnText}>
                          Prendre en charge
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })
            )}
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
