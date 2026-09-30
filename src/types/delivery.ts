export type VehicleType = "bike" | "ebike" | "scooter" | "car";
export type DeliveryStatus =
  | "UNASSIGNED"
  | "ASSIGNED"
  | "PICKED_UP"
  | "IN_TRANSIT"
  | "DELIVERED"
  | "CANCELLED";

export interface DeliveryLocation {
  address: string;
  lat: number;
  lng: number;
}

export interface DeliveryDetail {
  _id: string;
  orderId: string;
  customerId: string;
  restaurantId: string;
  livreurId: string | null;
  status: DeliveryStatus;
  pickup: DeliveryLocation;
  dropoff: DeliveryLocation;
  assignedAt: string | null;
  pickedUpAt: string | null;
  deliveredAt: string | null;
  estimatedDeliveryTime: string;
  createdAt: string;
  updatedAt: string;
}

export interface BecomeDeliveryFormData {
  vehicleType: VehicleType;
  siret: string;
  city: string;
  iban: string;
  drivingLicenseNumber?: string;
  hasBagEquipped: boolean; // Sac isotherme conforme
}

export interface DeliveryTrip {
  id: string;
  orderNumber: string;
  restaurantName: string;
  date: string;
  time: string;
  amount: number;
  tip?: number;
  distanceKm: number;
}

export interface WeeklyEarning {
  day: string;
  amount: number;
}

export interface AvailableDelivery {
  id: string;
  orderNumber: string;
  restaurantName: string;
  restaurantAddress: string;
  deliveryAddress: string;
  distanceRestaurantKm: number;
  deliveryDistanceKm: number;
  earnings: number;
  itemsCount: number;
  pickupTimeLimit: string;
}
