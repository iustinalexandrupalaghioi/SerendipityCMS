export type WorkHour = {
  id: string;
  time: string;
  created_at: string;
};

export type WorkHourResponse = {
  date: string;
  time: string[];
};

export interface AvailableWorkHoursRow {
  date: string; // ISO date string (YYYY-MM-DD)
  available_times: string[]; // "HH:mm"
}

export interface AvailableWorkHoursResponse {
  success: boolean;
  data: AvailableWorkHoursRow[];
}
