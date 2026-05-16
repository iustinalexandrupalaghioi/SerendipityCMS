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
import {
  emailTemplateSchema,
  type EmailTemplateFormValues,
} from "./form-schema";
import EmailTemplateForm from "./EmailTemplateForm";
import { emailTemplateKeys } from "../overview/useEmailTemplates";

interface AddEmailTemplateDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export function AddEmailTemplateDialog({
  open,
  setOpen,
}: AddEmailTemplateDialogProps) {
  const queryClient = useQueryClient();

  const form = useForm<EmailTemplateFormValues>({
    resolver: zodResolver(emailTemplateSchema),
    defaultValues: {
      email_type: "appointment_accepted",
      id: "",
    },
  });

  useEffect(() => {
    if (!open) form.reset();
  }, [open]);

  const mutation = useMutation({
    mutationFn: async (values: EmailTemplateFormValues) => {
      const { data, error } = await supabase
        .from("email_template")
        .insert([{ email_type: values.email_type }]);
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      toast.success("Email template added successfully!");
      form.reset();
      queryClient.invalidateQueries({ queryKey: emailTemplateKeys.all });
      setOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to add email template.");
    },
  });

  const onSubmit = form.handleSubmit((values) => mutation.mutate(values));

  return (
    <AddDialog
      open={open}
      setOpen={setOpen}
      title="Email template"
      description="Create a new email template."
      showTrigger={false}
    >
      <Form {...form}>
        <form onSubmit={onSubmit} className="flex flex-col min-h-0">
          <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin dark:scrollbar-track-[#09090b] scrollbar-thumb-rounded scrollbar-thumb-primary px-1">
            <EmailTemplateForm
              control={form.control}
              errors={form.formState.errors}
              mode="Add"
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
}
