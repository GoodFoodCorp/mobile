import { VehicleType } from "./delivery";

export interface CourierProfile {
  id: string;
  userId: string;
  vehicleType: VehicleType;
  siret: string;
  city: string;
  hasBagEquipped: boolean;
  isAvailable: boolean;
  availableBalance: number;
  totalEarned: number;
  completedTrips: number;
}

export interface CourierApplication {
  vehicleType: VehicleType;
  siret: string;
  city: string;
  iban: string;
  drivingLicenseNumber?: string;
  hasBagEquipped: boolean;
}
