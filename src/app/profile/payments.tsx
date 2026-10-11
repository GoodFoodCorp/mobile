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
import { paymentService } from "../../services/paymentService";
import { PaymentMethod, PaymentMethodInput } from "../../types/payment";

export default function PaymentsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<PaymentMethodInput>({
    provider_payment_method_id: "",
    brand: "",
    last4: "",
    expiry_month: 1,
    expiry_year: new Date().getFullYear() + 1,
    is_default: false,
  });

  const load = async () => {
    try {
      setMethods(await paymentService.listMethods());
    } catch (error: any) {
      Alert.alert("Impossible de charger les cartes", error.message);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const add = async () => {
    if (
      !form.provider_payment_method_id ||
      !form.brand ||
      !/^\d{4}$/.test(form.last4)
    ) {
      Alert.alert(
        "Informations invalides",
        "Utilisez un moyen tokenisé et ses quatre derniers chiffres.",
      );
      return;
    }
    try {
      await paymentService.addMethod(form);
      setShowForm(false);
      setForm({
        ...form,
        provider_payment_method_id: "",
        brand: "",
        last4: "",
      });
      await load();
    } catch (error: any) {
      Alert.alert("Ajout impossible", error.message);
    }
  };

  const remove = (id: string) =>
    Alert.alert("Supprimer la carte", "Cette action est définitive.", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: async () => {
          try {
            await paymentService.deleteMethod(id);
            await load();
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
        >
          <Ionicons name="arrow-back" size={22} color={colors.primary} />
        </TouchableOpacity>
        <Text style={[styles.topBarTitle, { color: colors.primary }]}>
          Moyens de paiement
        </Text>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {methods.length === 0 && (
          <Text style={{ color: colors.textSecondary }}>
            Aucun moyen de paiement enregistré.
          </Text>
        )}
        {methods.map((method) => (
          <View
            key={method.id}
            style={[
              styles.card,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <View style={styles.rowBetween}>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
              >
                <Ionicons
                  name="card-outline"
                  size={22}
                  color={colors.primary}
                />
                <Text style={[styles.itemTitle, { color: colors.textDark }]}>
                  {method.brand} •••• {method.last4}
                </Text>
              </View>
              <TouchableOpacity onPress={() => remove(method.id)}>
                <Ionicons name="trash-outline" size={20} color="#e74c3c" />
              </TouchableOpacity>
            </View>
            <Text
              style={[
                styles.itemSubtitle,
                { marginLeft: 32, color: colors.textSecondary },
              ]}
            >
              Expire {String(method.expiry_month).padStart(2, "0")}/
              {method.expiry_year}
            </Text>
          </View>
        ))}
        {showForm && (
          <View
            style={[
              styles.card,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <Text
              style={[styles.itemSubtitle, { color: colors.textSecondary }]}
            >
              Le moyen doit être tokenisé par Stripe. Aucun numéro complet n’est
              demandé.
            </Text>
            {(["provider_payment_method_id", "brand", "last4"] as const).map(
              (field) => (
                <TextInput
                  key={field}
                  placeholder={
                    field === "provider_payment_method_id"
                      ? "Identifiant Stripe"
                      : field === "brand"
                        ? "Marque"
                        : "4 derniers chiffres"
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
              ),
            )}
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: colors.primary }]}
              onPress={add}
            >
              <Text style={styles.actionBtnText}>Enregistrer</Text>
            </TouchableOpacity>
          </View>
        )}
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: colors.primary }]}
          onPress={() => setShowForm((value) => !value)}
        >
          <Text style={styles.actionBtnText}>
            {showForm ? "Annuler" : "Ajouter une carte"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
