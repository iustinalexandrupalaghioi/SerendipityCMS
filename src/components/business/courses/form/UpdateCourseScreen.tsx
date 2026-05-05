import DetailsScreen from "@/components/partials/DetailsScreen";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { supabase } from "@/lib/supabaseClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronLeftIcon, Loader2Icon, SaveIcon, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, Navigate, useNavigate, useParams } from "react-router";
import { toast } from "sonner";

import Breadcrumb from "@/components/partials/Breadcrumb";
import DeleteDialog from "@/components/partials/dialog/DeleteDialog";
import ToolbarActions from "@/components/toolbar/ToolbarActions";
import { CollapsibleContent } from "@/components/ui/collapsible";
import Loader from "@/components/ui/loader";
import CourseForm from "./CourseForm";
import CourseDetailsTabs from "./CourseTabs";
import { CourseSchema, type CourseFormValues } from "./form-schema";
import { courseKeys, useCourse } from "../overview/useCourses";

const UpdateCourseScreen = () => {
  const queryClient = useQueryClient();
  const [isOpen, setOpen] = useState(true);
  const { id } = useParams();
  const [existingImageUrl, setExistingImageUrl] = useState<string>("");
  const [isDeleteOpen, setDeleteOpen] = useState<boolean>(false);

  const { data: course, error, isLoading } = useCourse(id);
  const [fileInputKey, setFileInputKey] = useState(0);
  const navigate = useNavigate();

  const breadcrumbItems = [
    { path: "/", label: "Home" },
    { path: "/courses", label: "Courses" },
    { label: `Course ${course?.display_id ?? "Course"}` },
  ];

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(CourseSchema),
    defaultValues: {
      id: "",
      title: "",
      location: "",
      description: "",
      display_order: 0,
      level: "beginner",
      duration_days: 0,
      price: 0,
      advance_price: 0,
      image: undefined,
      image_path: "",
    },
  });

  useEffect(() => {
    if (!course) return;
    form.reset(course);
    setExistingImageUrl(course?.image_url || "");
  }, [course]);

  const updateCourseMutation = useMutation({
    mutationFn: async (values: CourseFormValues) => {
      const bucket = "courses";
      let imagePath = course?.image_path;

      if (values.image) {
        if (imagePath) {
          await supabase.storage.from(bucket).remove([imagePath]);
        }
        const folder = Date.now().toString();
        const newPath = `${folder}/${values.image.name}`;
        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(newPath, values.image, { upsert: false });
        if (uploadError) throw uploadError;
        imagePath = newPath;
      }

      const { image, ...updateValues } = values;
      const { error, data } = await supabase
        .from("course")
        .update({ ...updateValues, image_path: imagePath })
        .eq("id", course?.id)
        .select()
        .single();

      if (error) throw error;
      return { course: data };
    },
    onSuccess: ({ course }) => {
      toast.success(`Course "${course.title}" updated`);
      setExistingImageUrl(course.image_url || "");
      setFileInputKey((prev) => prev + 1);
      queryClient.refetchQueries({ queryKey: ["courses"] });
    },
    onError: (err: any) => {
      toast.error(err.message ?? "Failed to update course");
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    updateCourseMutation.mutate(values);
  });

  if (isLoading || !course) return <Loader />;
  if (!course && error) return <Navigate to="/courses" />;

  return (
    <div className="space-y-6">
      <Breadcrumb items={breadcrumbItems} />

      <ToolbarActions>
        <div className="flex items-center gap-2">
          <Link to="/courses">
            <Button title="Back" type="button" size="icon" variant="ghost">
              <ChevronLeftIcon />
            </Button>
          </Link>

          <Button
            title="Save"
            type="button"
            size="icon"
            variant="ghost"
            disabled={!form.formState.isDirty || updateCourseMutation.isPending}
            onClick={onSubmit}
          >
            {updateCourseMutation.isPending ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              <SaveIcon />
            )}
          </Button>

          <Button
            type="button"
            size="icon"
            variant="ghost"
            title="Delete"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 />
          </Button>
        </div>
      </ToolbarActions>

      {/* ── Content ── */}
      <DetailsScreen
        mode="Update"
        title={course.title}
        isOpen={isOpen}
        setOpen={setOpen}
      >
        <Form {...form}>
          <CollapsibleContent>
            <CourseForm
              defaultValues={course}
              fileInputKey={fileInputKey}
              mode="Update"
              control={form.control}
              errors={form.formState.errors}
              setValue={form.setValue}
              existingImageUrl={existingImageUrl}
              existingImagePath={course.image_path}
              courseStats={{ ...course }}
            />
          </CollapsibleContent>
        </Form>

        <CourseDetailsTabs course={course} isOpen={isOpen} />
      </DetailsScreen>

      {/* ── Dialogs ── */}
      <DeleteDialog
        title="Delete Course"
        confirmationMessage={
          <>
            You're about to delete the course{" "}
            <span className="font-semibold">"{course.title}"</span>.
            <br /> Once deleted, the data cannot be recovered.
          </>
        }
        id={course.id}
        queryKeys={[courseKeys.all, courseKeys.detail(id!)]}
        open={isDeleteOpen}
        setOpen={setDeleteOpen}
        onSuccess={() => navigate("/courses")}
        target="course"
      />
    </div>
  );
};

export default UpdateCourseScreen;
