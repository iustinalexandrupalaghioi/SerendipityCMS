import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/lib/supabaseClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { type Dispatch, type SetStateAction } from "react";
import { toast } from "sonner";

interface CloseEnrollmentDialogDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  courseId: string | number;
  courseTitle: string;
}

const CloseEnrollmentDialog = ({
  open,
  setOpen,
  courseId,
  courseTitle,
}: CloseEnrollmentDialogDialogProps) => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const { count, error: countError } = await supabase
        .from("course_enrollment")
        .select("*", { count: "exact", head: true })
        .eq("course_id", courseId)
        .in("status", ["submitted", "confirmed"]);

      if (countError) throw countError;

      if (count && count > 0) {
        throw new Error(
          "Cannot close enrollments. There are active submitted or confirmed enrollments.",
        );
      }

      const { error } = await supabase
        .from("course")
        .update({ is_open: false, remaining_spots: 0, available_spots: 0 })
        .eq("id", courseId);

      if (error) throw error;
    },
    onSuccess: async () => {
      toast.success(`Enrollments closed for "${courseTitle}"`);

      await queryClient.invalidateQueries({ queryKey: ["courses"] });
      await queryClient.invalidateQueries({
        queryKey: ["course", courseId],
      });

      setOpen(false);
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to close enrollments.");
      setOpen(false);
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="md:min-w-2xl max-w-full mt-4 top-4 translate-y-0">
        <DialogHeader>
          <DialogTitle className="text-primary">
            Close course enrollments
          </DialogTitle>

          <DialogDescription className="text-foreground">
            Are you sure you want to close enrollments for course{" "}
            <strong>{courseTitle}</strong>? <br />
            Students will no longer be able to enroll.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex w-full flex-col md:flex-row-reverse gap-2 mt-4">
          <Button
            onClick={() => mutate()}
            className="flex-1"
            type="button"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2Icon className="animate-spin mr-2 h-4 w-4" />
                Closing...
              </>
            ) : (
              "Yes"
            )}
          </Button>

          <DialogClose asChild>
            <Button type="button" variant="outline" className="flex-1">
              No
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CloseEnrollmentDialog;
