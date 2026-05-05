import AddDialog from "@/components/partials/dialog/AddDialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { supabase } from "@/lib/supabaseClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { useEffect, type Dispatch, type SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { useParams } from "react-router";
import CourseDayActivityForm from "./CourseDayActivityForm";
import {
  CourseDayActivitySchema,
  type CourseDayActivityFormValues,
} from "./form-schema";
import { useCourseDay } from "../../nav-overview/useCourseDays";

interface AddCourseDayActivityDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}
const AddCourseDayActivityDialog = ({
  open,
  setOpen,
}: AddCourseDayActivityDialogProps) => {
  const queryClient = useQueryClient();
  const { id } = useParams();
  const { data: courseDay } = useCourseDay(id);

  const form = useForm<CourseDayActivityFormValues>({
    resolver: zodResolver(CourseDayActivitySchema),
    defaultValues: {
      activity: "",
      course_day: courseDay,
    },
  });

  const { control, handleSubmit, formState, reset } = form;

  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  const addCourseDayActivityMutation = useMutation({
    mutationFn: async (values: CourseDayActivityFormValues) => {
      if (!values.course_day?.id) {
        throw new Error("Course day is required.");
      }

      const { data, error } = await supabase
        .from("course_day_activity")
        .insert([
          {
            activity: values.activity,
            course_day_id: values.course_day.id,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      return data;
    },

    onSuccess: () => {
      toast.success("Course day activity added successfully!");
      queryClient.refetchQueries({ queryKey: ["course-days"] });
      queryClient.refetchQueries({ queryKey: ["course-day", id] });
      reset();
      setOpen(false);
    },

    onError: (error: any) => {
      toast.error(error.message || "Failed to add course day activity.");
    },
  });

  const onSubmit = handleSubmit((values) =>
    addCourseDayActivityMutation.mutate(values),
  );

  return (
    <AddDialog
      showTrigger={false}
      open={open}
      setOpen={setOpen}
      title="Add activity"
      description="Fill in the details to create a new course day activity."
    >
      <Form {...form}>
        <form onSubmit={onSubmit} className="flex flex-col min-h-0">
          <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin dark:scrollbar-track-[#09090b] scrollbar-thumb-rounded scrollbar-thumb-primary px-1">
            <CourseDayActivityForm
              mode="Add"
              control={control}
              errors={formState.errors}
            />
          </div>

          <div className="flex shrink-0 border-t flex-col md:flex-row-reverse gap-2 pt-4 mt-4">
            <Button
              type="submit"
              className="flex-1"
              disabled={
                !formState.isDirty || addCourseDayActivityMutation.isPending
              }
            >
              {addCourseDayActivityMutation.isPending ? (
                <>
                  <Loader2Icon className="animate-spin mr-2 h-4 w-4" />
                  Adding...
                </>
              ) : (
                "Add"
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
    </AddDialog>
  );
};

export default AddCourseDayActivityDialog;
