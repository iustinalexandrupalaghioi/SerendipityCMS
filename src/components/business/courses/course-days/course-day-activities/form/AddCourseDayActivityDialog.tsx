import AddDialog from "@/components/partials/dialog/AddDialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { supabase } from "@/lib/supabaseClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { useCourseDay } from "@/hooks/useCourses";
import { useParams } from "react-router";
import CourseDayActivityForm from "./CourseDayActivityForm";
import {
  CourseDayActivitySchema,
  type CourseDayActivityFormValues,
} from "./form-schema";
import { Card } from "@/components/ui/card";

const AddCourseDayActivityDialog = () => {
  const [open, setOpen] = useState(false);
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

  /* =====================
     RESET ON CLOSE
  ====================== */
  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  /* =====================
     MUTATION
  ====================== */
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

  /* =====================
     SUBMIT
  ====================== */
  const onSubmit = handleSubmit((values) =>
    addCourseDayActivityMutation.mutate(values),
  );

  return (
    <AddDialog
      open={open}
      setOpen={setOpen}
      title="Add Course Day Activity"
      description="Fill in the details to create a new course day activity."
    >
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-2 w-full">
          <Card className="border-accent flex flex-col items-center w-full overflow-x-auto px-4">
            <CourseDayActivityForm
              mode="Add"
              control={control}
              errors={formState.errors}
            />
          </Card>

          <div className="flex w-full flex-col md:flex-row-reverse gap-2 mt-4">
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
