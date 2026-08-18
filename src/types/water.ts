export interface UserSettings {
  id?: string;
  user_id: string;
  min_water_ml: number;
  target_water_ml: number;
  max_water_ml: number;
  created_at?: string;
}

export interface WaterLog {
  id?: string;
  user_id: string;
  amount_ml: number;
  date: string;
  created_at?: string;
}