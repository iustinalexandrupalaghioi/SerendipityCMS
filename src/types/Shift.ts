import type { WorkHour } from "./WorkHour";

export type Shift = {
  id: string;
  day_start_time: string;
  day_end_time: string;
  interval: number;
  is_active: boolean;
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
  work_hours: WorkHour[];
  created_at: string;
};
