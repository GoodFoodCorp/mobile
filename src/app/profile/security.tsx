import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import AuthInput from "../../components/AuthInput";
import { useTheme } from "../../context/ThemeContext";
import { subscreenStyles as styles } from "../../styles/subscreens.styles";

export default function SecurityScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleUpdatePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs.");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Erreur", "Les nouveaux mots de passe ne correspondent pas.");
      return;
    }

    Alert.alert("Succès", "Votre mot de passe a bien été modifié.", [
      { text: "OK", onPress: () => router.back() },
    ]);
  };

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
          Sécurité & Mot de passe
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ gap: 14 }}>
          <AuthInput
            label="Mot de passe actuel"
            placeholder="••••••••"
            iconName="lock-closed-outline"
            isPassword
            value={currentPassword}
            onChangeText={setCurrentPassword}
          />

          <AuthInput
            label="Nouveau mot de passe"
            placeholder="••••••••"
            iconName="lock-closed-outline"
            isPassword
            value={newPassword}
            onChangeText={setNewPassword}
          />

          <AuthInput
            label="Confirmer le nouveau mot de passe"
            placeholder="••••••••"
            iconName="lock-closed-outline"
            isPassword
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>

        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: colors.primary }]}
          onPress={handleUpdatePassword}
          activeOpacity={0.8}
        >
          <Text style={styles.actionBtnText}>
            Mettre à jour le mot de passe
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
