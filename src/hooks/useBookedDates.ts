import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

interface UseFullyBookedDatesParams {
  serviceDuration: number;
  enabled?: boolean;
}

export const useFullyBookedDates = ({
  serviceDuration,
  enabled = true,
}: UseFullyBookedDatesParams) => {
  return useQuery<string[]>({
    queryKey: ["fully_booked_dates", serviceDuration],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke<{
        success: boolean;
        data: string[];
      }>("get_fully_booked_dates", {
        body: { serviceDuration },
      });

      if (error) {
        throw error;
      }

      if (!data?.success) {
        throw new Error("Failed to fetch fully booked dates");
      }

      return data.data; // array of "yyyy-mm-dd" strings
    },
    enabled: enabled && !!serviceDuration,
  });
};
