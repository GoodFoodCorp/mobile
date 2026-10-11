import { useEffect, useState } from "react";
import {
  Alert,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { useTheme } from "../../context/ThemeContext";
import { subscreenStyles as styles } from "../../styles/subscreens.styles";
import { profileService } from "../../services/profileService";
import { Address, AddressInput } from "../../types/profile";

export default function AddressesScreen() {
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<AddressInput>({
    label: "",
    street: "",
    zip_code: "",
    city: "",
    is_default: false,
  });
  const { colors } = useTheme();

  const loadAddresses = async () => {
    try {
      setAddresses(await profileService.listAddresses());
    } catch (error: any) {
      Alert.alert("Impossible de charger les adresses", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadAddresses();
  }, []);

  const addAddress = async () => {
    if (!form.street.trim() || !form.city.trim()) {
      Alert.alert("Champs requis", "La rue et la ville sont obligatoires.");
      return;
    }
    try {
      await profileService.addAddress({
        ...form,
        label: form.label.trim() || "Domicile",
      });
      setForm({
        label: "",
        street: "",
        zip_code: "",
        city: "",
        is_default: false,
      });
      setShowForm(false);
      await loadAddresses();
    } catch (error: any) {
      Alert.alert("Ajout impossible", error.message);
    }
  };

  const deleteAddress = (id: string) =>
    Alert.alert("Supprimer l’adresse", "Cette action est définitive.", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: async () => {
          try {
            await profileService.deleteAddress(id);
            await loadAddresses();
          } catch (error: any) {
            Alert.alert("Suppression impossible", error.message);
          }
        },
      },
    ]);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={[styles.topBar, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: colors.inputBg }]}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color={colors.primary} />
        </TouchableOpacity>
        <Text style={[styles.topBarTitle, { color: colors.primary }]}>
          Mes adresses
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <Text style={{ color: colors.textSecondary }}>Chargement...</Text>
        ) : (
          addresses.map((item) => (
            <View
              key={item.id}
              style={[
                styles.card,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
            >
              <View style={styles.rowBetween}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <Ionicons
                    name="location-outline"
                    size={20}
                    color={colors.primary}
                  />
                  <Text style={[styles.itemTitle, { color: colors.textDark }]}>
                    {item.label}
                  </Text>
                </View>
                {item.is_default && (
                  <View
                    style={[
                      styles.badgeDefault,
                      { backgroundColor: colors.accentLight },
                    ]}
                  >
                    <Text style={styles.badgeDefaultText}>Par défaut</Text>
                  </View>
                )}
              </View>
              <Text
                style={[
                  styles.itemSubtitle,
                  { marginLeft: 30, color: colors.textSecondary },
                ]}
              >
                {item.full_address}
              </Text>
              <TouchableOpacity onPress={() => deleteAddress(item.id)}>
                <Ionicons name="trash-outline" size={20} color="#e74c3c" />
              </TouchableOpacity>
            </View>
          ))
        )}

        {showForm && (
          <View
            style={[
              styles.card,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            {(["label", "street", "zip_code", "city"] as const).map((field) => (
              <TextInput
                key={field}
                placeholder={
                  field === "label"
                    ? "Libellé"
                    : field === "street"
                      ? "Rue"
                      : field === "zip_code"
                        ? "Code postal"
                        : "Ville"
                }
                value={form[field]}
                onChangeText={(value) =>
                  setForm((current) => ({ ...current, [field]: value }))
                }
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: colors.border,
                  paddingVertical: 10,
                  color: colors.textDark,
                }}
              />
            ))}
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: colors.primary }]}
              onPress={addAddress}
            >
              <Text style={styles.actionBtnText}>Enregistrer l’adresse</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: colors.primary }]}
          onPress={() => setShowForm((value) => !value)}
          activeOpacity={0.8}
        >
          <Text style={styles.actionBtnText}>Ajouter une adresse</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
