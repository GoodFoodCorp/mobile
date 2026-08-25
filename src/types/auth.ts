import { Role } from "./role";
// Données saisies lors de la connexion
export interface LoginFormData {
  email: string;
  password: string;
}

// Données saisies lors de l'inscription
export interface RegisterFormData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

// Modèle utilisateur (stocké dans le state global / AsyncStorage après connexion)
export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  role: Role;
  createdAt: string;
}

// Réponse d'authentification API
export interface AuthResponse {
  user: User;
  token: string;
}
