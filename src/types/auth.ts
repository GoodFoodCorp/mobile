export interface Role {
  id: string;
  name: string;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  role: Role;
  createdAt: string;
}

// Payload extrait du JWT
export interface JwtPayload {
  sub: string;
  email: string;
  roles?: string[];
  role_slugs?: string[];
  exp: number;
}

// Réponse brute exacte de l'API
export interface AuthApiResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  message: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}
