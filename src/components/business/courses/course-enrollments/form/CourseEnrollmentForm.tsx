// import { useAvailableWorkHours } from "@/hooks/common/use-available-work-hours";
// import { useBookedDates } from "@/hooks/common/use-booked-dates";
import useUserStore from "@/stores/UserStore";

import UserPickup from "@/components/business/users/pickup/UserPickup";
import { Combobox } from "@/components/partials/Combobox";
import { FormCalendar } from "@/components/partials/FormCalendar";
import PickupFormInput from "@/components/partials/PickupFormInput";
import SectionCard from "@/components/partials/SectionCard";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { YesNoSwitch } from "@/components/ui/yes-no-switch";
import { cn } from "@/lib/utils";
import useCourseSessionStore from "@/stores/CourseSessionStore";
import useCourseStore from "@/stores/CourseStore";
import {
  ENROLLMENT_STATUS_OPTIONS,
  PAYMENT_TYPE_OPTIONS,
  type Enrollment,
} from "@/types/Course";
import { format } from "date-fns/format";
import { useEffect, useMemo, useState } from "react";
import type {
  Control,
  FieldErrors,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import CourseSessionPickup from "../../course-sessions/pickup/CourseSessionPickup";
import CoursePickup from "../../pickup/CoursePickup";
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
  watch,
  enrollment,
}: CourseEnrollmentFormProps) => {
  const disabled = mode === "Update";
  const course = watch("course");
  const courseSession = watch("courseSession");
  const user = watch("user");

  const { selectedCourse, setselectedCourse } = useCourseStore();
  const { selectedCourseSession, setselectedCourseSession } =
    useCourseSessionStore();
  const { selectedUser, setSelectedUser } = useUserStore();

  const [isCoursePickupOpen, setCoursePickupOpen] = useState(false);
  const [isCourseSessionPickupOpen, setCourseSessionPickupOpen] =
    useState(false);
  const [isUserPickupOpen, setUserPickupOpen] = useState(false);

  useEffect(() => {
    if (!selectedCourse) return;
    setValue("course", selectedCourse, { shouldDirty: true });
    setselectedCourse(null);
  }, [selectedCourse, setValue]);

  useEffect(() => {
    if (!courseSession) return;
    setValue("course", courseSession.course!, { shouldDirty: true });
    setValue("price", courseSession.price!, { shouldDirty: true });
    setValue("advance_price", courseSession.advance_price!, {
      shouldDirty: true,
    });
  }, [courseSession]);

  useEffect(() => {
    if (!selectedCourseSession) return;
    setValue("courseSession", selectedCourseSession, { shouldDirty: true });
    setValue("course", selectedCourseSession.course!, { shouldDirty: true });
    setValue("price", selectedCourseSession.price!, { shouldDirty: true });
    setValue("advance_price", selectedCourseSession.advance_price!, {
      shouldDirty: true,
    });
    setselectedCourseSession(null);
  }, [selectedCourseSession, setValue]);

  useEffect(() => {
    if (!selectedUser) return;
    setValue("user", selectedUser, { shouldDirty: true });
    setValue("date_of_birth", selectedUser.date_of_birth, {
      shouldDirty: true,
    });
    setSelectedUser(null);
  }, [selectedUser, setValue]);

  const hundredYearsAgo = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return new Date(currentYear - 100, 0, 1);
  }, []);

  return (
    <div className="flex flex-col gap-8 w-full py-2">
      {/* ── Enrollment info (Update only) ── */}

      <SectionCard title="Enrollment">
        {mode === "Update" && (
          <div
            className={cn(
              "grid grid-cols-1 md:grid-cols-4 items-start space-y-4",
              disabled && "gap-4",
            )}
          >
            <FormItem>
              <FormLabel>Enrollment date</FormLabel>
              <Input
                disabled
                value={
                  enrollment && format(enrollment.enrollment_date, "dd-MM-yyyy")
                }
              />
            </FormItem>
            <FormItem className="col-span-2">
              <FormLabel>Status</FormLabel>
              <Combobox
                items={ENROLLMENT_STATUS_OPTIONS}
                value={enrollment?.status ?? "submitted"}
                placeholder="Enrollment status"
                disabled
                className="w-full capitalize"
              />
            </FormItem>
            <FormItem>
              <FormLabel>Deposit paid</FormLabel>
              <YesNoSwitch
                checked={enrollment?.advance_payment_paid ?? false}
                disabled
              />
            </FormItem>
          </div>
        )}

        <div
          className={cn(
            "grid grid-cols-1 md:grid-cols-4 items-start space-y-4",
            disabled && "gap-4 space-y-0",
          )}
        >
          <PickupFormInput
            disabled={disabled}
            displayKey="display_id"
            control={control}
            name="user"
            label="Customer"
            error={errors.user?.message}
            setOpen={setUserPickupOpen}
          />
          <FormItem className="col-span-3">
            <FormLabel>Full name</FormLabel>
            <Input
              disabled
              placeholder="e.g. John Doe"
              value={user?.full_name ?? ""}
            />
          </FormItem>
          <FormField
            control={control}
            name="date_of_birth"
            render={({ field }) => (
              <FormCalendar
                startMonth={hundredYearsAgo}
                label="Date of birth"
                value={field.value ? field.value : (user?.date_of_birth ?? "")}
                disabled={mode === "Update"}
                onChange={field.onChange}
                className="w-full"
              />
            )}
          />
        </div>
      </SectionCard>

      {/* ── Course ── */}

      <SectionCard title="Course and session">
        <div
          className={cn(
            "grid grid-cols-1 md:grid-cols-4 space-y-4 items-start",
            disabled && "gap-4 space-y-0",
          )}
        >
          <PickupFormInput
            disabled={disabled}
            displayKey="display_id"
            control={control}
            name="course"
            label="Course"
            error={errors.course?.message}
            setOpen={setCoursePickupOpen}
          />
          <FormItem className="col-span-3">
            <FormLabel>Course name</FormLabel>
            <Input
              disabled
              placeholder="e.g. Private session"
              value={course?.title ?? ""}
            />
          </FormItem>
          <PickupFormInput
            disabled={disabled}
            displayKey="display_id"
            control={control}
            name="courseSession"
            label="Course session"
            error={errors.courseSession?.message}
            setOpen={setCourseSessionPickupOpen}
          />
          <FormItem className="col-span-3">
            <FormLabel>Session start date</FormLabel>
            <Input
              disabled
              placeholder="dd-MM-yyyy"
              value={
                courseSession
                  ? format(courseSession.start_date, "dd-MM-yyyy")
                  : ""
              }
            />
          </FormItem>
        </div>
      </SectionCard>

      {/* ── Pricing (Update only) ── */}
      <SectionCard title="Pricing">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-start gap-4">
          <FormField
            control={control}
            name="payment_type"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Payment type</FormLabel>
                <Combobox
                  items={PAYMENT_TYPE_OPTIONS}
                  placeholder="Payment type"
                  disabled={mode === "Update"}
                  className="w-full capitalize"
                  {...field}
                  value={field.value}
                />
                <FormMessage>{errors.payment_type?.message}</FormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="price"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="number"
                      className="pr-12"
                      placeholder="e.g. 950"
                      aria-invalid={!!errors.price}
                      disabled={disabled}
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      EUR
                    </span>
                  </div>
                </FormControl>
                <FormMessage>{errors.price?.message}</FormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="advance_price"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Deposit price</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="number"
                      className="pr-12"
                      placeholder="e.g. 200"
                      aria-invalid={!!errors.advance_price}
                      value={field.value ?? ""}
                      disabled={disabled}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === "" ? null : Number(e.target.value),
                        )
                      }
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      EUR
                    </span>
                  </div>
                </FormControl>
                <FormMessage>{errors.advance_price?.message}</FormMessage>
              </FormItem>
            )}
          />
        </div>
      </SectionCard>

      {/* ── Dialogs ── */}
      {isUserPickupOpen && (
        <UserPickup
          onSelect={setSelectedUser}
          open={isUserPickupOpen}
          setOpen={setUserPickupOpen}
        />
      )}
      {isCoursePickupOpen && (
        <CoursePickup
          onSelect={setselectedCourse}
          open={isCoursePickupOpen}
          setOpen={setCoursePickupOpen}
        />
      )}
      {isCourseSessionPickupOpen && (
        <CourseSessionPickup
          onSelect={setselectedCourseSession}
          course={course}
          open={isCourseSessionPickupOpen}
          setOpen={setCourseSessionPickupOpen}
        />
      )}
    </div>
  );
};

export default CourseEnrollmentForm;
