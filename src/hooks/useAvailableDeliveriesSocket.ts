import { useEffect, useRef } from "react";
import { tokenStore } from "../services/tokenStore";
import { io } from "socket.io-client";

import { API_BASE_URL } from "../services/api";
import { courierService } from "../services/courierService";

const MAX_AUTH_RETRIES = 3;

/**
 * Écoute `delivery:available` tant que le livreur est en ligne et appelle
 * `onChange` pour recharger la liste (nouvelle commande, ou reconnexion après
 * une coupure). Le token est relu à chaque (re)connexion ; si le serveur le
 * rejette (expiré), un appel authentifié le renouvelle avant de reconnecter.
 */
export function useAvailableDeliveriesSocket(
  enabled: boolean,
  onChange: () => void,
) {
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    if (!enabled) return;

    let hasConnectedOnce = false;
    let authRetries = 0;

    const socket = io(`${API_BASE_URL}/tracking`, {
      transports: ["websocket"],
      auth: (cb) => {
        tokenStore.getAccessToken()
          .then((token) => cb({ token }))
          .catch(() => cb({}));
      },
    });

    socket.on("connect", () => {
      // La première connexion est déjà couverte par le chargement initial.
      if (hasConnectedOnce) onChangeRef.current();
      hasConnectedOnce = true;
    });

    socket.on("delivery:available", () => onChangeRef.current());
    // A delivery cancelled before anyone took it disappears from the list.
    socket.on("delivery:withdrawn", () => onChangeRef.current());

    socket.on("disconnect", (reason) => {
      if (
        reason !== "io server disconnect" ||
        authRetries >= MAX_AUTH_RETRIES
      ) {
        return;
      }
      authRetries += 1;
      // Token rejeté : apiClient le renouvelle, puis on se reconnecte.
      courierService
        .getProfile()
        .then(() => socket.connect())
        .catch(() => undefined);
    });

    return () => {
      socket.disconnect();
    };
  }, [enabled]);
}
