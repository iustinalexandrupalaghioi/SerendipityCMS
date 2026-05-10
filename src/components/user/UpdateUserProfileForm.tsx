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
  full_name: z.string().min(1, "Full name is required"),
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
    user?.avatar_url || defaultAvatar,
  );
  const [uploading, setUploading] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: user?.full_name ?? "",
      email: user?.email ?? "",
      date_of_birth: user?.date_of_birth ?? "",
    },
  });

  const hundredYearsAgo = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return new Date(currentYear - 100, 0, 1);
  }, []);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setProfileImagePreview(URL.createObjectURL(file));

    try {
      setUploading(true);

      const fileExt = file.name.split(".").pop();
      const filePath = `${user.id}/${Date.now()}.${fileExt}`;

      // Remove previous avatar if it was a storage path
      if (user.avatar_url && !user.avatar_url.startsWith("http")) {
        await supabase.storage.from("avatars").remove([user.avatar_url]);
      }

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });
      if (uploadError) throw uploadError;

      const { data: signedData, error: signError } = await supabase.storage
        .from("avatars")
        .createSignedUrl(filePath, 60 * 60 * 24 * 7); // 7 days
      if (signError) throw signError;

      const { error: updateError } = await supabase
        .from("profile")
        .update({ avatar_url: filePath })
        .eq("id", user.id);
      if (updateError) throw updateError;

      setUser({ ...user, avatar_url: signedData.signedUrl });
      toast.success("Profile image updated successfully!");
    } catch {
      toast.error("Failed to update profile image");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (values: ProfileFormValues) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("profile")
        .update({
          full_name: values.full_name,
          date_of_birth: values.date_of_birth || null,
        })
        .eq("id", user.id);

      if (error) throw error;

      setUser({
        ...user,
        full_name: values.full_name,
        date_of_birth: values.date_of_birth ?? "",
      });
      toast.success("Profile updated successfully!");
      handleEditToggle();
    } catch {
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
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.src = defaultAvatar;
            }}
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
            name="full_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. John Doe" {...field} />
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
