import { apiClient } from "./api";
import { OfferedDelivery, CourierHistory, DeliveryDetail } from "../types/delivery";

export const deliveryService = {
  /**
   * Récupérer la liste des livraisons disponibles
   */
  async getAvailableDeliveries(near?: { lat: number; lng: number }): Promise<OfferedDelivery[]> {
    // Closest first when the courier's position is known.
    const query = near ? `?lat=${near.lat}&lng=${near.lng}&radiusKm=10` : "";
    return apiClient<OfferedDelivery[]>(`/api/deliveries/available${query}`, {
      method: "GET",
      requiresAuth: true,
    });
  },

  /** Rendre une course acceptée avant de l'avoir récupérée. */
  async releaseDelivery(id: string): Promise<DeliveryDetail> {
    return apiClient<DeliveryDetail>(`/api/deliveries/${id}/release`, {
      method: "POST",
      requiresAuth: true,
    });
  },

  /** Récupérer les livraisons actives du coursier connecté */
  async getMyDeliveries(): Promise<DeliveryDetail[]> {
    return apiClient<DeliveryDetail[]>(`/api/deliveries/mine`, {
      method: "GET",
      requiresAuth: true,
    });
  },

  /** Gains et courses livrées du coursier connecté */
  async getHistory(): Promise<CourierHistory> {
    return apiClient<CourierHistory>(`/api/deliveries/history`, {
      method: "GET",
      requiresAuth: true,
    });
  },

  /**
   * Accepter la livraison par le coursier
   */
  async acceptDelivery(id: string): Promise<DeliveryDetail> {
    return apiClient<DeliveryDetail>(`/api/deliveries/${id}/accept`, {
      method: "POST",
      requiresAuth: true,
    });
  },

  /**
   * Indiquer que la commande a été récupérée au restaurant
   */
  async pickupDelivery(id: string): Promise<DeliveryDetail> {
    return apiClient<DeliveryDetail>(`/api/deliveries/${id}/pickup`, {
      method: "POST",
      requiresAuth: true,
    });
  },

  /**
   * Valider la remise au client final
   */
  async dropoffDelivery(id: string, code: string): Promise<DeliveryDetail> {
    // Le code à 4 chiffres donné par le client prouve la remise.
    return apiClient<DeliveryDetail>(`/api/deliveries/${id}/dropoff`, {
      method: "POST",
      body: JSON.stringify({ code }),
      requiresAuth: true,
    });
  },

  /**
   * Récupérer les informations d'une livraison en cours
   */
  async getDeliveryById(id: string): Promise<DeliveryDetail> {
    const response = await apiClient<{ delivery: DeliveryDetail }>(
      `/api/deliveries/${id}`,
      {
        method: "GET",
        requiresAuth: true,
      },
    );
    return response.delivery;
  },
};
