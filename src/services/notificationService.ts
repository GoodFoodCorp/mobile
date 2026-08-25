import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";

// Configuration du comportement par défaut lors de la réception (app au premier plan)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Exemple d'utilisation du service de notification
// await notificationService.sendLocalNotification(
//       "Commande confirmée ! 🍔",
//       "Le restaurant prépare votre Burger Deluxe.",
//       { screen: "orders", orderId: "GF-1044" },
//     );

export const notificationService = {
  /**
   * Vérifie et demande la permission d'afficher des notifications
   */
  async requestPermissions(): Promise<boolean> {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "Commandes Good Food",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#03452c",
      });
    }

    return finalStatus === "granted";
  },

  /**
   * Demande la permission et retourne le Push Token Expo (pour vos serveurs)
   */
  async registerForPushNotifications(): Promise<string | null> {
    if (!Device.isDevice) {
      alert("Les notifications push nécessitent un appareil physique.");
      return null;
    }

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      return null;
    }

    // Configuration spécifique Android (canaux de notification)
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "Commandes Good Food",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#03452c",
      });
    }

    try {
      const tokenData = await Notifications.getExpoPushTokenAsync();
      return tokenData.data;
    } catch (error) {
      alert("Erreur lors de la récupération du token push :" + error);
      return null;
    }
  },

  /**
   * Déclenche une notification locale
   */
  async sendLocalNotification(
    title: string,
    body: string,
    data: Record<string, unknown> = {},
  ) {
    // 1. Demande de permission si nécessaire
    const hasPermission = await this.requestPermissions();
    if (!hasPermission) {
      alert("Permission de notification refusée par l’utilisateur.");
      return;
    }

    // 2. Programmation immédiate
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: true,
      },
      trigger: null, // null = affichage immédiat
    });
  },

  /**
   * Planifie une notification après un délai en secondes
   */
  async scheduleNotification(title: string, body: string, seconds: number) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds,
        repeats: false,
      },
    });
  },

  /**
   * Annule toutes les notifications en attente
   */
  async cancelAllNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
  },
};
