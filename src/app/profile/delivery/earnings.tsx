import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { useTheme } from "../../../context/ThemeContext";
import { deliverySpaceStyles as styles } from "../../../styles/deliverySpace.styles";
import { deliveryService } from "../../../services/deliveryService";
import { courierService } from "../../../services/courierService";
import { CourierHistory } from "../../../types/delivery";

const EMPTY_HISTORY: CourierHistory = {
  totalEarned: 0,
  availableBalance: 0,
  withdrawnTotal: 0,
  pendingAmount: 0,
  minWithdrawal: 10,
  completedTrips: 0,
  trips: [],
  ibanMasked: "",
  withdrawals: [],
};

const formatEuro = (value: number) => `${value.toFixed(2).replace(".", ",")} €`;

const formatDate = (iso: string | null) =>
  iso
    ? new Date(iso).toLocaleString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

export default function EarningsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [history, setHistory] = useState<CourierHistory>(EMPTY_HISTORY);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [editingIban, setEditingIban] = useState(false);
  const [ibanInput, setIbanInput] = useState("");

  const load = useCallback(async () => {
    try {
      setHistory(await deliveryService.getHistory());
    } catch (error: any) {
      Alert.alert("Gains indisponibles", error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const hasPending = history.pendingAmount > 0;
  const belowMinimum = history.availableBalance < history.minWithdrawal;
  const canWithdraw =
    !busy && !hasPending && !belowMinimum && history.ibanMasked !== "";

  // Pourquoi le bouton est désactivé (affiché sous le solde)
  const withdrawHint = hasPending
    ? "Une demande de retrait est en cours de traitement."
    : history.ibanMasked === ""
      ? "Enregistrez votre IBAN pour pouvoir retirer vos gains."
      : belowMinimum
        ? `Retrait possible à partir de ${formatEuro(history.minWithdrawal)}.`
        : null;

  const handleWithdraw = () => {
    Alert.alert(
      "Retirer mes gains",
      `${formatEuro(history.availableBalance)} seront virés sur l'IBAN ${history.ibanMasked}.`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Confirmer",
          onPress: async () => {
            setBusy(true);
            try {
              await courierService.requestWithdrawal();
              await load();
              Alert.alert(
                "Demande envoyée",
                "Votre retrait est en cours de traitement.",
              );
            } catch (error: any) {
              Alert.alert("Retrait impossible", error.message);
            } finally {
              setBusy(false);
            }
          },
        },
      ],
    );
  };

  const handleSaveIban = async () => {
    if (!ibanInput.trim()) {
      Alert.alert("Erreur", "Saisissez votre IBAN.");
      return;
    }
    setBusy(true);
    try {
      await courierService.setIban(ibanInput);
      setEditingIban(false);
      setIbanInput("");
      await load();
    } catch (error: any) {
      Alert.alert("IBAN refusé", error.message);
    } finally {
      setBusy(false);
    }
  };

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
          Historique des gains
        </Text>
        <View style={{ width: 40 }} />
      </View>
      {loading ? (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View
            style={[styles.balanceCard, { backgroundColor: colors.primary }]}
          >
            <Text style={[styles.balanceLabel, { color: colors.accentLight }]}>
              Solde disponible
            </Text>
            <Text style={[styles.balanceAmount, { color: colors.white }]}>
              {formatEuro(history.availableBalance)}
            </Text>
            <TouchableOpacity
              style={[styles.payoutBtn, { opacity: canWithdraw ? 1 : 0.5 }]}
              onPress={handleWithdraw}
              disabled={!canWithdraw}
            >
              <Text style={styles.payoutBtnText}>
                {busy ? "Veuillez patienter…" : "Retirer mes gains"}
              </Text>
            </TouchableOpacity>
            {withdrawHint && (
              <Text
                style={{
                  color: colors.accentLight,
                  fontSize: 12,
                  marginTop: 10,
                  textAlign: "center",
                }}
              >
                {withdrawHint}
              </Text>
            )}
          </View>

          <Text style={styles.sectionTitle}>Compte bancaire</Text>
          <View
            style={[
              styles.infoCard,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <View style={styles.infoItem}>
              <Text style={[styles.tripMeta, { color: colors.textSecondary }]}>
                IBAN
              </Text>
              <Text style={[styles.tripRestaurant, { color: colors.textDark }]}>
                {history.ibanMasked || "Non renseigné"}
              </Text>
            </View>
            {editingIban ? (
              <View style={{ gap: 10 }}>
                <TextInput
                  value={ibanInput}
                  onChangeText={setIbanInput}
                  placeholder="FR76 1234 5678 9012 3456 7890 123"
                  placeholderTextColor={colors.textSecondary}
                  autoCapitalize="characters"
                  autoCorrect={false}
                  style={{
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: 10,
                    padding: 12,
                    color: colors.textDark,
                    backgroundColor: colors.inputBg,
                  }}
                />
                <View style={{ flexDirection: "row", gap: 10 }}>
                  <TouchableOpacity
                    style={[
                      styles.payoutBtn,
                      { flex: 1, marginTop: 0, alignItems: "center" },
                    ]}
                    onPress={handleSaveIban}
                    disabled={busy}
                  >
                    <Text style={styles.payoutBtnText}>Enregistrer</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onPress={() => {
                      setEditingIban(false);
                      setIbanInput("");
                    }}
                  >
                    <Text style={{ color: colors.textSecondary }}>Annuler</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity onPress={() => setEditingIban(true)}>
                <Text style={{ color: colors.primary, fontWeight: "600" }}>
                  {history.ibanMasked
                    ? "Modifier mon IBAN"
                    : "Ajouter mon IBAN"}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.sectionTitle}>
            Total gagné : {formatEuro(history.totalEarned)}
          </Text>
          <View
            style={[
              styles.infoCard,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <View style={styles.infoItem}>
              <Text style={[styles.tripMeta, { color: colors.textSecondary }]}>
                Courses terminées
              </Text>
              <Text style={[styles.tripAmount, { color: colors.primary }]}>
                {history.completedTrips}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={[styles.tripMeta, { color: colors.textSecondary }]}>
                Déjà versé
              </Text>
              <Text style={[styles.tripAmount, { color: colors.primary }]}>
                {formatEuro(history.withdrawnTotal)}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={[styles.tripMeta, { color: colors.textSecondary }]}>
                En cours de versement
              </Text>
              <Text style={[styles.tripAmount, { color: colors.primary }]}>
                {formatEuro(history.pendingAmount)}
              </Text>
            </View>
          </View>

          {history.withdrawals.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Mes retraits</Text>
              {history.withdrawals.map((withdrawal) => (
                <View key={withdrawal.id} style={styles.tripCard}>
                  <View
                    style={[styles.tripLeft, { flex: 1, paddingRight: 12 }]}
                  >
                    <Text
                      style={[
                        styles.tripRestaurant,
                        { color: colors.textDark },
                      ]}
                    >
                      {withdrawal.status === "PAID" ? "Payé" : "En attente"}
                    </Text>
                    <Text
                      style={[styles.tripMeta, { color: colors.textSecondary }]}
                    >
                      {withdrawal.ibanMasked} ·{" "}
                      {formatDate(withdrawal.paidAt ?? withdrawal.requestedAt)}
                    </Text>
                  </View>
                  <Text style={[styles.tripAmount, { color: colors.primary }]}>
                    {formatEuro(withdrawal.amount)}
                  </Text>
                </View>
              ))}
            </>
          )}

          <Text style={styles.sectionTitle}>Courses</Text>
          {history.trips.length === 0 ? (
            <Text
              style={[styles.sectionTitle, { color: colors.textSecondary }]}
            >
              Aucune course rémunérée pour le moment.
            </Text>
          ) : (
            history.trips.map((trip) => (
              <View key={trip.id} style={styles.tripCard}>
                <View style={[styles.tripLeft, { flex: 1, paddingRight: 12 }]}>
                  <Text
                    style={[styles.tripRestaurant, { color: colors.textDark }]}
                    numberOfLines={1}
                  >
                    {trip.pickupAddress}
                  </Text>
                  <Text
                    style={[styles.tripMeta, { color: colors.textSecondary }]}
                    numberOfLines={1}
                  >
                    → {trip.dropoffAddress}
                  </Text>
                  <Text
                    style={[styles.tripMeta, { color: colors.textSecondary }]}
                  >
                    {formatDate(trip.deliveredAt)}
                  </Text>
                </View>
                <Text style={[styles.tripAmount, { color: colors.primary }]}>
                  +{formatEuro(trip.amount)}
                </Text>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
