import { supabase } from "@/lib/supabaseClient";
import type { Shift } from "@/types/Shift";
import { useQuery } from "@tanstack/react-query";

const fetchShifts = async (): Promise<Shift[]> => {
  const { data, error } = await supabase
    .from("shift")
    .select("*, work_hour (*)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching business hours:", error);
    throw new Error(error.message);
  }

  return data || [];
};

export const useShifts = () => {
  return useQuery({
    queryKey: ["shifts"],
    queryFn: fetchShifts,
    staleTime: 1000 * 60 * 5,
  });
};
