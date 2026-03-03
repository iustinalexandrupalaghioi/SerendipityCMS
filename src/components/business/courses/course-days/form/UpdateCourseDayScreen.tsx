import DetailsScreen from "@/components/partials/DetailsScreen";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { supabase } from "@/lib/supabaseClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2Icon, SaveIcon, TrashIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, Navigate, useNavigate, useParams } from "react-router";
import { toast } from "sonner";

import Breadcrumb from "@/components/partials/Breadcrumb";
import DeleteDialog from "@/components/partials/dialog/DeleteDialog";
import { CollapsibleContent } from "@/components/ui/collapsible";
import Loader from "@/components/ui/loader";
import { useCourseDay } from "@/hooks/useCourses";
import CourseDayForm from "./CourseDayForm";
import CourseDayTabs from "./CourseDayTabs";
import { CourseDaySchema, type CourseDayFormValues } from "./form-schema";
import { Card } from "@/components/ui/card";

const UpdateCourseDayScreen = () => {
  const queryClient = useQueryClient();
  const [isOpen, setOpen] = useState(true);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const { id } = useParams();
  const [existingImageUrl, setExistingImageUrl] = useState<string>("");
  const navigate = useNavigate();
  const { data: courseDay, error, isLoading } = useCourseDay(id);

  const breadcrumbItems = [
    { path: "/", label: "Home" },
    { path: "/courses", label: "Courses" },
    {
      path: `/courses/update/${courseDay?.course?.id}`,
      label: courseDay?.course?.title || "Course",
    },
    { label: "Course Days" },
    { label: courseDay?.title ?? "Update Course Day" },
  ];

  const form = useForm<CourseDayFormValues>({
    resolver: zodResolver(CourseDaySchema),
    defaultValues: {
      id: "",
      title: "",
      day_number: 0,
      image: undefined,
    },
  });

  /* =====================
     RESET ON LOAD
  ====================== */
  useEffect(() => {
    if (!courseDay) return;

    form.reset({
      ...courseDay,
      image: undefined,
    });

    setExistingImageUrl(courseDay.image_url || "");
  }, [courseDay, form]);

  /* =====================
     UPDATE MUTATION
  ====================== */
  const updateCourseDayMutation = useMutation({
    mutationFn: async (values: CourseDayFormValues) => {
      const bucket = "courses";

      let imagePath = values.image_path;

      // 🔁 Replace image only if a new one is selected
      if (values.image) {
        if (imagePath) {
          await supabase.storage.from(bucket).remove([imagePath]);
        }

        const folder = `${values.course.id}/${Date.now().toString()}`;
        const newPath = `${folder}/${values.image.name}`;

        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(newPath, values.image, { upsert: false });

        if (uploadError) throw uploadError;

        imagePath = newPath;
      }

      const { image, course, ...updateValues } = values;
      const { error, data } = await supabase
        .from("course_day")
        .update({
          ...updateValues,

          image_path: imagePath,
          course_id: course.id,
        })
        .eq("id", courseDay?.id)
        .select()
        .single();

      if (error) throw error;

      return { courseDay: data };
    },

    onSuccess: ({ courseDay }) => {
      toast.success(`Course day "${courseDay.title}" updated`);
      setExistingImageUrl(courseDay.image_url || "");
      queryClient.refetchQueries({ queryKey: ["courses"] });
      queryClient.refetchQueries({ queryKey: ["course-days"] });
      queryClient.refetchQueries({ queryKey: ["course", courseDay.course_id] });
      queryClient.refetchQueries({ queryKey: ["course-day", courseDay.id] });
    },

    onError: (err: any) => {
      toast.error(err.message ?? "Failed to update course day");
    },
  });

  const onSubmit = form.handleSubmit((values) =>
    updateCourseDayMutation.mutate(values),
  );

  if (isLoading) return <Loader />;

  if (!courseDay && error) {
    return <Navigate to="/course-days" />;
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Breadcrumb items={breadcrumbItems} />
      {/* ACTIONS */}
      <div className="flex flex-col md:flex-row gap-2">
        <Button
          type="submit"
          disabled={
            !form.formState.isDirty || updateCourseDayMutation.isPending
          }
        >
          {updateCourseDayMutation.isPending ? (
            <>
              <Loader2Icon className="animate-spin mr-2 h-4 w-4" />
              Saving...
            </>
          ) : (
            <>
              <SaveIcon className="h-4 w-4 mr-2" />
              Save
            </>
          )}
        </Button>

        <Link to={`/courses/update/${courseDay?.course?.id}`}>
          <Button type="button" className="w-full md:w-auto" variant="outline">
            <XIcon className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        </Link>

        <Button
          type="button"
          variant="destructive"
          title="Delete"
          onClick={() => setDeleteOpen(true)}
        >
          <TrashIcon /> Delete
        </Button>

        {isDeleteOpen && (
          <DeleteDialog
            title="Delete Course Day"
            confirmationMessage={
              <>
                You're about to delete the course day{" "}
                <span className="font-semibold">"{courseDay?.title}"</span> .
                <br /> Once deleted, the data cannot be recovered.
              </>
            }
            id={courseDay!.id}
            queryKeys={[
              ["courses"],
              ["course", courseDay?.course_id],
              ["course-days", courseDay?.id],
            ]}
            open={isDeleteOpen}
            setOpen={setDeleteOpen}
            onSuccess={() =>
              navigate("/courses/update/" + courseDay?.course_id)
            }
            target="course_day"
          />
        )}
      </div>
      <DetailsScreen
        mode="Update"
        title={courseDay?.title || "Update Course Day"}
        isOpen={isOpen}
        setOpen={setOpen}
      >
        <p className="text-muted-foreground text-sm mb-4">
          Update the course day details below.
        </p>
        <Form {...form}>
          {/* FORM */}
          <CollapsibleContent>
            <Card className="border-accent flex flex-col items-center w-full overflow-x-auto px-4">
              <CourseDayForm
                mode="Update"
                control={form.control}
                errors={form.formState.errors}
                existingImageUrl={existingImageUrl}
              />
            </Card>
          </CollapsibleContent>
        </Form>

        <CourseDayTabs courseDay={courseDay!} />
      </DetailsScreen>
    </form>
  );
};

export default UpdateCourseDayScreen;
