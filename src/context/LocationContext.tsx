import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  locationService,
  UserCoordinates,
  FormattedAddress,
} from "../services/locationService";

const LOCATION_STORAGE_KEY = "@goodfood_user_location";

interface LocationContextType {
  coords: UserCoordinates | null;
  address: FormattedAddress | null;
  displayLocation: string;
  isLoading: boolean;
  requestLocation: () => Promise<void>;
  setCustomAddress: (
    address: FormattedAddress,
    coords?: UserCoordinates,
  ) => Promise<void>;
}

const LocationContext = createContext<LocationContextType | undefined>(
  undefined,
);

export function LocationProvider({ children }: { children: ReactNode }) {
  const [coords, setCoords] = useState<UserCoordinates | null>(null);
  const [address, setAddress] = useState<FormattedAddress | null>(null);
  const [displayLocation, setDisplayLocation] = useState<string>(
    "Paris République, 75001",
  ); // Valeur par défaut
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Charger la dernière position mémorisée
  useEffect(() => {
    async function loadStoredLocation() {
      try {
        const saved = await AsyncStorage.getItem(LOCATION_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          setCoords(parsed.coords);
          setAddress(parsed.address);
          setDisplayLocation(parsed.address.displayAddress);
        }
      } catch (error) {
        console.error("Erreur chargement localisation en cache :", error);
      }
    }
    loadStoredLocation();
  }, []);

  // Déclencher la détection GPS
  const requestLocation = async () => {
    setIsLoading(true);
    try {
      const data = await locationService.getUserAddress();
      if (data) {
        setCoords(data.coords);
        setAddress(data.address);
        setDisplayLocation(data.address.displayAddress);

        await AsyncStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(data));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const setCustomAddress = async (
    newAddress: FormattedAddress,
    newCoords?: UserCoordinates,
  ) => {
    setAddress(newAddress);
    setDisplayLocation(newAddress.displayAddress);
    if (newCoords) setCoords(newCoords);

    await AsyncStorage.setItem(
      LOCATION_STORAGE_KEY,
      JSON.stringify({ address: newAddress, coords: newCoords || coords }),
    );
  };

  return (
    <LocationContext.Provider
      value={{
        coords,
        address,
        displayLocation,
        isLoading,
        requestLocation,
        setCustomAddress,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useLocation doit être utilisé dans un LocationProvider");
  }
  return context;
}
