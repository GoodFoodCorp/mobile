import { JwtPayload, User } from "../types/auth";

/**
 * Décode la partie Payload d'un token JWT sans bibliothèque tierce
 */
export function decodeJwt(token: string): JwtPayload {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    throw new Error("Format de token invalide");
  }
}

/**
 * Transforme le payload JWT en objet User pour l'application
 */
export function mapJwtToUser(token: string): User {
  const payload = decodeJwt(token);
  const rawRole = (
    payload.role_slugs?.[0] ||
    payload.roles?.[0] ||
    "client"
  ).toLowerCase();

  // Si le rôle reçu est "user", on le normalise en "Client"
  const normalizedRoleName =
    rawRole === "user"
      ? "Client"
      : rawRole.charAt(0).toUpperCase() + rawRole.slice(1);

  // Génère un nom d'affichage à partir de l'e-mail si aucun nom complet n'est fourni
  const defaultName = payload.email.split("@")[0];
  const formattedName =
    defaultName.charAt(0).toUpperCase() + defaultName.slice(1);

  return {
    id: payload.sub,
    email: payload.email,
    fullName: formattedName,
    role: {
      id: `role_${rawRole}`,
      name: normalizedRoleName,
    },
    createdAt: new Date().toISOString(),
  };
}
