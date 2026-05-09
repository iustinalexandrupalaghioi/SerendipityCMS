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
import CourseEnrollmentForm from "./CourseEnrollmentForm";
import { EnrollmentSchema, type EnrollmentFormValues } from "./form-schema";
import { enrollmentKeys } from "../overview/useEnrollments";

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
      courseSession: undefined,
      user: undefined,
      price: 0,
      advance_price: 0,
      date_of_birth: "",
    },
  });

  const { control, handleSubmit, formState, reset, watch, setValue } = form;

  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  const addEnrollmentMutation = useMutation({
    mutationFn: async (values: EnrollmentFormValues) => {
      const { error, data } = await supabase.functions.invoke(
        "create-enrollment",
        {
          body: {
            session_id: values.courseSession.id,
            user_id: values.user.id,
            action_type: "create_enrollment",
            payment_type: values.payment_type,
            dob: values.date_of_birth,
            author: "admin",
            price: values.courseSession.price,
            advance_price: values.courseSession.advance_price,
          },
        },
      );

      if (error) throw error;

      return data;
    },

    onSuccess: () => {
      toast.success("Course enrollment added successfully!");
      queryClient.invalidateQueries({ queryKey: enrollmentKeys.all });
      queryClient.invalidateQueries({
        queryKey: enrollmentKeys.enrollmentsCount,
      });
      reset();
      setOpen(false);
    },

    onError: async (error: any) => {
      const body = await error?.context?.json().catch(() => null);
      const message = body?.error;

      toast.error(message ?? "Something went wrong while enrolling.");
    },
  });

  const onSubmit = handleSubmit((values) =>
    addEnrollmentMutation.mutate(values),
  );

  return (
    <AddDialog
      open={open}
      setOpen={setOpen}
      title="Enrollment"
      description="Create a new course enrollment"
      showTrigger={false}
    >
      <Form {...form}>
        <form onSubmit={onSubmit} className="flex flex-col min-h-0">
          <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin dark:scrollbar-track-[#09090b] scrollbar-thumb-rounded scrollbar-thumb-primary px-1">
            <CourseEnrollmentForm
              mode="Add"
              control={control}
              errors={formState.errors}
              watch={watch}
              setValue={setValue}
            />
          </div>

          <div className="flex shrink-0 border-t flex-col md:flex-row-reverse gap-2 pt-4 mt-4">
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
