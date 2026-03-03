import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { YesNoSwitch } from "@/components/ui/yes-no-switch";
import FileUpload from "@/components/partials/FileUpload";
import type { Control, FieldErrors } from "react-hook-form";
import type { CertificateFormValues } from "./form-schema";

interface CertificateFormProps {
  control: Control<CertificateFormValues>;
  errors: FieldErrors<CertificateFormValues>;
  mode: "Add" | "Update";
  existingImageUrl?: string;
}

const CertificateForm = ({
  control,
  errors,
  mode,
  existingImageUrl,
}: CertificateFormProps) => {
  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 flex flex-col gap-6">
          {/* ID (Update mode only) */}
          {mode === "Update" && (
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

          {/* Certificate Title */}
          <FormField
            control={control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Certificate name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter certificate name" {...field} />
                </FormControl>
                <FormMessage>{errors.title?.message}</FormMessage>
              </FormItem>
            )}
          />

          {/* Issuing Authority */}
          <FormField
            control={control}
            name="issuing_authority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Issuing authority</FormLabel>
                <FormControl>
                  <Input placeholder="Enter issuing authority" {...field} />
                </FormControl>
                <FormMessage>{errors.issuing_authority?.message}</FormMessage>
              </FormItem>
            )}
          />

          {/* Featured Toggle */}
          <FormField
            control={control}
            name="is_featured"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Display on home page</FormLabel>
                <FormControl>
                  <YesNoSwitch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormMessage>{errors.is_featured?.message}</FormMessage>
              </FormItem>
            )}
          />

          {/* Image Upload */}
          <FormField
            control={control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Certificate image</FormLabel>
                <FormControl>
                  <FileUpload
                    type="file"
                    label="Upload certificate image"
                    title="Upload certificate image"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      field.onChange(file);
                    }}
                  />
                </FormControl>
                <FormMessage>{errors.image?.message}</FormMessage>
              </FormItem>
            )}
          />
        </div>

        {/* Existing image preview (only for update mode) */}
        {existingImageUrl && (
          <div className="flex flex-col gap-2 pt-6">
            <img
              src={existingImageUrl}
              alt="Current certificate image"
              className="h-48 w-full rounded-md border object-cover shadow-sm"
            />
            <p className="text-sm text-muted-foreground">Current image</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificateForm;
