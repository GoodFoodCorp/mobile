import { Stack } from "expo-router";
import { AuthProvider } from "../context/AuthContext";
import { ThemeProvider } from "../context/ThemeContext";
import { LocationProvider } from "../context/LocationContext";
import { useEffect } from "react";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";

export function NotificationListener() {
  const router = useRouter();

  useEffect(() => {
    // 1. Réception quand l'app est au premier plan
    const subReceived = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("Notification reçue :", notification.request.content);
      },
    );

    // 2. Clic sur la notification par l'utilisateur
    const subResponse = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content.data;

        if (data?.screen === "orders") {
          router.push("/orders");
        } else if (data?.screen === "delivery") {
          router.push("/delivery");
        }
      },
    );

    return () => {
      subReceived.remove();
      subResponse.remove();
    };
  }, [router]);

  return null;
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <LocationProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="become-delivery" />
            <Stack.Screen name="vehicle-status" />
            <Stack.Screen name="earnings" />
            <Stack.Screen name="personal-info" />
            <Stack.Screen name="addresses" />
            <Stack.Screen name="payments" />
            <Stack.Screen name="notifications" />
            <Stack.Screen name="security" />
            <Stack.Screen name="preferences" />
          </Stack>
        </LocationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
