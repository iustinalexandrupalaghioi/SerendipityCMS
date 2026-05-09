import UpdateDialog from "@/components/partials/dialog/UpdateDialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { supabase } from "@/lib/supabaseClient";
import type { CourseSession } from "@/types/Course";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns/format";
import { Loader2Icon } from "lucide-react";
import { useEffect, type Dispatch, type SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { courseKeys } from "../../overview/useCourses";
import { sessionKeys } from "../nav-overview/useCourseSessions";
import CourseSessionForm from "./CourseSessionForm";
import {
  CourseSessionSchema,
  type CourseSessionFormValues,
} from "./form-schema";

interface UpdateCourseSessionDialogProps {
  session: CourseSession;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const UpdateCourseSessionDialog = ({
  session,
  open,
  setOpen,
}: UpdateCourseSessionDialogProps) => {
  const queryClient = useQueryClient();

  const form = useForm<CourseSessionFormValues>({
    resolver: zodResolver(CourseSessionSchema),
    defaultValues: {
      id: session.id,
      start_date: session.start_date,
      price: session.price,
      advance_price: session.advance_price,
      available_spots: session.available_spots,
      remaining_spots: session.remaining_spots,
      is_open: session.is_open,
    },
  });

  const { control, handleSubmit, formState, reset } = form;

  useEffect(() => {
    if (open) {
      reset({
        id: session.id,
        course: session.course,
        start_date: session.start_date,
        price: session.price,
        advance_price: session.advance_price,
        available_spots: session.available_spots,
        remaining_spots: session.remaining_spots,
        is_open: session.is_open,
      });
    }
  }, [open, session, reset]);

  const updateSessionMutation = useMutation({
    mutationFn: async (values: CourseSessionFormValues) => {
      const { data, error } = await supabase
        .from("course_session")
        .update({
          start_date: values.start_date,
          price: values.price,
          advance_price: values.advance_price,
          available_spots: values.available_spots,
          remaining_spots: values.remaining_spots,
          is_open: values.is_open,
        })
        .eq("id", session.id)
        .single();

      if (error) throw new Error(error.message);
      return data;
    },

    onSuccess: () => {
      toast.success("Course session updated successfully!");
      queryClient.invalidateQueries({
        queryKey: sessionKeys.all,
        refetchType: "all",
      });
      queryClient.invalidateQueries({ queryKey: courseKeys.all });
      queryClient.invalidateQueries({
        queryKey: courseKeys.detail(session.course_id),
      });

      setOpen(false);
    },

    onError: (error: any) => {
      toast.error(error.message || "Failed to update course session.");
    },
  });

  const onSubmit = handleSubmit((values) =>
    updateSessionMutation.mutate(values),
  );

  return (
    <UpdateDialog
      open={open}
      setOpen={setOpen}
      title="Session"
      description={
        session.is_open ? "View session details" : "Update session details"
      }
    >
      <Form {...form}>
        <form onSubmit={onSubmit} className="flex flex-col min-h-0">
          <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin dark:scrollbar-track-[#09090b] scrollbar-thumb-rounded scrollbar-thumb-primary px-1">
            <CourseSessionForm
              mode="Update"
              control={control}
              errors={formState.errors}
              initialDate={format(new Date(session.start_date), "yyyy-MM-dd")}
              setValue={form.setValue}
              watch={form.watch}
              defaultValues={{
                id: session.id,
                course: session.course!,
                start_date: session.start_date,
                price: session.price,
                advance_price: session.advance_price,
                available_spots: session.available_spots,
                remaining_spots: session.remaining_spots,
                is_open: session.is_open,
              }}
            />
          </div>

          <div className="flex shrink-0 border-t flex-col md:flex-row-reverse gap-2 pt-4 mt-4">
            <Button
              type="submit"
              className="flex-1"
              disabled={!formState.isDirty || updateSessionMutation.isPending}
            >
              {updateSessionMutation.isPending ? (
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
            </Button>{" "}
          </div>
        </form>
      </Form>
    </UpdateDialog>
  );
};
