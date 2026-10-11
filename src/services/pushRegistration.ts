import * as Device from "expo-device";

import { courierService } from "./courierService";
import { notificationService } from "./notificationService";

/**
 * Obtient le token push Expo de l'appareil et l'envoie au backend.
 * Silencieux : sans appareil physique ou sans permission, ne fait rien
 * (notificationService affiche déjà une alerte dans le cas du simulateur,
 * on l'évite donc en sortant avant).
 */
export async function registerCourierPushToken(): Promise<void> {
  if (!Device.isDevice) return;
  const token = await notificationService.registerForPushNotifications();
  if (!token) return;
  await courierService.registerPushToken(token);
}
