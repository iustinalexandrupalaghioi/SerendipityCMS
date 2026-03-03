import { supabase } from "@/lib/supabaseClient";
import { useQueryClient } from "@tanstack/react-query";
import { CheckIcon, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

type Props = {
  id: string;
};

const CompleteAppointmentAction = ({ id }: Props) => {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const completeAppointment = async () => {
    try {
      setLoading(true);

      const { error } = await supabase
        .from("appointment")
        .update({ status: "completed" })
        .eq("id", id);

      if (error) throw error;

      toast.success("Appointment successfully completed.");

      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    } catch (error: any) {
      toast.error(error.message || "Failed to complete appointment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DropdownMenuItem
      disabled={loading}
      onSelect={(e) => {
        e.preventDefault();
        completeAppointment();
      }}
    >
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <CheckIcon className="mr-2 h-4 w-4" />
      )}
      Complete
    </DropdownMenuItem>
  );
};

export default CompleteAppointmentAction;
