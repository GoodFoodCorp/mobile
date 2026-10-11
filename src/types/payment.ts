export interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  expiry_month: number;
  expiry_year: number;
  is_default: boolean;
}

export interface PaymentMethodInput {
  provider_payment_method_id: string;
  brand: string;
  last4: string;
  expiry_month: number;
  expiry_year: number;
  is_default: boolean;
}
