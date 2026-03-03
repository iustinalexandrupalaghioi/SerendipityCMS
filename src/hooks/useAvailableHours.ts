import { supabase } from "@/lib/supabaseClient";
import type { AvailableWorkHoursResponse } from "@/types/WorkHour";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

interface UseAvailableHoursParams {
  date: string;
  duration: number;
  enabled?: boolean;
  appointmentId?: string;
}

export const useAvailableHours = ({
  date,
  duration,
  enabled = true,
  appointmentId,
}: UseAvailableHoursParams) => {
  return useQuery<string[]>({
    queryKey: ["available_hours", date, duration],
    queryFn: async () => {
      const time = format(new Date(), "HH:mm");
      const { data, error } =
        await supabase.functions.invoke<AvailableWorkHoursResponse>(
          "get-available-hours",
          {
            body: { date, duration, time, id: appointmentId },
          },
        );

      if (error) {
        throw error;
      }

      return data?.data?.[0]?.available_times ?? [];
    },
    enabled: enabled && !!date,
  });
};
