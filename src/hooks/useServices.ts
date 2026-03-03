import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import type { Service } from "@/types/Service";

const fetchServices = async (): Promise<Service[]> => {
  const { data, error } = await supabase
    .from("service")
    .select("*, category:category_id (*)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching services:", error);
    throw new Error(error.message);
  }

  return data || [];
};

export const useServices = () => {
  return useQuery({
    queryKey: ["services"],
    queryFn: fetchServices,
    staleTime: 1000 * 60 * 5,
    select: (services: Service[]) =>
      services.map((service) => {
        if (!service.image_path) {
          return { ...service, image_public_url: "" };
        }

        const { data } = supabase.storage
          .from("services")
          .getPublicUrl(service.image_path);

        return {
          ...service,
          image_public_url: data.publicUrl,
        };
      }),
  });
};
