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

import { Card } from "@/components/ui/card";
import type { Course } from "@/types/Course";
import CourseEnrollmentForm from "./CourseEnrollmentForm";
import { EnrollmentSchema, type EnrollmentFormValues } from "./form-schema";

interface AddCourseEnrollmentDialogProps {
  course?: Course;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}
const AddCourseEnrollmentDialog = ({
  course,
  open,
  setOpen,
}: AddCourseEnrollmentDialogProps) => {
  const queryClient = useQueryClient();

  const form = useForm<EnrollmentFormValues>({
    resolver: zodResolver(EnrollmentSchema),
    defaultValues: {
      course: course ?? undefined,
      user: undefined,
    },
  });

  const { control, handleSubmit, formState, reset, watch, setValue } = form;

  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  const addEnrollmentMutation = useMutation({
    mutationFn: async (values: EnrollmentFormValues) => {
      const { error, data } = await supabase.from("course_enrollment").insert([
        {
          course_id: values.course.id,
          user_id: values.user.id,
          course_date: values.course.start_date,
          price: Number(values.course.price),
          advance_price: Number(values.course.advance_price),
        },
      ]);

      if (error) throw new Error(error.message);

      return data;
    },

    onSuccess: () => {
      toast.success("Enrollment added successfully!");
      queryClient.refetchQueries({ queryKey: ["course_enrollments"] });
      reset();
      setOpen(false);
    },

    onError: (error: any) => {
      toast.error(error.message || "Failed to add enrollment.");
    },
  });

  const onSubmit = handleSubmit((values) =>
    addEnrollmentMutation.mutate(values),
  );

  return (
    <AddDialog
      open={open}
      setOpen={setOpen}
      title="Add Enrollment"
      description="Enroll a user into a course."
      showTrigger={false}
    >
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-2 w-full">
          <Card className="border-accent flex flex-col items-center w-full overflow-x-auto">
            <CourseEnrollmentForm
              mode="Add"
              control={control}
              errors={formState.errors}
              watch={watch}
              setValue={setValue}
            />
          </Card>

          <div className="flex w-full flex-col md:flex-row-reverse gap-2 mt-4">
            <Button
              type="submit"
              className="flex-1"
              disabled={!formState.isDirty || addEnrollmentMutation.isPending}
            >
              {addEnrollmentMutation.isPending ? (
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

export default AddCourseEnrollmentDialog;
