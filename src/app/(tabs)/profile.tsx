import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AuthInput from "../../components/AuthInput";
import UserProfileView from "../../components/UserProfileView";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { LoginFormData, RegisterFormData } from "../../types/auth";
import { COLORS } from "../../constants/theme";
import { commonStyles } from "../../styles/common.styles";
import { authStyles as styles } from "../../styles/auth.styles";

const INITIAL_LOGIN: LoginFormData = { email: "", password: "" };
const INITIAL_REGISTER: RegisterFormData = {
  fullName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
};

export default function ProfileScreen() {
  const { user, login, register, logout, isLoading } = useAuth();
  const { colors } = useTheme();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [loginData, setLoginData] = useState<LoginFormData>(INITIAL_LOGIN);
  const [registerData, setRegisterData] =
    useState<RegisterFormData>(INITIAL_REGISTER);

  const handleLoginChange = <K extends keyof LoginFormData>(
    field: K,
    value: LoginFormData[K],
  ) => {
    setLoginData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRegisterChange = <K extends keyof RegisterFormData>(
    field: K,
    value: RegisterFormData[K],
  ) => {
    setRegisterData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (mode === "login") {
      if (!loginData.email.trim() || !loginData.password.trim()) {
        Alert.alert(
          "Champs requis",
          "Veuillez renseigner votre adresse e-mail et votre mot de passe.",
        );
        return;
      }
      await login(loginData);
    } else {
      if (
        !registerData.fullName.trim() ||
        !registerData.email.trim() ||
        !registerData.password.trim()
      ) {
        Alert.alert(
          "Champs requis",
          "Veuillez remplir tous les champs obligatoires.",
        );
        return;
      }
      if (registerData.password !== registerData.confirmPassword) {
        Alert.alert("Erreur", "Les mots de passe ne correspondent pas.");
        return;
      }
      await register(registerData);
    }
  };

  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          commonStyles.rowCenter,
          { justifyContent: "center", backgroundColor: colors.background },
        ]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {user ? (
        <UserProfileView user={user} onLogout={logout} />
      ) : (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={commonStyles.flex1}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.header}>
              <View
                style={[
                  styles.logoBadge,
                  {
                    backgroundColor: colors.primary,
                    borderColor: colors.accent,
                  },
                ]}
              >
                <Text style={[styles.logoBadgeText, { color: colors.accent }]}>
                  GOOD{"\n"}FOOD
                </Text>
              </View>
              <Text style={[styles.title, { color: colors.primary }]}>
                {mode === "login" ? "Bon retour !" : "Créer un compte"}
              </Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                {mode === "login"
                  ? "Connectez-vous pour suivre vos commandes"
                  : "Rejoignez-nous pour commander plus vite"}
              </Text>
            </View>

            <View
              style={[styles.tabContainer, { backgroundColor: colors.inputBg }]}
            >
              <TouchableOpacity
                style={[styles.tabBtn, mode === "login" && styles.tabBtnActive]}
                onPress={() => setMode("login")}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.tabText,
                    mode === "login" && styles.tabTextActive,
                  ]}
                >
                  Connexion
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.tabBtn,
                  mode === "register" && styles.tabBtnActive,
                ]}
                onPress={() => setMode("register")}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.tabText,
                    mode === "register" && styles.tabTextActive,
                  ]}
                >
                  Inscription
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.form}>
              {mode === "register" ? (
                <>
                  <AuthInput
                    label="Nom complet"
                    placeholder="Jean Dupont"
                    iconName="person-outline"
                    value={registerData.fullName}
                    onChangeText={(val) =>
                      handleRegisterChange("fullName", val)
                    }
                  />
                  <AuthInput
                    label="Adresse e-mail"
                    placeholder="exemple@email.com"
                    iconName="mail-outline"
                    keyboardType="email-address"
                    value={registerData.email}
                    onChangeText={(val) => handleRegisterChange("email", val)}
                  />
                  <AuthInput
                    label="Numéro de téléphone"
                    placeholder="06 12 34 56 78"
                    iconName="call-outline"
                    keyboardType="phone-pad"
                    value={registerData.phone}
                    onChangeText={(val) => handleRegisterChange("phone", val)}
                  />
                  <AuthInput
                    label="Mot de passe"
                    placeholder="••••••••"
                    iconName="lock-closed-outline"
                    isPassword
                    value={registerData.password}
                    onChangeText={(val) =>
                      handleRegisterChange("password", val)
                    }
                  />
                  <AuthInput
                    label="Confirmer le mot de passe"
                    placeholder="••••••••"
                    iconName="lock-closed-outline"
                    isPassword
                    value={registerData.confirmPassword}
                    onChangeText={(val) =>
                      handleRegisterChange("confirmPassword", val)
                    }
                  />
                </>
              ) : (
                <>
                  <AuthInput
                    label="Adresse e-mail"
                    placeholder="exemple@email.com"
                    iconName="mail-outline"
                    keyboardType="email-address"
                    value={loginData.email}
                    onChangeText={(val) => handleLoginChange("email", val)}
                  />
                  <AuthInput
                    label="Mot de passe"
                    placeholder="••••••••"
                    iconName="lock-closed-outline"
                    isPassword
                    value={loginData.password}
                    onChangeText={(val) => handleLoginChange("password", val)}
                  />
                </>
              )}

              <TouchableOpacity
                style={[styles.submitBtn, { backgroundColor: colors.accent }]}
                onPress={handleSubmit}
                activeOpacity={0.8}
              >
                <Text style={[styles.submitBtnText, { color: colors.primary }]}>
                  {mode === "login" ? "Se connecter" : "S'inscrire"}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.toggleTextContainer}>
              <Text
                style={[
                  styles.toggleTextMuted,
                  { color: colors.textSecondary },
                ]}
              >
                {mode === "login"
                  ? "Vous n'avez pas de compte ?"
                  : "Vous avez déjà un compte ?"}
              </Text>
              <TouchableOpacity
                onPress={() => setMode(mode === "login" ? "register" : "login")}
                activeOpacity={0.7}
              >
                <Text
                  style={[styles.toggleTextBold, { color: colors.primary }]}
                >
                  {mode === "login" ? "S'inscrire" : "Se connecter"}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
}
