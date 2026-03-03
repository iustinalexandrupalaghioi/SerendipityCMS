import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import type { Profile } from "@/types/User";

export const fetchProfiles = async (): Promise<Profile[]> => {
  const { data, error } = await supabase
    .from("profile")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return data || [];
};

export const useUserProfiles = () => {
  return useQuery({
    queryKey: ["profiles"],
    queryFn: fetchProfiles,
    staleTime: 1000 * 60 * 5,
  });
};
