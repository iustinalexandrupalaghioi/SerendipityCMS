import UpdateDialog from "@/components/partials/dialog/UpdateDialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { supabase } from "@/lib/supabaseClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, type Dispatch, type SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { DialogClose } from "@/components/ui/dialog";
import type { Enrollment } from "@/types/Course";
import CourseEnrollmentForm from "./CourseEnrollmentForm";
import { EnrollmentSchema, type EnrollmentFormValues } from "./form-schema";

interface UpdateCourseEnrollmentDialogProps {
  enrollment: Enrollment;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export function UpdateCourseEnrollmentDialog({
  enrollment,
  open,
  setOpen,
}: UpdateCourseEnrollmentDialogProps) {
  const queryClient = useQueryClient();

  const form = useForm<EnrollmentFormValues>({
    resolver: zodResolver(EnrollmentSchema),
    defaultValues: {
      course: enrollment.course,
      user: enrollment.profile,
    },
  });

  const { control, formState, handleSubmit, reset, watch, setValue } = form;

  useEffect(() => {
    if (open) {
      reset({
        course: enrollment.course,
        user: enrollment.profile,
      });
    }
  }, [open, enrollment, reset]);

  const updateEnrollmentMutation = useMutation({
    mutationFn: async (values: EnrollmentFormValues) => {
      const { data, error } = await supabase
        .from("course_enrollment")
        .update({
          course_date: values.course.start_date,
          price: Number(values.course.price),
          advance_price: Number(values.course.advance_price),
        })
        .eq("id", enrollment.id)
        .single();

      if (error) throw new Error(error.message);
      return data;
    },

    onSuccess: () => {
      toast.success("Course enrollment updated successfully!");
      queryClient.refetchQueries({ queryKey: ["course_enrollments"] });
      setOpen(false);
    },

    onError: (error: any) => {
      toast.error(error.message || "Failed to update course enrollment.");
    },
  });

  const onSubmit = handleSubmit((values) =>
    updateEnrollmentMutation.mutate(values),
  );

  return (
    <UpdateDialog
      open={open}
      setOpen={setOpen}
      title="Enrollment"
      description="Enrollment details."
      disableUpdate
    >
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-2 w-full">
          <CourseEnrollmentForm
            enrollment={enrollment}
            mode="Update"
            control={control}
            errors={formState.errors}
            watch={watch}
            setValue={setValue}
          />

          <div className="flex w-full flex-col md:flex-row-reverse gap-2 mt-4">
            <DialogClose asChild className="flex-1">
              <Button type="button" className="w-full">
                Ok
              </Button>
            </DialogClose>
          </div>
        </form>
      </Form>
    </UpdateDialog>
  );
}
