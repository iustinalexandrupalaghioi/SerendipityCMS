// import { useAvailableWorkHours } from "@/hooks/common/use-available-work-hours";
// import { useBookedDates } from "@/hooks/common/use-booked-dates";
import useUserStore from "@/stores/UserStore";

import PickupUserList from "@/components/business/users/list/PickupUserList";
import { Combobox } from "@/components/partials/Combobox";
import PickupFormInput from "@/components/partials/PickupFormInput";
import { FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { YesNoSwitch } from "@/components/ui/yes-no-switch";
import useCourseStore from "@/stores/CourseStore";
import type { Enrollment } from "@/types/Course";
import { useEffect, useState } from "react";
import type {
  Control,
  FieldErrors,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import PickupCourseDialog from "../../list/PickupCourseList";
import type { EnrollmentFormValues } from "./form-schema";

interface CourseEnrollmentFormProps {
  control: Control<EnrollmentFormValues>;
  setValue: UseFormSetValue<EnrollmentFormValues>;
  errors: FieldErrors<EnrollmentFormValues>;
  watch: UseFormWatch<EnrollmentFormValues>;
  mode: "Add" | "Update";
  enrollment?: Enrollment;
}

const CourseEnrollmentForm = ({
  control,
  errors,
  mode,
  setValue,
  enrollment,
}: CourseEnrollmentFormProps) => {
  const disabled = mode === "Update";

  const { selectedCourse, setselectedCourse } = useCourseStore();
  const { selectedUser, setSelectedUser } = useUserStore();

  const [isCoursePickupOpen, setCoursePickupOpen] = useState(false);
  const [isUserPickupOpen, setUserPickupOpen] = useState(false);

  /* Sync picked service into form */
  useEffect(() => {
    if (!selectedCourse) return;

    setValue("course", selectedCourse, { shouldDirty: true });

    setselectedCourse(null);
  }, [selectedCourse, setValue]);

  useEffect(() => {
    if (!selectedUser) return;

    setValue("user", selectedUser, { shouldDirty: true });
    setSelectedUser(null);
  }, [selectedUser, setValue]);

  const statusEnum = [
    {
      label: "Submitted",
      value: "submitted",
    },
    {
      label: "Confirmed",
      value: "confirmed",
    },
    {
      label: "Cancelled",
      value: "cancelled",
    },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-6 w-full p-6">
      <div className="flex-1 flex flex-col gap-6">
        {mode === "Update" && (
          <>
            <FormItem className="w-full">
              <FormLabel>Enrollment date</FormLabel>
              <Input
                type="text"
                placeholder="Enrollment date"
                disabled
                value={enrollment?.enrollment_date}
              />
            </FormItem>
            <div className="flex gap-4">
              <FormItem className="w-full capitalize">
                <FormLabel>Status</FormLabel>
                <Combobox
                  items={statusEnum}
                  value={enrollment?.status ?? "submitted"}
                  placeholder="Enrollment status"
                  disabled
                  className="w-full"
                />
              </FormItem>

              <FormItem className="w-full capitalize">
                <FormLabel>Advance paid</FormLabel>
                <YesNoSwitch
                  checked={enrollment?.advance_paid ?? false}
                  disabled
                />
              </FormItem>
            </div>
          </>
        )}

        <PickupFormInput
          disabled={disabled}
          displayKey="email"
          control={control}
          name="user"
          label="Customer"
          placeholder="Select a customer"
          error={errors.user?.message}
          setOpen={setUserPickupOpen}
        />

        {isUserPickupOpen && (
          <PickupUserList open={isUserPickupOpen} setOpen={setUserPickupOpen} />
        )}

        {/* Course  */}
        <PickupFormInput
          disabled={disabled}
          displayKey="title"
          control={control}
          name="course"
          label="Course"
          placeholder="Select a course"
          error={errors.course?.message}
          setOpen={setCoursePickupOpen}
        />

        {isCoursePickupOpen && (
          <PickupCourseDialog
            open={isCoursePickupOpen}
            setOpen={setCoursePickupOpen}
          />
        )}

        {mode === "Update" && (
          <>
            <FormItem className="w-full">
              <FormLabel>Course date</FormLabel>
              <Input
                type="text"
                placeholder="Course date"
                disabled
                value={enrollment?.course_date}
              />
            </FormItem>

            <div className="flex gap-4">
              <FormItem className="w-full capitalize">
                <FormLabel>Price (EUR)</FormLabel>
                <Input
                  type="text"
                  placeholder="Price (EUR)"
                  disabled
                  value={enrollment?.course?.price}
                />
              </FormItem>

              <FormItem className="w-full capitalize">
                <FormLabel>Advance price (EUR)</FormLabel>
                <Input
                  type="text"
                  placeholder="Advance price (EUR)"
                  disabled
                  value={enrollment?.course?.advance_price}
                />
              </FormItem>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CourseEnrollmentForm;
