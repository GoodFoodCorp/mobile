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
import { useTheme } from "../../context/ThemeContext";
import { commonStyles } from "../../styles/common.styles";
import { personalInfoStyles as styles } from "../../styles/personalInfo.styles";

export default function PersonalInfoScreen() {
  const router = useRouter();
  const { user, updateProfile } = useAuth();
  const { colors } = useTheme();

  // Initialisation du state avec les données de l'utilisateur
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");

  // Génération des initiales pour l'avatar
  const initials = fullName
    ? fullName
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "GF";

  const handleSave = async () => {
    if (!fullName.trim() || !email.trim()) {
      Alert.alert("Erreur", "Le nom et l’adresse e-mail sont obligatoires.");
      return;
    }

    await updateProfile({ fullName, email, phone });
    Alert.alert("Succès", "Vos informations ont été mises à jour.", [
      { text: "OK", onPress: () => router.back() },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Supprimer le compte",
      "Êtes-vous sûr de vouloir supprimer définitivement votre compte ? Cette action est irréversible.",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => console.log("Suppression du compte..."),
        },
      ],
    );
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
          Mes infos personnelles
        </Text>
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
          {/* Avatar Modifiable */}
          <View style={styles.avatarContainer}>
            <View
              style={[styles.avatarBadge, { backgroundColor: colors.primary }]}
            >
              <Text style={[styles.avatarText, { color: colors.accent }]}>
                {initials}
              </Text>
              <TouchableOpacity
                style={styles.editAvatarBtn}
                activeOpacity={0.8}
              >
                <Ionicons name="camera" size={14} color={colors.primaryDark} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Formulaire */}
          <View style={styles.form}>
            <AuthInput
              label="Nom complet"
              placeholder="Jean Dupont"
              iconName="person-outline"
              value={fullName}
              onChangeText={setFullName}
            />

            <AuthInput
              label="Adresse e-mail"
              placeholder="exemple@email.com"
              iconName="mail-outline"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />

            <AuthInput
              label="Numéro de téléphone"
              placeholder="06 12 34 56 78"
              iconName="call-outline"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
          </View>

          <TouchableOpacity
            style={[styles.saveBtn, { backgroundColor: colors.primary }]}
            onPress={handleSave}
            activeOpacity={0.8}
          >
            <Text style={[styles.saveBtnText, { color: colors.white }]}>
              Enregistrer les modifications
            </Text>
          </TouchableOpacity>

          {/* Bouton de suppression de compte */}
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={handleDeleteAccount}
            activeOpacity={0.7}
          >
            <Text style={styles.deleteBtnText}>Supprimer mon compte</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
