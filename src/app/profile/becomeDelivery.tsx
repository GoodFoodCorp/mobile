import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import AuthInput from "../../components/AuthInput";
import { useAuth } from "../../context/AuthContext";
import { BecomeDeliveryFormData, VehicleType } from "../../types/delivery";
import { useTheme } from "../../context/ThemeContext";
import { commonStyles } from "../../styles/common.styles";
import { becomeDeliveryStyles as styles } from "../../styles/becomeDelivery.styles";

const VEHICLES: {
  id: VehicleType;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  { id: "bike", label: "Vélo mécanique", icon: "bicycle-outline" },
  { id: "ebike", label: "Vélo électrique", icon: "flash-outline" },
  { id: "scooter", label: "Scooter / Moto", icon: "speedometer-outline" },
  { id: "car", label: "Voiture", icon: "car-outline" },
];

export default function BecomeDeliveryScreen() {
  const router = useRouter();
  const { upgradeToDelivery } = useAuth();
  const { colors } = useTheme();

  const [formData, setFormData] = useState<BecomeDeliveryFormData>({
    vehicleType: "bike",
    siret: "",
    city: "",
    iban: "",
    drivingLicenseNumber: "",
    hasBagEquipped: false,
  });

  const isMotorized =
    formData.vehicleType === "scooter" || formData.vehicleType === "car";

  const handleChange = <K extends keyof BecomeDeliveryFormData>(
    key: K,
    value: BecomeDeliveryFormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.siret || formData.siret.length !== 9) {
      Alert.alert(
        "Erreur",
        "Veuillez saisir un numéro SIREN/SIRET valide (9 chiffres).",
      );
      return;
    }
    if (!formData.city) {
      Alert.alert(
        "Erreur",
        "Veuillez préciser votre zone ou ville de livraison.",
      );
      return;
    }
    if (!formData.iban || formData.iban.length < 14) {
      Alert.alert(
        "Erreur",
        "Veuillez renseigner un IBAN valide pour vos paiements.",
      );
      return;
    }
    if (isMotorized && !formData.drivingLicenseNumber) {
      Alert.alert(
        "Erreur",
        "Le numéro de permis est obligatoire pour les véhicules motorisés.",
      );
      return;
    }
    if (!formData.hasBagEquipped) {
      Alert.alert(
        "Sac requis",
        "Vous devez certifier disposer d’un sac isotherme conforme.",
      );
      return;
    }

    await upgradeToDelivery(formData);
    Alert.alert(
      "Félicitations !",
      "Votre compte est désormais configuré en Livreur. L’onglet Livraison est maintenant accessible.",
      [{ text: "Super !", onPress: () => router.replace("/delivery") }],
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Barre supérieure avec bouton retour */}
      <View style={[styles.topBar, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: colors.inputBg }]}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color={colors.primary} />
        </TouchableOpacity>

        <Text style={[styles.topBarTitle, { color: colors.primary }]}>
          Devenir Livreur
        </Text>

        {/* Élément vide pour équilibrer le centrage du titre */}
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={commonStyles.flex1}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.iconCircle}>
              <Ionicons name="bicycle" size={32} color={colors.primary} />
            </View>
            <Text style={styles.title}>Rejoignez l’équipe Good Food</Text>
            <Text style={styles.subtitle}>
              Complétez vos informations professionnelles pour débuter vos
              livraisons.
            </Text>
          </View>

          {/* Moyen de transport */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. Moyen de transport</Text>
            <View style={styles.vehicleGrid}>
              {VEHICLES.map((v) => {
                const isActive = formData.vehicleType === v.id;
                return (
                  <TouchableOpacity
                    key={v.id}
                    style={[
                      styles.vehicleCard,
                      isActive && styles.vehicleCardActive,
                    ]}
                    onPress={() => handleChange("vehicleType", v.id)}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={v.icon}
                      size={20}
                      color={isActive ? colors.primary : colors.textSecondary}
                    />
                    <Text
                      style={[
                        styles.vehicleText,
                        isActive && styles.vehicleTextActive,
                      ]}
                    >
                      {v.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Informations Légales & Coordonnées */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              2. Informations légales & Zone
            </Text>
            <View style={styles.form}>
              <AuthInput
                label="Numéro SIREN / SIRET (9 chiffres)"
                placeholder="123456789"
                iconName="briefcase-outline"
                keyboardType="numeric"
                maxLength={9}
                value={formData.siret}
                onChangeText={(val) => handleChange("siret", val)}
              />

              <AuthInput
                label="Ville / Secteur d'activité"
                placeholder="Paris, Rouen, Lyon..."
                iconName="location-outline"
                value={formData.city}
                onChangeText={(val) => handleChange("city", val)}
              />

              {isMotorized && (
                <AuthInput
                  label="Numéro de permis de conduire"
                  placeholder="Ex : 12AB34567"
                  iconName="card-outline"
                  value={formData.drivingLicenseNumber}
                  onChangeText={(val) =>
                    handleChange("drivingLicenseNumber", val)
                  }
                />
              )}

              <AuthInput
                label="IBAN pour vos virements"
                placeholder="FR76 ...."
                iconName="cash-outline"
                autoCapitalize="characters"
                value={formData.iban}
                onChangeText={(val) => handleChange("iban", val)}
              />

              {/* Validation sac isotherme */}
              <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() =>
                  handleChange("hasBagEquipped", !formData.hasBagEquipped)
                }
                activeOpacity={0.7}
              >
                <Ionicons
                  name={formData.hasBagEquipped ? "checkbox" : "square-outline"}
                  size={24}
                  color={
                    formData.hasBagEquipped
                      ? colors.primary
                      : colors.textSecondary
                  }
                />
                <Text style={styles.checkboxText}>
                  Je dispose d'un sac isotherme adapté au transport de repas.
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={styles.submitBtn}
            onPress={handleSubmit}
            activeOpacity={0.8}
          >
            <Text style={styles.submitBtnText}>Valider et commencer</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
