import { supabase } from "@/lib/supabaseClient";
import type { FreeDay } from "@/types/FreeDay";
import { useQuery } from "@tanstack/react-query";

const fetchFreeDays = async (): Promise<FreeDay[]> => {
  const { data, error } = await supabase
    .from("free_day")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching appointments:", error);
    throw new Error(error.message);
  }

  return data || [];
};

export const useFreeDays = () => {
  return useQuery({
    queryKey: ["free_days"],
    queryFn: fetchFreeDays,
    staleTime: 1000 * 60 * 5,
  });
};
