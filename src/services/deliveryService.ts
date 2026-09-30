import { apiClient } from "./api";
import { DeliveryDetail } from "../types/delivery";

export const deliveryService = {
  /**
   * Récupérer la liste des livraisons disponibles
   */
  async getAvailableDeliveries(): Promise<DeliveryDetail[]> {
    return apiClient<DeliveryDetail[]>(`/api/deliveries/available`, {
      method: "GET",
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
  async dropoffDelivery(id: string): Promise<DeliveryDetail> {
    return apiClient<DeliveryDetail>(`/api/deliveries/${id}/dropoff`, {
      method: "POST",
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
