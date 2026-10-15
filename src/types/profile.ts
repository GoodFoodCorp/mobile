export interface UserProfile {
  user_id: string;
  first_name: string;
  last_name: string;
  phone: string;
  updated_at: string;
}

export interface ProfileUpdate {
  first_name: string;
  last_name: string;
  phone: string;
}
