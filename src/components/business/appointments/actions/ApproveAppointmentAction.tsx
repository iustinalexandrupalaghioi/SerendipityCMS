import { supabase } from "@/lib/supabaseClient";
import { useQueryClient } from "@tanstack/react-query";
import { CheckIcon, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

type Props = {
  id: string;
};

const ApproveAppointmentAction = ({ id }: Props) => {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const approveAppointment = async () => {
    try {
      setLoading(true);

      const { error } = await supabase
        .from("appointment")
        .update({ status: "approved" })
        .eq("id", id);

      if (error) throw error;

      toast.success("Appointment successfully approved.");

      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    } catch (error: any) {
      toast.error(error.message || "Failed to approve appointment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DropdownMenuItem
      disabled={loading}
      onSelect={(e) => {
        e.preventDefault(); // prevent auto-close if needed
        approveAppointment();
      }}
    >
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <CheckIcon className="mr-2 h-4 w-4" />
      )}
      Approve
    </DropdownMenuItem>
  );
};

export default ApproveAppointmentAction;
