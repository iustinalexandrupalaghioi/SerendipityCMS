import UpdateDialog from "@/components/partials/dialog/UpdateDialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, type Dispatch, type SetStateAction } from "react";
import { useForm } from "react-hook-form";

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
  const form = useForm<EnrollmentFormValues>({
    resolver: zodResolver(EnrollmentSchema),
    defaultValues: {
      course: enrollment.course_session?.course,
      courseSession: enrollment.course_session,
      user: enrollment.profile,
      payment_type: enrollment.payment_type,
      date_of_birth: enrollment.profile?.date_of_birth ?? undefined,
      price: enrollment.price,
      advance_price: enrollment.advance_price,
    },
  });

  const { control, formState, reset, watch, setValue } = form;

  useEffect(() => {
    if (open) {
      reset({
        course: enrollment.course_session?.course,
        courseSession: enrollment.course_session,
        user: enrollment.profile,
        payment_type: enrollment.payment_type,
        date_of_birth: enrollment.profile?.date_of_birth ?? undefined,
        price: enrollment.price,
        advance_price: enrollment.advance_price,
      });
    }
  }, [open, enrollment, reset]);

  return (
    <UpdateDialog
      open={open}
      setOpen={setOpen}
      title="Enrollment"
      description="Enrollment details."
      disableUpdate
    >
      <Form {...form}>
        <form className="flex flex-col min-h-0">
          <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin dark:scrollbar-track-[#09090b] scrollbar-thumb-rounded scrollbar-thumb-primary px-1">
            <CourseEnrollmentForm
              enrollment={enrollment}
              mode="Update"
              control={control}
              errors={formState.errors}
              watch={watch}
              setValue={setValue}
            />
          </div>

          <div className="flex shrink-0 border-t flex-col md:flex-row-reverse gap-2 pt-4 mt-4">
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
