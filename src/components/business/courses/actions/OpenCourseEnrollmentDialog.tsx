import UpdateDialog from "@/components/partials/dialog/UpdateDialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { supabase } from "@/lib/supabaseClient";
import type { Course } from "@/types/Course";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { useEffect, type Dispatch, type SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import OpenCourseEnrollmentForm from "./OpenCourseEnrollmentForm";
import {
  OpenCourseEnrollmentSchema,
  type OpenCourseEnrollmentFormValues,
} from "./form-schema";
import { Card } from "@/components/ui/card";

interface OpenCourseEnrollmentDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  course: Course;
}
const OpenCourseEnrollmentDialog = ({
  open,
  setOpen,
  course,
}: OpenCourseEnrollmentDialogProps) => {
  const queryClient = useQueryClient();

  const form = useForm<OpenCourseEnrollmentFormValues>({
    resolver: zodResolver(OpenCourseEnrollmentSchema),
    defaultValues: {
      title: "",
      location: "",
      start_date: "",
      available_spots: 0,
      price: 0,
      advance_price: 0,
    },
  });

  useEffect(() => {
    form.reset({ ...course });
  }, [open, course]);

  const updateCourseMutation = useMutation({
    mutationFn: async (values: OpenCourseEnrollmentFormValues) => {
      const { error, data } = await supabase
        .from("course")
        .update({
          ...values,
          is_open: true,
          remaining_spots: values.available_spots,
        })
        .eq("id", course?.id)
        .select()
        .single();

      if (error) throw error;

      return { course: data };
    },

    onSuccess: ({ course }) => {
      toast.success(
        `Course enrollments are now opened for course "${course.title}"`,
      );
      queryClient.refetchQueries({ queryKey: ["courses"] });
      queryClient.refetchQueries({ queryKey: ["course", course.id] });
    },

    onError: (err: any) => {
      toast.error(err.message ?? "Failed to open the course enrollments");
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    updateCourseMutation.mutate(values);
    setOpen(false);
  });

  return (
    <UpdateDialog
      open={open}
      setOpen={setOpen}
      title="Open course enrollments"
      description="Fill the details below to open course enrollments"
      disableUpdate
    >
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-2 w-full">
          <Card className="border-accent flex flex-col items-center w-full overflow-x-auto px-2">
            <OpenCourseEnrollmentForm
              control={form.control}
              errors={form.formState.errors}
              setValue={form.setValue}
              initialDate={course.start_date}
            />
          </Card>

          <div className="flex w-full flex-col md:flex-row-reverse gap-2 mt-4">
            <Button
              type="button"
              onClick={onSubmit}
              className="flex-1"
              disabled={
                !form.formState.isDirty || updateCourseMutation.isPending
              }
            >
              {updateCourseMutation.isPending ? (
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
};

export default OpenCourseEnrollmentDialog;
