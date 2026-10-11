export interface UserSettings {
  user_id: string;
  dark_mode: boolean;
  cutlery: boolean;
  order_tracking: boolean;
  promos: boolean;
  newsletter: boolean;
}

export type SettingsUpdate = Partial<Omit<UserSettings, "user_id">>;
