import { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import { io, Socket } from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { deliveryService } from "../../services/deliveryService";
import { DeliveryDetail } from "../../types/delivery";
import { useTheme } from "../../context/ThemeContext";
import { subscreenStyles as styles } from "../../styles/subscreens.styles";

type Coordinate = {
  latitude: number;
  longitude: number;
};

type RouteStep = {
  distance: number;
  duration: number;
  name?: string;
  maneuver?: {
    type?: string;
    modifier?: string;
    location?: [number, number];
  };
};

const toRadians = (value: number) => (value * Math.PI) / 180;
const API_BASE_URL = "https://api.c-mbk.fr";
const TOKEN_STORAGE_KEY = "@goodfood_auth_token";
const PICKUP_RADIUS_METERS = 100;
const COURIER_EARNINGS_EUR = 4.5;
const ROUTE_COLOR = "#1677ff";
const ROUTE_OUTLINE_COLOR = "#ffffff";

function getDistanceInMeters(from: Coordinate, to: Coordinate) {
  const earthRadius = 6371000;
  const latitudeDelta = toRadians(to.latitude - from.latitude);
  const longitudeDelta = toRadians(to.longitude - from.longitude);
  const latitude1 = toRadians(from.latitude);
  const latitude2 = toRadians(to.latitude);
  const a =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(latitude1) *
      Math.cos(latitude2) *
      Math.sin(longitudeDelta / 2) ** 2;

  return earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function getBearing(from: Coordinate, to: Coordinate) {
  const latitude1 = toRadians(from.latitude);
  const latitude2 = toRadians(to.latitude);
  const longitudeDelta = toRadians(to.longitude - from.longitude);
  const y = Math.sin(longitudeDelta) * Math.cos(latitude2);
  const x =
    Math.cos(latitude1) * Math.sin(latitude2) -
    Math.sin(latitude1) * Math.cos(latitude2) * Math.cos(longitudeDelta);
  return (Math.atan2(y, x) * 180) / Math.PI + 360;
}

function formatDistance(distanceInMeters: number) {
  return distanceInMeters < 1000
    ? `${Math.round(distanceInMeters)} m`
    : `${(distanceInMeters / 1000).toFixed(1)} km`;
}

function getManeuverLabel(step: RouteStep) {
  const modifier = step.maneuver?.modifier;
  const labels: Record<string, string> = {
    depart: "Démarrez",
    arrive: "Vous êtes arrivé",
    turn: "Tournez",
    merge: "Insérez-vous",
    fork: "Prenez la bifurcation",
    roundabout: "Prenez le rond-point",
    rotary: "Prenez le rond-point",
    continue: "Continuez",
    "new name": "Continuez",
  };
  const directions: Record<string, string> = {
    left: "à gauche",
    right: "à droite",
    straight: "tout droit",
    "slight left": "légèrement à gauche",
    "slight right": "légèrement à droite",
    "sharp left": "fortement à gauche",
    "sharp right": "fortement à droite",
  };
  const action = labels[step.maneuver?.type ?? ""] ?? "Continuez";
  const direction = modifier ? ` ${directions[modifier] ?? modifier}` : "";
  const street = step.name ? ` sur ${step.name}` : "";
  return `${action}${direction}${street}`;
}

export default function DeliveryScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{ deliveryId?: string }>();

  const [delivery, setDelivery] = useState<DeliveryDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<Coordinate | null>(
    null,
  );
  const [currentHeading, setCurrentHeading] = useState<number | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<Coordinate[]>([]);
  const [routeDistance, setRouteDistance] = useState<number | null>(null);
  const [routeDuration, setRouteDuration] = useState<number | null>(null);
  const [routeSteps, setRouteSteps] = useState<RouteStep[]>([]);
  const [nextStep, setNextStep] = useState<RouteStep | null>(null);
  const [nextStepDistance, setNextStepDistance] = useState<number | null>(null);
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [isNorthUp, setIsNorthUp] = useState(false);
  const [mapType, setMapType] = useState<"standard" | "satellite">("standard");
  const mapRef = useRef<MapView>(null);

  const fetchDelivery = useCallback(async (id: string) => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await deliveryService.getDeliveryById(id);
      setDelivery(data);
    } catch (err: any) {
      console.error("Erreur chargement livraison :", err);
      setLoadError(err.message || "Impossible de charger la livraison.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMyDelivery = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const deliveries = await deliveryService.getMyDeliveries();
      setDelivery(deliveries[0] ?? null);
    } catch (err: any) {
      console.error("Erreur chargement livraisons en cours :", err);
      setLoadError(
        err.message || "Impossible de charger vos livraisons en cours.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (params.deliveryId) {
      fetchDelivery(params.deliveryId);
    } else {
      fetchMyDelivery();
    }
  }, [params.deliveryId, fetchDelivery, fetchMyDelivery]);

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;
    let trackingSocket: Socket | null = null;
    let cancelled = false;

    const startLocationWatch = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (cancelled) return;
      if (status !== "granted") {
        setLocationError("Autorisez la localisation pour activer le guidage.");
        return;
      }

      const token = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
      if (token) {
        trackingSocket = io(`${API_BASE_URL}/tracking`, {
          auth: { token },
          transports: ["websocket"],
        });
      }

      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          distanceInterval: 10,
          timeInterval: 3000,
        },
        (location) => {
          setCurrentLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
          if (
            typeof location.coords.heading === "number" &&
            location.coords.heading >= 0
          ) {
            setCurrentHeading(location.coords.heading);
          }
          if (trackingSocket?.connected && delivery) {
            trackingSocket.emit("position:update", {
              deliveryId: delivery._id,
              lat: location.coords.latitude,
              lng: location.coords.longitude,
            });
          }
          setLocationError(null);
        },
      );
    };

    startLocationWatch().catch((error) => {
      console.error("Erreur suivi position :", error);
      setLocationError("Position indisponible pour le moment.");
    });

    return () => {
      cancelled = true;
      subscription?.remove();
      trackingSocket?.disconnect();
    };
  }, [delivery]);

  // Étape 1 : Retrait restaurant
  const handlePickup = async () => {
    if (!delivery) return;
    if (!isCloseToPickup) {
      Alert.alert(
        "Vous êtes encore trop loin",
        pickupDistance !== null
          ? `Approchez-vous à moins de ${PICKUP_RADIUS_METERS} m du restaurant. Distance actuelle : ${formatDistance(pickupDistance)}.`
          : "Autorisez la localisation pour confirmer votre arrivée au restaurant.",
      );
      return;
    }
    setActionLoading(true);
    try {
      const updated = await deliveryService.pickupDelivery(delivery._id);
      setDelivery(updated);
      Alert.alert("Super !", "Commande récupérée. En route vers le client !");
    } catch (error: any) {
      Alert.alert(
        "Erreur",
        error.message || "Impossible de valider le retrait.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  // Étape 2 : Dépôt chez le client
  const handleDropoff = async () => {
    if (!delivery) return;
    setActionLoading(true);
    try {
      await deliveryService.dropoffDelivery(delivery._id);
      Alert.alert("Course terminée ! 🎉", "La livraison a bien été validée.", [
        {
          text: "Retour à l’accueil",
          onPress: () => {
            setDelivery(null);
            router.replace("/");
          },
        },
      ]);
    } catch (error: any) {
      Alert.alert(
        "Erreur",
        error.message || "Impossible de valider la livraison.",
      );
    } finally {
      setActionLoading(false);
    }
  };

  // Aucun coursier en livraison
  const isPickedUp = delivery
    ? delivery.status === "PICKED_UP" || delivery.status === "IN_TRANSIT"
    : false;
  const destination = isPickedUp ? delivery?.dropoff : delivery?.pickup;
  const destinationCoordinate = destination
    ? {
        latitude: destination.lat,
        longitude: destination.lng,
      }
    : null;
  const mapCenter = currentLocation ?? destinationCoordinate;
  const remainingDistance =
    currentLocation && destinationCoordinate
      ? getDistanceInMeters(currentLocation, destinationCoordinate)
      : null;
  const destinationBearing =
    currentLocation && destinationCoordinate
      ? Math.round(getBearing(currentLocation, destinationCoordinate) % 360)
      : null;
  const pickupCoordinate = delivery
    ? { latitude: delivery.pickup.lat, longitude: delivery.pickup.lng }
    : null;
  const pickupDistance =
    currentLocation && pickupCoordinate
      ? getDistanceInMeters(currentLocation, pickupCoordinate)
      : null;
  const isCloseToPickup =
    isPickedUp ||
    (pickupDistance !== null && pickupDistance <= PICKUP_RADIUS_METERS);
  const navigationHeading =
    currentHeading ??
    (currentLocation && destinationCoordinate
      ? getBearing(currentLocation, destinationCoordinate)
      : 0);
  const cameraHeading = isNorthUp ? 0 : navigationHeading;
  const recenterMap = useCallback(() => {
    const center = currentLocation ?? destinationCoordinate;
    if (!center) return;
    mapRef.current?.animateCamera(
      {
        center,
        heading: cameraHeading,
        pitch: 65,
        zoom: currentLocation ? 17 : 14,
      },
      { duration: 450 },
    );
  }, [currentLocation, destinationCoordinate, cameraHeading]);

  useEffect(() => {
    if (!isMapExpanded || !currentLocation) return;
    const timer = setTimeout(() => {
      recenterMap();
    }, 150);

    return () => clearTimeout(timer);
  }, [isMapExpanded, currentLocation, recenterMap]);

  useEffect(() => {
    if (!currentLocation || !destinationCoordinate) {
      setRouteCoordinates([]);
      setRouteDistance(null);
      setRouteDuration(null);
      setRouteSteps([]);
      return;
    }

    const controller = new AbortController();
    const loadRoute = async () => {
      try {
        const coordinates = `${currentLocation.longitude},${currentLocation.latitude};${destinationCoordinate.longitude},${destinationCoordinate.latitude}`;
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson&steps=true`,
          { signal: controller.signal },
        );
        if (!response.ok) throw new Error("route unavailable");

        const data = await response.json();
        const route = data.routes?.[0];
        const geometry = route?.geometry?.coordinates;
        if (!route || !Array.isArray(geometry)) {
          throw new Error("route unavailable");
        }

        setRouteCoordinates(
          geometry.map(([longitude, latitude]: [number, number]) => ({
            latitude,
            longitude,
          })),
        );
        setRouteDistance(route.distance);
        setRouteDuration(route.duration);
        setRouteSteps(route.legs?.[0]?.steps ?? []);
      } catch {
        if (!controller.signal.aborted) {
          setRouteCoordinates([]);
          setRouteDistance(null);
          setRouteDuration(null);
          setRouteSteps([]);
        }
      }
    };

    loadRoute();
    return () => controller.abort();
  }, [
    currentLocation,
    destinationCoordinate?.latitude,
    destinationCoordinate?.longitude,
  ]);

  useEffect(() => {
    if (!currentLocation || routeSteps.length === 0) {
      setNextStep(null);
      setNextStepDistance(null);
      return;
    }

    const upcomingStep = routeSteps
      .map((step) => {
        const location = step.maneuver?.location;
        if (!location) return null;
        const coordinate = {
          latitude: location[1],
          longitude: location[0],
        };
        return {
          step,
          distance: getDistanceInMeters(currentLocation, coordinate),
        };
      })
      .filter((entry): entry is { step: RouteStep; distance: number } =>
        Boolean(entry && entry.distance > 25),
      )
      .sort((a, b) => a.distance - b.distance)[0];

    setNextStep(upcomingStep?.step ?? null);
    setNextStepDistance(upcomingStep?.distance ?? null);
  }, [currentLocation, routeSteps]);

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

  if (!delivery) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <Ionicons
            name={loadError ? "alert-circle-outline" : "bicycle-outline"}
            size={60}
            color={loadError ? colors.accent : colors.textSecondary}
          />
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: colors.textDark,
              marginTop: 12,
            }}
          >
            {loadError ? "Erreur de chargement" : "Aucune livraison en cours"}
          </Text>
          <Text
            style={{
              color: colors.textSecondary,
              textAlign: "center",
              marginTop: 6,
            }}
          >
            {loadError ||
              "Consultez les commandes disponibles sur l'onglet Accueil pour en accepter une."}
          </Text>
          {loadError && (
            <TouchableOpacity
              style={[
                styles.actionBtn,
                {
                  width: "80%",
                  marginTop: 20,
                  backgroundColor: colors.primary,
                },
              ]}
              onPress={fetchMyDelivery}
            >
              <Text style={styles.actionBtnText}>Réessayer</Text>
            </TouchableOpacity>
          )}
          {!loadError && (
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
          )}
        </View>
      </SafeAreaView>
    );
  }

  const activeDestination = isPickedUp ? delivery.dropoff : delivery.pickup;
  const activeDestinationCoordinate = {
    latitude: activeDestination.lat,
    longitude: activeDestination.lng,
  };

  const activeMapCenter = currentLocation ?? activeDestinationCoordinate;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Progression visuelle */}
        <View
          style={[
            styles.card,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Text
            style={[
              styles.itemTitle,
              { color: colors.textDark, marginBottom: 12 },
            ]}
          >
            Statut de la course
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View style={{ alignItems: "center", flex: 1 }}>
              <Ionicons
                name="checkmark-circle"
                size={28}
                color={colors.primary}
              />
              <Text
                style={{ fontSize: 11, color: colors.textDark, marginTop: 4 }}
              >
                Acceptée
              </Text>
            </View>

            <View
              style={{
                height: 2,
                flex: 1,
                backgroundColor: isPickedUp ? colors.primary : colors.border,
              }}
            />

            <View style={{ alignItems: "center", flex: 1 }}>
              <Ionicons
                name={isPickedUp ? "checkmark-circle" : "radio-button-on"}
                size={28}
                color={isPickedUp ? colors.primary : colors.textSecondary}
              />
              <Text
                style={{ fontSize: 11, color: colors.textDark, marginTop: 4 }}
              >
                Récupérée
              </Text>
            </View>

            <View
              style={{ height: 2, flex: 1, backgroundColor: colors.border }}
            />

            <View style={{ alignItems: "center", flex: 1 }}>
              <Ionicons
                name="flag-outline"
                size={26}
                color={colors.textSecondary}
              />
              <Text
                style={{ fontSize: 11, color: colors.textDark, marginTop: 4 }}
              >
                Livrée
              </Text>
            </View>
          </View>
        </View>

        {/* Guidage intégré */}
        <View
          style={[
            styles.card,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <TouchableOpacity
            style={styles.rowBetween}
            onPress={() => setIsMapExpanded(true)}
            activeOpacity={0.75}
            accessibilityRole="button"
            accessibilityLabel="Ouvrir le mode GPS"
          >
            <View style={{ flex: 1 }}>
              <Text style={[styles.itemTitle, { color: colors.textDark }]}>
                {isPickedUp
                  ? "Guidage vers le client"
                  : "Guidage vers le restaurant"}
              </Text>
              <Text
                style={[styles.itemSubtitle, { color: colors.textSecondary }]}
              >
                {activeDestination.address}
              </Text>
            </View>
            <Ionicons
              name={isPickedUp ? "flag-outline" : "restaurant-outline"}
              size={26}
              color={colors.primary}
            />
          </TouchableOpacity>

          <View
            style={{
              height: 340,
              marginTop: 12,
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            <MapView
              style={{ flex: 1 }}
              initialCamera={{
                center: activeMapCenter,
                pitch: 50,
                heading: cameraHeading,
                zoom: currentLocation ? 16 : 14,
              }}
              showsUserLocation
              showsMyLocationButton
              showsCompass={false}
              rotateEnabled
              pitchEnabled
              mapType={mapType}
              showsBuildings
              loadingEnabled
              onMapReady={() => {
                if (currentLocation) {
                  recenterMap();
                }
              }}
              onPress={() => setIsMapExpanded(true)}
            >
              <Marker
                coordinate={activeDestinationCoordinate}
                title={isPickedUp ? "Adresse de livraison" : "Restaurant"}
                description={activeDestination.address}
                pinColor={colors.primary}
              />
              {currentLocation && (
                <>
                  <Polyline
                    coordinates={
                      routeCoordinates.length > 0
                        ? routeCoordinates
                        : [currentLocation, activeDestinationCoordinate]
                    }
                    strokeColor={ROUTE_OUTLINE_COLOR}
                    strokeWidth={9}
                  />
                  <Polyline
                    coordinates={
                      routeCoordinates.length > 0
                        ? routeCoordinates
                        : [currentLocation, activeDestinationCoordinate]
                    }
                    strokeColor={ROUTE_COLOR}
                    strokeWidth={5}
                  />
                </>
              )}
            </MapView>

            <TouchableOpacity
              style={{
                position: "absolute",
                left: 22,
                right: 22,
                bottom: 16,
                height: 48,
                borderRadius: 12,
                backgroundColor: colors.primary,
                alignItems: "center",
                justifyContent: "center",
                shadowColor: "#000000",
                shadowOpacity: 0.2,
                shadowRadius: 6,
                shadowOffset: { width: 0, height: 3 },
                elevation: 5,
              }}
              onPress={() => setIsMapExpanded(true)}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Ouvrir le GPS"
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons name="navigate" size={20} color={colors.white} />
                <Text
                  style={{
                    color: colors.white,
                    fontSize: 15,
                    fontWeight: "800",
                    marginLeft: 8,
                  }}
                >
                  Ouvrir le GPS
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={{ marginTop: 12 }}>
            {nextStep && nextStepDistance !== null && (
              <View
                style={{
                  backgroundColor: colors.inputBg,
                  borderRadius: 10,
                  padding: 12,
                  marginBottom: 10,
                }}
              >
                <Text style={[styles.itemTitle, { color: colors.textDark }]}>
                  Prochaine instruction
                </Text>
                <Text style={[styles.itemSubtitle, { color: colors.textDark }]}>
                  {getManeuverLabel(nextStep)} dans{" "}
                  {formatDistance(nextStepDistance)}
                </Text>
              </View>
            )}
            {remainingDistance !== null && destinationBearing !== null ? (
              <Text style={[styles.itemTitle, { color: colors.textDark }]}>
                {routeDistance !== null
                  ? formatDistance(routeDistance)
                  : formatDistance(remainingDistance)}{" "}
                • direction {destinationBearing}°
              </Text>
            ) : (
              <Text
                style={[styles.itemSubtitle, { color: colors.textSecondary }]}
              >
                {locationError || "Recherche de votre position..."}
              </Text>
            )}
            <Text
              style={[styles.itemSubtitle, { color: colors.textSecondary }]}
            >
              Suivez la ligne vers votre prochaine étape.
            </Text>
            {routeDuration !== null && (
              <Text
                style={[styles.itemSubtitle, { color: colors.textSecondary }]}
              >
                Temps estimé : {Math.max(1, Math.round(routeDuration / 60))} min
              </Text>
            )}
          </View>
        </View>

        {/* Étape courante */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          {!isPickedUp
            ? "1. Aller chercher la commande"
            : "2. Livrer chez le client"}
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
                {!isPickedUp ? "Restaurant" : "Client"}
              </Text>
              <Text
                style={[styles.itemSubtitle, { color: colors.textSecondary }]}
              >
                {!isPickedUp
                  ? delivery.pickup.address
                  : delivery.dropoff.address}
              </Text>
            </View>
          </View>
        </View>

        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            },
          ]}
        >
          <View>
            <Text
              style={[styles.itemSubtitle, { color: colors.textSecondary }]}
            >
              Gain estimé
            </Text>
            <Text
              style={[
                styles.itemTitle,
                { color: colors.textDark, fontSize: 24 },
              ]}
            >
              +{COURIER_EARNINGS_EUR.toFixed(2)} €
            </Text>
          </View>
          <Ionicons name="wallet-outline" size={32} color={colors.primary} />
        </View>

        {/* Bouton d'action principale selon l'étape */}
        {!isPickedUp ? (
          <TouchableOpacity
            style={[
              styles.actionBtn,
              {
                backgroundColor: isCloseToPickup
                  ? colors.primary
                  : colors.border,
              },
            ]}
            onPress={handlePickup}
            disabled={actionLoading || !isCloseToPickup}
            activeOpacity={0.8}
          >
            {actionLoading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.actionBtnText}>
                {isCloseToPickup
                  ? "J'ai récupéré la commande"
                  : pickupDistance !== null
                    ? `Approchez-vous du restaurant (${formatDistance(pickupDistance)})`
                    : "Localisation nécessaire pour récupérer"}
              </Text>
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: "#27ae60" }]}
            onPress={handleDropoff}
            disabled={actionLoading}
            activeOpacity={0.8}
          >
            {actionLoading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.actionBtnText}>
                Confirmer la livraison au client
              </Text>
            )}
          </TouchableOpacity>
        )}
      </ScrollView>

      <Modal
        visible={isMapExpanded}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => setIsMapExpanded(false)}
      >
        <SafeAreaView
          edges={["top", "bottom"]}
          style={[styles.container, { backgroundColor: colors.background }]}
        >
          <View
            style={[
              styles.topBar,
              {
                backgroundColor: colors.surface,
                borderBottomColor: colors.border,
                minHeight: 92,
                paddingTop: 12,
                paddingBottom: 12,
              },
            ]}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  styles.topBarTitle,
                  { color: colors.textDark, fontSize: 18 },
                ]}
                numberOfLines={1}
              >
                {isPickedUp
                  ? "Guidage vers le client"
                  : "Guidage vers le restaurant"}
              </Text>
              <Text
                style={[styles.itemSubtitle, { color: colors.textSecondary }]}
                numberOfLines={1}
              >
                {activeDestination.address}
              </Text>
            </View>
            <TouchableOpacity
              style={[
                styles.backButton,
                {
                  backgroundColor: colors.primary,
                  width: 48,
                  height: 48,
                  zIndex: 10,
                  elevation: 10,
                },
              ]}
              onPress={() => setIsMapExpanded(false)}
              accessibilityLabel="Fermer le guidage plein écran"
            >
              <Ionicons name="close" size={28} color={colors.white} />
            </TouchableOpacity>
          </View>

          <MapView
            ref={mapRef}
            style={{ flex: 1 }}
            initialCamera={{
              center: activeMapCenter,
              pitch: 65,
              heading: cameraHeading,
              zoom: currentLocation ? 17 : 14,
            }}
            showsUserLocation
            showsMyLocationButton
            showsCompass={false}
            rotateEnabled
            pitchEnabled
            mapType={mapType}
            showsBuildings
            loadingEnabled
            onMapReady={recenterMap}
            onUserLocationChange={() => {
              if (isMapExpanded) {
                recenterMap();
              }
            }}
          >
            <Marker
              coordinate={activeDestinationCoordinate}
              title={isPickedUp ? "Adresse de livraison" : "Restaurant"}
              description={activeDestination.address}
              pinColor={colors.primary}
            />
            {currentLocation && (
              <>
                <Polyline
                  coordinates={
                    routeCoordinates.length > 0
                      ? routeCoordinates
                      : [currentLocation, activeDestinationCoordinate]
                  }
                  strokeColor={ROUTE_OUTLINE_COLOR}
                  strokeWidth={11}
                />
                <Polyline
                  coordinates={
                    routeCoordinates.length > 0
                      ? routeCoordinates
                      : [currentLocation, activeDestinationCoordinate]
                  }
                  strokeColor={ROUTE_COLOR}
                  strokeWidth={6}
                />
              </>
            )}
          </MapView>

          {nextStep && nextStepDistance !== null && (
            <View
              style={{
                position: "absolute",
                top: 158,
                left: 16,
                right: 16,
                backgroundColor: colors.primary,
                borderRadius: 14,
                paddingHorizontal: 16,
                paddingVertical: 14,
                shadowColor: "#000000",
                shadowOpacity: 0.2,
                shadowRadius: 8,
                shadowOffset: { width: 0, height: 3 },
                elevation: 6,
              }}
            >
              <Text
                style={{
                  color: colors.accentLight,
                  fontSize: 12,
                  fontWeight: "700",
                }}
              >
                PROCHAINE MANŒUVRE • {formatDistance(nextStepDistance)}
              </Text>
              <Text
                style={{
                  color: colors.white,
                  fontSize: 18,
                  fontWeight: "800",
                  marginTop: 3,
                }}
                numberOfLines={2}
              >
                {getManeuverLabel(nextStep)}
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={{
              position: "absolute",
              right: 18,
              bottom: 190,
              width: 52,
              height: 52,
              borderRadius: 26,
              backgroundColor: colors.surface,
              alignItems: "center",
              justifyContent: "center",
              shadowColor: "#000000",
              shadowOpacity: 0.2,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 3 },
              elevation: 6,
            }}
            onPress={recenterMap}
            disabled={!currentLocation}
            accessibilityRole="button"
            accessibilityLabel="Recentrer la carte sur ma position"
          >
            <Ionicons
              name="navigate"
              size={24}
              color={currentLocation ? ROUTE_COLOR : colors.textSecondary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              position: "absolute",
              left: 18,
              bottom: 190,
              width: 58,
              height: 58,
              borderRadius: 29,
              backgroundColor: colors.surface,
              alignItems: "center",
              justifyContent: "center",
              shadowColor: "#000000",
              shadowOpacity: 0.2,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 3 },
              elevation: 6,
            }}
            onPress={() =>
              setMapType((currentType) =>
                currentType === "standard" ? "satellite" : "standard",
              )
            }
            accessibilityRole="button"
            accessibilityLabel={
              mapType === "standard"
                ? "Activer la vue satellite"
                : "Revenir à la carte standard"
            }
          >
            <Ionicons
              name={mapType === "standard" ? "layers-outline" : "map-outline"}
              size={25}
              color={colors.primary}
            />
            <Text
              style={{
                fontSize: 8,
                fontWeight: "800",
                color: colors.primary,
                marginTop: 1,
              }}
            >
              {mapType === "standard" ? "SAT" : "CARTE"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              position: "absolute",
              right: 82,
              bottom: 190,
              width: 52,
              height: 52,
              borderRadius: 26,
              backgroundColor: colors.surface,
              alignItems: "center",
              justifyContent: "center",
              shadowColor: "#000000",
              shadowOpacity: 0.2,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 3 },
              elevation: 6,
            }}
            onPress={() => setIsNorthUp((currentMode) => !currentMode)}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel={
              isNorthUp
                ? "Orienter la carte dans le sens de conduite"
                : "Afficher le nord en haut"
            }
          >
            <Ionicons
              name="compass"
              size={30}
              color={colors.primary}
              style={{
                transform: [
                  { rotate: `${isNorthUp ? 0 : -navigationHeading}deg` },
                ],
              }}
            />
            <Text
              style={{
                position: "absolute",
                top: 5,
                fontSize: 9,
                fontWeight: "800",
                color: colors.accent,
              }}
            >
              N
            </Text>
          </TouchableOpacity>

          <View
            style={[
              styles.card,
              {
                position: "absolute",
                left: 16,
                right: 16,
                bottom: 16,
                marginBottom: 0,
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <Text style={[styles.itemTitle, { color: colors.textDark }]}>
              {remainingDistance !== null
                ? `${routeDistance !== null ? formatDistance(routeDistance) : formatDistance(remainingDistance)} restantes`
                : "Recherche de votre position..."}
            </Text>
            {routeDuration !== null && (
              <Text
                style={[styles.itemSubtitle, { color: colors.textSecondary }]}
              >
                Temps estimé : {Math.max(1, Math.round(routeDuration / 60))} min
              </Text>
            )}
            <TouchableOpacity
              style={{
                marginTop: 12,
                minHeight: 44,
                borderRadius: 8,
                backgroundColor: colors.inputBg,
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={() => setIsMapExpanded(false)}
              accessibilityRole="button"
              accessibilityLabel="Quitter le mode GPS"
            >
              <Text style={[styles.itemTitle, { color: colors.primary }]}>
                Quitter le mode GPS
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}
