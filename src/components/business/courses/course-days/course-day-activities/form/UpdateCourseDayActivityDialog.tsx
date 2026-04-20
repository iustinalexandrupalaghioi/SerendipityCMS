import UpdateDialog from "@/components/partials/dialog/UpdateDialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { supabase } from "@/lib/supabaseClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { useEffect, type Dispatch, type SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import type { CourseDay, CourseDayActivity } from "@/types/Course";
import CourseDayActivityForm from "./CourseDayActivityForm";
import {
  CourseDayActivitySchema,
  type CourseDayActivityFormValues,
} from "./form-schema";

interface UpdateCourseDayActivityDialogProps {
  activity: CourseDayActivity;
  course_day: CourseDay;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export function UpdateCourseDayActivityDialog({
  activity,
  course_day,
  open,
  setOpen,
}: UpdateCourseDayActivityDialogProps) {
  const queryClient = useQueryClient();

  const form = useForm<CourseDayActivityFormValues>({
    resolver: zodResolver(CourseDayActivitySchema),
    defaultValues: { ...activity, course_day },
  });

  /* =====================
     RESET ON OPEN
  ====================== */
  useEffect(() => {
    if (open) {
      form.reset({ ...activity, course_day });
    }
  }, [open, activity, form]);

  /* =====================
     MUTATION
  ====================== */
  const updateCourseDayActivityMutation = useMutation({
    mutationFn: async (values: CourseDayActivityFormValues) => {
      if (!values.id) {
        throw new Error("Activity ID is missing.");
      }

      const { data, error } = await supabase
        .from("course_day_activity")
        .update({
          activity: values.activity,
        })
        .eq("id", values.id)
        .select()
        .single();

      if (error) throw error;

      return data;
    },

    onSuccess: () => {
      toast.success("Course day activity updated successfully!");
      queryClient.refetchQueries({ queryKey: ["course-day-activities"] });
      queryClient.refetchQueries({ queryKey: ["course-day", course_day.id] });
      setOpen(false);
    },

    onError: (error: any) => {
      toast.error(error.message || "Failed to update course day activity.");
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    updateCourseDayActivityMutation.mutate(values);
  });

  return (
    <UpdateDialog
      open={open}
      setOpen={setOpen}
      title={activity.activity}
      description="Update the details of the course day activity below."
      className="md:max-w-lg"
    >
      <Form {...form}>
        <form onSubmit={onSubmit} className="flex flex-col min-h-0">
          <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin dark:scrollbar-track-[#09090b] scrollbar-thumb-rounded scrollbar-thumb-primary px-1">
            <CourseDayActivityForm
              mode="Add"
              control={form.control}
              errors={form.formState.errors}
            />
          </div>

          <div className="flex shrink-0 border-t flex-col md:flex-row-reverse gap-2 pt-4 mt-4">
            <Button
              type="submit"
              className="flex-1"
              disabled={
                !form.formState.isDirty ||
                updateCourseDayActivityMutation.isPending
              }
            >
              {updateCourseDayActivityMutation.isPending ? (
                <>
                  <Loader2Icon className="animate-spin mr-2 h-4 w-4" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </UpdateDialog>
  );
}
