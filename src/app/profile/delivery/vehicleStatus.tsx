import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { VehicleType } from "../../../types/delivery";
import { useTheme } from "../../../context/ThemeContext";
import { deliverySpaceStyles as styles } from "../../../styles/deliverySpace.styles";

const VEHICLES: {
  id: VehicleType;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  { id: "bike", label: "Vélo", icon: "bicycle-outline" },
  { id: "ebike", label: "E-Bike", icon: "flash-outline" },
  { id: "scooter", label: "Scooter", icon: "speedometer-outline" },
  { id: "car", label: "Voiture", icon: "car-outline" },
];

export default function VehicleStatusScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const [isAvailable, setIsAvailable] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleType>("bike");

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
          Mon véhicule et statut
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Statut de service */}
        <View
          style={[
            styles.statusCard,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <View>
            <Text style={styles.statusTitle}>
              {isAvailable ? "En ligne" : "Hors ligne"}
            </Text>
            <Text style={styles.statusSubtitle}>
              {isAvailable
                ? "Prêt à recevoir des commandes"
                : "Passez en ligne pour recevoir des courses"}
            </Text>
          </View>
          <Switch
            value={isAvailable}
            onValueChange={setIsAvailable}
            trackColor={{ false: colors.inactive, true: colors.primary }}
            thumbColor={isAvailable ? colors.primary : colors.white}
          />
        </View>

        {/* Véhicule utilisé */}
        <Text style={styles.sectionTitle}>Véhicule actif</Text>
        <View style={styles.vehicleRow}>
          {VEHICLES.map((v) => {
            const isActive = selectedVehicle === v.id;
            return (
              <TouchableOpacity
                key={v.id}
                style={[styles.vehicleBtn, isActive && styles.vehicleBtnActive]}
                onPress={() => setSelectedVehicle(v.id)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={v.icon}
                  size={22}
                  color={isActive ? colors.primary : colors.textSecondary}
                />
                <Text
                  style={[
                    styles.vehicleBtnText,
                    isActive && styles.vehicleBtnTextActive,
                  ]}
                >
                  {v.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Documents & Attestations */}
        <Text style={styles.sectionTitle}>Documents & Équipements</Text>
        <View
          style={[
            styles.infoCard,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <View style={styles.infoItem}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
              Sac isotherme conforme
            </Text>
            <Ionicons name="checkmark-circle" size={20} color={colors.accent} />
          </View>
          <View style={styles.infoItem}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
              Statut professionnel (SIRET)
            </Text>
            <Text style={[styles.infoValue, { color: colors.textDark }]}>
              Vérifié
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
              Zone de livraison
            </Text>
            <Text style={[styles.infoValue, { color: colors.textDark }]}>
              Paris Centre (75)
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
