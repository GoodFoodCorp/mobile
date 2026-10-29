import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { courierService } from "./courierService";

export const LOCATION_BACKGROUND_TASK = "GOODFOOD_DELIVERY_BACKGROUND_TRACKING";
export const DRIVER_LAST_LOCATION_KEY = "@goodfood_driver_last_coords";
const LOCATION_REPORT_INTERVAL_MS = 60_000;
let lastReportedAt = 0;

// 1. Définition de la tâche exécutée même app fermée/en tâche de fond
TaskManager.defineTask(LOCATION_BACKGROUND_TASK, async ({ data, error }) => {
  if (error) {
    // kCLErrorLocationUnknown (iOS, code 0) : position pas encore disponible
    // (démarrage du GPS, intérieur, simulateur). Transitoire : CoreLocation
    // continue d'essayer et les mises à jour reprennent seules.
    const code = (error as { code?: number | string }).code;
    if (code === 0 || code === "0") {
      console.warn("Position GPS momentanément indisponible, nouvel essai.");
    } else {
      console.error("Erreur tâche de fond géolocalisation :", error);
    }
    return;
  }

  if (data) {
    const { locations } = data as { locations: Location.LocationObject[] };
    if (locations && locations.length > 0) {
      const latest = locations[locations.length - 1].coords;

      const coords = {
        latitude: latest.latitude,
        longitude: latest.longitude,
        timestamp: Date.now(),
      };

      // Sauvegarde locale des dernières coordonnées du livreur
      await AsyncStorage.setItem(
        DRIVER_LAST_LOCATION_KEY,
        JSON.stringify(coords),
      );

      // Partage la position (au plus une fois par minute) pour recevoir les
      // courses proches du livreur.
      if (coords.timestamp - lastReportedAt >= LOCATION_REPORT_INTERVAL_MS) {
        lastReportedAt = coords.timestamp;
        await courierService.reportLocation(coords.latitude, coords.longitude).catch(() => undefined);
      }
    }
  }
});

export const backgroundLocationService = {
  /**
   * Demande les permissions Premier Plan ET Arrière-Plan
   */
  async requestPermissions(): Promise<boolean> {
    const { status: fgStatus } =
      await Location.requestForegroundPermissionsAsync();
    if (fgStatus !== "granted") {
      return false;
    }

    const { status: bgStatus } =
      await Location.requestBackgroundPermissionsAsync();
    return bgStatus === "granted";
  },

  /**
   * Démarre le tracking en tâche de fond pour le coursier
   */
  async startTracking(): Promise<boolean> {
    const hasPermission = await this.requestPermissions();
    if (!hasPermission) {
      return false;
    }

    const isAlreadyStarted = await Location.hasStartedLocationUpdatesAsync(
      LOCATION_BACKGROUND_TASK,
    );
    if (!isAlreadyStarted) {
      await Location.startLocationUpdatesAsync(LOCATION_BACKGROUND_TASK, {
        accuracy: Location.Accuracy.High,
        timeInterval: 10000, // Toutes les 10 secondes
        distanceInterval: 15, // Ou tous les 15 mètres parcourus
        showsBackgroundLocationIndicator: true, // Affiche la bulle bleue de tracking sur iOS
        foregroundService: {
          notificationTitle: "Good Food Coursier",
          notificationBody:
            "Partage de position actif pour recevoir les courses à proximité",
          notificationColor: "#03452c",
        },
      });
    }

    return true;
  },

  /**
   * Arrête le suivi dès que le coursier passe "Hors ligne"
   */
  async stopTracking(): Promise<void> {
    const isStarted = await Location.hasStartedLocationUpdatesAsync(
      LOCATION_BACKGROUND_TASK,
    );
    if (isStarted) {
      await Location.stopLocationUpdatesAsync(LOCATION_BACKGROUND_TASK);
    }
  },
};
