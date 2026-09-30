export interface OrderAddress {
  street: string;
  city: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
}

export interface ReadyOrderRestaurant {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

export interface ReadyOrderDelivery {
  address: string;
  latitude?: number;
  longitude?: number;
  clientName?: string;
  clientPhone?: string;
}

export interface ApiOrderItem {
  id: string;
  menu_item_id: string;
  menu_item_name: string;
  quantity: number;
  unit_price_cents: number;
}

export interface ApiReadyOrder {
  id: string;
  customer_id: string;
  restaurant_id: string;
  status: "READY_FOR_PICKUP" | string;
  total_amount_cents: number;
  delivery_address: string;
  items: ApiOrderItem[];
  placed_at: string;
  // Champs calculés ou enrichis côté front
  distanceKm?: number;
}

export interface ReadyOrderItem {
  id: string;
  name: string;
  quantity: number;
}

export interface ReadyForDeliveryOrder {
  id: string;
  orderNumber: string;
  status: string;
  restaurant: ReadyOrderRestaurant;
  delivery: ReadyOrderDelivery;
  items: ReadyOrderItem[];
  deliveryEarnings: number;
  pickupTimeLimit?: string;
  createdAt: string;
}
