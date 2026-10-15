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

import AuthInput from "./AuthInput";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { LoginFormData } from "../types/auth";
import { commonStyles } from "../styles/common.styles";
import { authStyles as styles } from "../styles/auth.styles";

/** Écran de connexion : l'application est réservée aux livreurs. */
export default function LoginView() {
  const { login } = useAuth();
  const { colors } = useTheme();
  const [loginData, setLoginData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const handleSubmit = async () => {
    if (!loginData.email.trim() || !loginData.password.trim()) {
      Alert.alert(
        "Champs requis",
        "Veuillez renseigner votre adresse e-mail et votre mot de passe.",
      );
      return;
    }
    await login(loginData);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={commonStyles.flex1}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <View
              style={[
                styles.logoBadge,
                { backgroundColor: colors.primary, borderColor: colors.accent },
              ]}
            >
              <Text style={[styles.logoBadgeText, { color: colors.accent }]}>
                GOOD{"\n"}FOOD
              </Text>
            </View>
            <Text style={[styles.title, { color: colors.primary }]}>
              Espace livreur
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Connectez-vous pour voir les commandes à livrer
            </Text>
          </View>

          <View style={styles.form}>
            <AuthInput
              label="Adresse e-mail"
              placeholder="exemple@email.com"
              iconName="mail-outline"
              keyboardType="email-address"
              value={loginData.email}
              onChangeText={(email) =>
                setLoginData((prev) => ({ ...prev, email }))
              }
            />
            <AuthInput
              label="Mot de passe"
              placeholder="••••••••"
              iconName="lock-closed-outline"
              isPassword
              value={loginData.password}
              onChangeText={(password) =>
                setLoginData((prev) => ({ ...prev, password }))
              }
            />

            <TouchableOpacity
              style={[styles.submitBtn, { backgroundColor: colors.accent }]}
              onPress={handleSubmit}
              activeOpacity={0.8}
            >
              <Text style={[styles.submitBtnText, { color: colors.primary }]}>
                Se connecter
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
