import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import type { Certificate } from "@/types/Certificate";

const fetchCertificates = async (): Promise<Certificate[]> => {
  const { data, error } = await supabase
    .from("certificate")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching certificates:", error);
    throw new Error(error.message);
  }

  return data || [];
};

export const useCertificates = () => {
  return useQuery({
    queryKey: ["certificates"],
    queryFn: fetchCertificates,
    staleTime: 1000 * 60 * 5,
    select: (certificates: Certificate[]) =>
      certificates.map((certificate) => {
        if (!certificate.image_path) {
          return { ...certificate, image_public_url: "" };
        }

        const { data } = supabase.storage
          .from("certificates")
          .getPublicUrl(certificate.image_path);

        return {
          ...certificate,
          image_public_url: data.publicUrl,
        };
      }),
  });
};
