import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { EMAIL_TYPES_OPTIONS } from "@/types/Email";
import type { Control, FieldErrors } from "react-hook-form";
import type { EmailTemplateFormValues } from "./form-schema";

interface EmailTemplateFormProps {
  control: Control<EmailTemplateFormValues>;
  errors: FieldErrors<EmailTemplateFormValues>;
  mode: "Add" | "Update";
}

const EmailTemplateForm = ({
  control,
  errors,
  mode,
}: EmailTemplateFormProps) => {
  return (
    <div className="w-full py-2 space-y-4">
      <div className="grid grid-cols-1 gap-6">
        {mode === "Update" && (
          <FormField
            control={control}
            name="display_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Id</FormLabel>
                <FormControl>
                  <Input disabled {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage>{errors.display_id?.message}</FormMessage>
              </FormItem>
            )}
          />
        )}

        <FormField
          control={control}
          name="id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Template id</FormLabel>
              <FormControl>
                <Input placeholder="Tempalte id..." {...field} />
              </FormControl>
              <FormMessage>{errors.id?.message}</FormMessage>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="email_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email type</FormLabel>
              <Select
                key={field.value}
                value={field.value}
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger
                    className={cn(
                      "w-full",
                      "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                      "data-[state=open]:border-ring data-[state=open]:ring-ring/50 data-[state=open]:ring-[3px]",
                      "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
                    )}
                  >
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {EMAIL_TYPES_OPTIONS.map((template, index) => (
                    <SelectItem
                      key={`${template.value}-${index}`}
                      value={template.value}
                    >
                      {template.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage>{errors.email_type?.message}</FormMessage>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default EmailTemplateForm;
