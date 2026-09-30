import * as Location from "expo-location";

export interface UserCoordinates {
  latitude: number;
  longitude: number;
}

export interface FormattedAddress {
  displayAddress: string;
  city: string;
  postalCode: string;
  street: string;
}

export const locationService = {
  /**
   * Demande la permission et récupère la position actuelle
   */
  async getCurrentPosition(): Promise<UserCoordinates | null> {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      return null;
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  },

  /**
   * Transforme des coordonnées GPS en adresse postale lisible
   */
  async reverseGeocode(
    coords: UserCoordinates,
  ): Promise<FormattedAddress | null> {
    try {
      const results = await Location.reverseGeocodeAsync(coords);

      if (results && results.length > 0) {
        const place = results[0];

        const city =
          place.city || place.subregion || place.region || "Ma position";
        const postalCode = place.postalCode || "";
        const street = place.street || place.name || "";

        // Format d'affichage : "Paris, 75001" ou "12 Rue de la Paix, Paris"
        const displayAddress = postalCode ? `${city}, ${postalCode}` : city;

        return {
          displayAddress,
          city,
          postalCode,
          street,
        };
      }

      return null;
    } catch (error) {
      console.error("Erreur reverse geocoding :", error);
      return null;
    }
  },

  /**
   * Récupère directement l'adresse complète actuelle
   */
  async getUserAddress(): Promise<{
    coords: UserCoordinates;
    address: FormattedAddress;
  } | null> {
    const coords = await this.getCurrentPosition();
    if (!coords) return null;

    const address = await this.reverseGeocode(coords);
    if (!address) return null;

    return { coords, address };
  },
};
