import defaultAvatar from "@/assets/user.webp";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { CameraIcon, Loader2Icon } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import Loader from "../ui/loader";
import { FormCalendar } from "../partials/FormCalendar";

const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.email("Invalid email").optional(),
  date_of_birth: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function UpdateUserProfileForm({
  handleEditToggle,
}: {
  handleEditToggle: () => void;
}) {
  const { user, setUser } = useAuth();

  const [profileImagePreview, setProfileImagePreview] = useState<string>(
    user?.user_metadata.avatar_url || defaultAvatar,
  );
  const [uploading, setUploading] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName:
        user?.user_metadata.first_name ||
        user?.user_metadata.full_name?.split(" ")[0] ||
        "",
      lastName:
        user?.user_metadata.last_name ||
        user?.user_metadata.full_name?.split(" ")[1] ||
        "",
      email: user?.email || "",
      date_of_birth: user?.user_metadata.date_of_birth || "",
    },
  });

  const hundredYearsAgo = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return new Date(currentYear - 100, 0, 1);
  }, []);

  // Handle profile image upload to Supabase Storage
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const previewUrl = URL.createObjectURL(file);
    setProfileImagePreview(previewUrl);

    try {
      setUploading(true);

      // Delete previous avatar file if it exists
      const previousAvatarPath = user.user_metadata.avatar_path;
      if (previousAvatarPath) {
        const { error: deleteError } = await supabase.storage
          .from("avatars")
          .remove([previousAvatarPath]);
        if (deleteError)
          console.warn(
            "Failed to delete previous avatar:",
            deleteError.message,
          );
      }

      // Upload new avatar
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Update avatar_path in Supabase auth metadata
      const { error } = await supabase.auth.updateUser({
        data: { avatar_path: filePath },
      });
      if (error) throw error;

      // Generate signed URL
      const { data: signedData } = await supabase.storage
        .from("avatars")
        .createSignedUrl(filePath, 60 * 60);

      // Update context
      if (signedData) {
        setUser({
          ...user,
          user_metadata: {
            ...user.user_metadata,
            avatar_path: filePath,
            avatar_url: signedData.signedUrl,
          },
        });
      }

      toast.success("Profile image updated successfully!");
    } catch (err: any) {
      toast.error("Failed to update profile image");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (values: ProfileFormValues) => {
    if (!user) return;

    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          firstName: values.firstName,
          lastName: values.lastName,
          date_of_birth: values.date_of_birth,
        },
      });

      if (error) throw error;

      const { error: profileError } = await supabase
        .from("profile")
        .update({
          first_name: values.firstName,
          last_name: values.lastName,
          date_of_birth: values.date_of_birth,
        })
        .eq("id", user.id)
        .single();

      if (profileError) throw profileError;

      toast.success("Profile updated successfully!");
      handleEditToggle();
    } catch (err: any) {
      toast.error("Failed to update the profile.");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col items-center gap-6 w-full"
      >
        {/* Profile image */}
        <div className="relative mb-4 flex flex-col items-center">
          <img
            src={profileImagePreview}
            alt="Profile"
            className="w-32 h-32 rounded-full border-2 border-gray-300 object-cover"
          />
          <label className="absolute bottom-0 right-0 p-2 rounded-full bg-gray-100 hover:bg-gray-200 cursor-pointer">
            {uploading ? (
              <Loader className="h-5 w-5 -mt-0.5" />
            ) : (
              <CameraIcon className="w-5 h-5" />
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        </div>

        {/* Form fields */}
        <div className="w-full space-y-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First name</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last name</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email address</FormLabel>
                <FormControl>
                  <Input disabled {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date_of_birth"
            render={({ field }) => (
              <FormCalendar
                startMonth={hundredYearsAgo}
                label="Date of birth"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </div>

        {/* Buttons */}
        <div className="flex flex-col-reverse md:flex-row gap-2 w-full mt-6">
          <Button
            type="button"
            variant="outline"
            className="w-full md:flex-1"
            onClick={handleEditToggle}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="w-full md:flex-1"
            disabled={form.formState.isSubmitting || !form.formState.isDirty}
          >
            {form.formState.isSubmitting ? (
              <>
                <Loader2Icon className="animate-spin mr-2 h-4 w-4" /> Saving...
              </>
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
