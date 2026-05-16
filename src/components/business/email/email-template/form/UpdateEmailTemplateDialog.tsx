import UpdateDialog from "@/components/partials/dialog/UpdateDialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { supabase } from "@/lib/supabaseClient";
import { EMAIL_TYPES_OPTIONS, type EmailTemplate } from "@/types/Email";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { useEffect, type Dispatch, type SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  emailTemplateSchema,
  type EmailTemplateFormValues,
} from "./form-schema";
import EmailTemplateForm from "./EmailTemplateForm";
import { emailTemplateKeys } from "../overview/useEmailTemplates";

interface UpdateEmailTemplateDialogProps {
  emailTemplate: EmailTemplate;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export function UpdateEmailTemplateDialog({
  emailTemplate,
  open,
  setOpen,
}: UpdateEmailTemplateDialogProps) {
  const queryClient = useQueryClient();

  const form = useForm<EmailTemplateFormValues>({
    resolver: zodResolver(emailTemplateSchema),
    defaultValues: {
      display_id: emailTemplate.display_id,
      id: emailTemplate.id,
      email_type: emailTemplate.email_type,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        display_id: emailTemplate.display_id,
        id: emailTemplate.id,
        email_type: emailTemplate.email_type,
      });
    }
  }, [open, emailTemplate]);

  const mutation = useMutation({
    mutationFn: async (values: EmailTemplateFormValues) => {
      const { data, error } = await supabase
        .from("email_template")
        .update({ email_type: values.email_type })
        .eq("id", emailTemplate.id)
        .single();
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      toast.success("Email template updated successfully!");
      queryClient.invalidateQueries({ queryKey: emailTemplateKeys.all });
      setOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update email template.");
    },
  });

  const onSubmit = form.handleSubmit((values) => mutation.mutate(values));

  return (
    <UpdateDialog
      open={open}
      setOpen={setOpen}
      title={
        EMAIL_TYPES_OPTIONS.find((o) => o.value === emailTemplate.email_type)
          ?.label ?? "Email template"
      }
      description="Update the existing email template."
    >
      <Form {...form}>
        <form onSubmit={onSubmit} className="flex flex-col min-h-0">
          <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin dark:scrollbar-track-[#09090b] scrollbar-thumb-rounded scrollbar-thumb-primary px-1">
            <EmailTemplateForm
              control={form.control}
              errors={form.formState.errors}
              mode="Update"
            />
          </div>

          <div className="flex shrink-0 border-t flex-col md:flex-row-reverse gap-2 pt-4 mt-4">
            <Button
              type="submit"
              className="flex-1"
              disabled={!form.formState.isDirty || mutation.isPending}
            >
              {mutation.isPending ? (
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
}
