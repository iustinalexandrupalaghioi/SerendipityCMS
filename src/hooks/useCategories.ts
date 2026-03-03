import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import type { Category } from "@/types/Category";

const fetchCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase
    .from("category")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching categories:", error);
    throw new Error(error.message);
  }

  return data || [];
};

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 5,
  });
};
