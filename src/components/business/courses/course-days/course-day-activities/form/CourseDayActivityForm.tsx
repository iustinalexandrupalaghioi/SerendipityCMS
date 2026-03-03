import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { Control, FieldErrors } from "react-hook-form";
import type { CourseDayActivityFormValues } from "./form-schema";
import { Textarea } from "@/components/ui/textarea";

interface CourseDayActivityFormProps {
  control: Control<CourseDayActivityFormValues>;
  errors: FieldErrors<CourseDayActivityFormValues>;
  mode: "Add" | "Update";
  className?: string;
  disabled?: boolean;
}

const CourseDayActivityForm = ({
  control,
  errors,
  mode,
  className,
  disabled = false,
}: CourseDayActivityFormProps) => {
  /* =====================
     MODE RULES
  ====================== */
  const isUpdate = mode === "Update";
  const disableEdit = disabled;

  return (
    <div
      className={cn("grid grid-cols-1 lg:grid-cols-5 gap-8 w-full", className)}
    >
      {/* ================= LEFT FORM ================= */}
      <div className="lg:col-span-5">
        <div className="flex flex-col gap-6 max-w-xl">
          {/* ID (Update only) */}
          {isUpdate && (
            <FormField
              control={control}
              name="id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Id</FormLabel>
                  <FormControl>
                    <Input disabled {...field} />
                  </FormControl>
                  <FormMessage>{errors.id?.message}</FormMessage>
                </FormItem>
              )}
            />
          )}

          {/* Activity */}
          <FormField
            control={control}
            name="activity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Activity</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    disabled={disableEdit}
                    placeholder="Activity"
                  />
                </FormControl>
                <FormMessage>{errors.activity?.message}</FormMessage>
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default CourseDayActivityForm;
