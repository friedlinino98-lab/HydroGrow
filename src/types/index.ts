export interface UserSettings {
  user_id: string;
  min_water_ml: number;
  target_water_ml: number;
  max_water_ml: number;
}

export interface WaterLog {
  id: string;
  user_id: string;
  amount_ml: number;
  logged_date: string;
  created_at: string;
}

export type WaterStatus = 
  | 'VERY_DRY'
  | 'DRY'
  | 'GROWING'
  | 'OPTIMAL'
  | 'OVERWATER';

export interface WaterProgressState {
  currentMl: number;
  targetMl: number;
  minMl: number;
  maxMl: number;
  percentage: number;
  status: WaterStatus;
  statusMessage: string;
}