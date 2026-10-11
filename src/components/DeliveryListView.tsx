import { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";

import { deliveryService } from "../services/deliveryService";
import { DeliveryDetail, DeliveryStatus } from "../types/delivery";
import { useTheme } from "../context/ThemeContext";
import { subscreenStyles as styles } from "../styles/subscreens.styles";

const STATUS_LABELS: Record<DeliveryStatus, string> = {
  UNASSIGNED: "Non assignée",
  ASSIGNED: "À récupérer",
  PICKED_UP: "En route vers le client",
  IN_TRANSIT: "En route vers le client",
  DELIVERED: "Livrée",
  CANCELLED: "Annulée",
};

export default function DeliveryListView() {
  const { colors } = useTheme();
  const router = useRouter();

  const [deliveries, setDeliveries] = useState<DeliveryDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const fetchDeliveries = useCallback(async () => {
    setLoadError(null);
    try {
      const data = await deliveryService.getMyDeliveries();
      setDeliveries(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error("Erreur chargement livraisons en cours :", err);
      setLoadError(
        err.message || "Impossible de charger vos livraisons en cours.",
      );
    }
  }, []);

  useEffect(() => {
    fetchDeliveries().finally(() => setLoading(false));
  }, [fetchDeliveries]);

  // Rafraîchissement silencieux quand l'onglet reprend le focus
  const isFirstFocus = useRef(true);
  useFocusEffect(
    useCallback(() => {
      if (isFirstFocus.current) {
        isFirstFocus.current = false;
        return;
      }
      fetchDeliveries();
    }, [fetchDeliveries]),
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchDeliveries();
    setRefreshing(false);
  }, [fetchDeliveries]);

  const openDelivery = (id: string) => router.setParams({ deliveryId: id });

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        <Text
          style={{
            fontSize: 22,
            fontWeight: "bold",
            color: colors.textDark,
            marginBottom: 16,
          }}
        >
          Mes livraisons
        </Text>

        {loadError ? (
          <View style={{ alignItems: "center", paddingVertical: 40 }}>
            <Ionicons
              name="alert-circle-outline"
              size={60}
              color={colors.accent}
            />
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: colors.textDark,
                marginTop: 12,
              }}
            >
              Erreur de chargement
            </Text>
            <Text
              style={{
                color: colors.textSecondary,
                textAlign: "center",
                marginTop: 6,
              }}
            >
              {loadError}
            </Text>
            <TouchableOpacity
              style={[
                styles.actionBtn,
                {
                  width: "80%",
                  marginTop: 20,
                  backgroundColor: colors.primary,
                },
              ]}
              onPress={onRefresh}
            >
              <Text style={styles.actionBtnText}>Réessayer</Text>
            </TouchableOpacity>
          </View>
        ) : deliveries.length === 0 ? (
          <View style={{ alignItems: "center", paddingVertical: 40 }}>
            <Ionicons
              name="bicycle-outline"
              size={60}
              color={colors.textSecondary}
            />
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: colors.textDark,
                marginTop: 12,
              }}
            >
              Aucune livraison en cours
            </Text>
            <Text
              style={{
                color: colors.textSecondary,
                textAlign: "center",
                marginTop: 6,
              }}
            >
              Consultez les commandes disponibles sur l'onglet Accueil pour en
              accepter une.
            </Text>
            <TouchableOpacity
              style={[
                styles.actionBtn,
                {
                  width: "80%",
                  marginTop: 20,
                  backgroundColor: colors.primary,
                },
              ]}
              onPress={() => router.replace("/")}
            >
              <Text style={styles.actionBtnText}>Voir les commandes</Text>
            </TouchableOpacity>
          </View>
        ) : (
          deliveries.map((delivery) => (
            <TouchableOpacity
              key={delivery._id}
              activeOpacity={0.7}
              onPress={() => openDelivery(delivery._id)}
              style={[
                styles.card,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
            >
              <View style={styles.rowBetween}>
                <Text style={[styles.itemTitle, { color: colors.textDark }]}>
                  Commande #{delivery.orderId.slice(-6).toUpperCase()}
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={colors.textSecondary}
                />
              </View>
              <Text style={[styles.itemSubtitle, { color: colors.primary }]}>
                {STATUS_LABELS[delivery.status] ?? delivery.status}
              </Text>
              <Text
                style={[styles.itemSubtitle, { color: colors.textSecondary }]}
                numberOfLines={1}
              >
                Retrait : {delivery.pickup.address}
              </Text>
              <Text
                style={[styles.itemSubtitle, { color: colors.textSecondary }]}
                numberOfLines={1}
              >
                Livraison : {delivery.dropoff.address}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
