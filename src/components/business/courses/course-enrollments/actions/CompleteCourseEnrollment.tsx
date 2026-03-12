import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";
import { useQueryClient } from "@tanstack/react-query";
import { CheckIcon, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
  id: string;
};

const CompleteAppointmentAction = ({ id }: Props) => {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const completeCourseEnrollment = async () => {
    try {
      setLoading(true);

      const { error } = await supabase
        .from("course_enrollment")
        .update({ status: "completed" })
        .eq("id", id);

      if (error) throw error;

      toast.success("Course enrollment successfully completed.");

      queryClient.invalidateQueries({ queryKey: ["course_enrollments"] });
    } catch (error: any) {
      toast.error(error.message || "Failed to complete course enrollment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button size="icon" disabled={loading} onClick={completeCourseEnrollment}>
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <CheckIcon className="h-4 w-4" />
      )}
    </Button>
  );
};

export default CompleteAppointmentAction;
