import { supabase } from "@/lib/supabaseClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, type Dispatch, type SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import UpdateDialog from "@/components/partials/dialog/UpdateDialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useAuth } from "@/contexts/AuthContext";
import type { Profile } from "@/types/User";
import { Loader2Icon } from "lucide-react";
import { userProfileSchema, type UserProfileFormValues } from "./form-schema";
import UserProfileForm from "./UserProfileForm";

interface UpdateUserProfileDialogProps {
  userProfile: Profile;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export function UpdateUserProfileDialog({
  userProfile,
  open,
  setOpen,
}: UpdateUserProfileDialogProps) {
  const queryClient = useQueryClient();

  const form = useForm<UserProfileFormValues>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      id: userProfile.id,
      first_name: userProfile.first_name,
      last_name: userProfile.last_name,
      email: userProfile.email,
      role: userProfile.role,
    },
  });

  // Reset form when opening the dialog OR when shift changes
  useEffect(() => {
    if (open) {
      form.reset({
        id: userProfile.id,
        first_name: userProfile.first_name,
        last_name: userProfile.last_name,
        email: userProfile.email,
        role: userProfile.role,
      });
    }
  }, [open, userProfile]);

  const updateUserProfileMutation = useMutation({
    mutationFn: async (values: UserProfileFormValues) => {
      const { data, error } = await supabase
        .from("profile")
        .update({
          first_name: values.first_name,
          last_name: values.last_name,
          email: values.email,
          role: values.role,
        })
        .eq("id", userProfile.id)
        .select("*")
        .single();

      if (error) throw new Error(error.message);
      return data;
    },

    onSuccess: () => {
      toast.success("User profile updated successfully!");
      queryClient.refetchQueries({ queryKey: ["profiles"] });
      setOpen(false);
    },

    onError: (error: any) => {
      toast.error(error.message || "Failed to update user profile.");
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    updateUserProfileMutation.mutate(values);
  });
  const { user } = useAuth();
  return (
    <UpdateDialog
      open={open}
      setOpen={setOpen}
      title={user?.user_metadata.full_name ?? "User profile"}
      description="Modify the selected user profile."
    >
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-2 w-full">
          <UserProfileForm
            disabled={userProfile.id === user?.id}
            control={form.control}
            mode="Update"
          />

          <div className="flex w-full flex-col md:flex-row-reverse gap-2 mt-4">
            <Button
              type="submit"
              className="flex-1"
              disabled={
                !form.formState.isDirty || updateUserProfileMutation.isPending
              }
            >
              {updateUserProfileMutation.isPending ? (
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
