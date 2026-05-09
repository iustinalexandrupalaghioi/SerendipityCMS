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
import type { Course } from "@/types/Course";
import CourseSessionForm from "./CourseSessionForm";
import {
  CourseSessionSchema,
  type CourseSessionFormValues,
} from "./form-schema";
import { format } from "date-fns/format";
import { courseKeys } from "../../overview/useCourses";
import { sessionKeys } from "../nav-overview/useCourseSessions";

interface AddCourseSessionDialogProps {
  course: Course;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const AddCourseSessionDialog = ({
  course,
  open,
  setOpen,
}: AddCourseSessionDialogProps) => {
  const queryClient = useQueryClient();

  const form = useForm<CourseSessionFormValues>({
    resolver: zodResolver(CourseSessionSchema),
    defaultValues: {
      start_date: "",
      course: course,
      price: course.price ?? 0,
      advance_price: course.advance_price ?? null,
      available_spots: course.available_spots ?? 1,
      remaining_spots: course.available_spots ?? 1,
      is_open: true,
    },
  });

  const { control, handleSubmit, formState, reset } = form;

  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  const addSessionMutation = useMutation({
    mutationFn: async (values: CourseSessionFormValues) => {
      const { error, data } = await supabase.from("course_session").insert([
        {
          course_id: course.id,
          start_date: values.start_date,
          price: values.price,
          advance_price: values.advance_price,
          available_spots: values.available_spots,
          remaining_spots: values.remaining_spots,
          is_open: values.is_open,
        },
      ]);

      if (error) throw new Error(error.message);
      return data;
    },

    onSuccess: () => {
      toast.success("Course session added successfully!");
      queryClient.invalidateQueries({
        queryKey: sessionKeys.all,
        refetchType: "all",
      });
      queryClient.invalidateQueries({ queryKey: courseKeys.all });
      queryClient.invalidateQueries({ queryKey: courseKeys.detail(course.id) });
      reset();
      setOpen(false);
    },

    onError: (error: any) => {
      toast.error(error.message || "Failed to add course session.");
    },
  });

  const onSubmit = handleSubmit((values) => addSessionMutation.mutate(values));

  return (
    <AddDialog
      open={open}
      setOpen={setOpen}
      title="Session"
      description="Add a new session for this course"
      showTrigger={false}
    >
      <Form {...form}>
        <form onSubmit={onSubmit} className="flex flex-col min-h-0">
          <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin dark:scrollbar-track-[#09090b] scrollbar-thumb-rounded scrollbar-thumb-primary px-1">
            <CourseSessionForm
              mode="Add"
              control={control}
              errors={formState.errors}
              initialDate={format(new Date(), "yyyy-MM-dd")}
              setValue={form.setValue}
              watch={form.watch}
              defaultValues={{
                start_date: "",
                course: course,
                price: course.price ?? 0,
                advance_price: course.advance_price ?? null,
                available_spots: course.available_spots ?? 1,
                remaining_spots: course.available_spots ?? 1,
                is_open: true,
              }}
            />
          </div>

          <div className="flex shrink-0 border-t flex-col md:flex-row-reverse gap-2 pt-4 mt-4">
            <Button
              type="submit"
              className="flex-1"
              disabled={!formState.isDirty || addSessionMutation.isPending}
            >
              {addSessionMutation.isPending ? (
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
