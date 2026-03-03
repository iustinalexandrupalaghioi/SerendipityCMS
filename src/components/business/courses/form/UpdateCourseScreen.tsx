import DetailsScreen from "@/components/partials/DetailsScreen";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { supabase } from "@/lib/supabaseClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  BookAlertIcon,
  BookOpenIcon,
  Loader2Icon,
  SaveIcon,
  TrashIcon,
  XIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, Navigate, useNavigate, useParams } from "react-router";
import { toast } from "sonner";

import Breadcrumb from "@/components/partials/Breadcrumb";
import DeleteDialog from "@/components/partials/dialog/DeleteDialog";
import { Card } from "@/components/ui/card";
import { CollapsibleContent } from "@/components/ui/collapsible";
import Loader from "@/components/ui/loader";
import { useCourse } from "@/hooks/useCourses";
import CloseCourseEnrollmentDialog from "../actions/CloseCourseEnrollmentsDialog";
import OpenCourseEnrollmentDialog from "../actions/OpenCourseEnrollmentDialog";
import CourseForm from "./CourseForm";
import CourseDetailsTabs from "./CourseTabs";
import { CourseSchema, type CourseFormValues } from "./form-schema";

const UpdateCourseScreen = () => {
  const queryClient = useQueryClient();
  const [isOpen, setOpen] = useState(true);
  const { id } = useParams();
  const [existingImageUrl, setExistingImageUrl] = useState<string>("");
  const [isDeleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [isOpenEnrollmentsOpen, setOpenEnrollmentsOpen] =
    useState<boolean>(false);

  const [isCloseEnrollmentsOpen, setCloseEnrollmentsOpen] =
    useState<boolean>(false);
  const { data: course, error, isLoading } = useCourse(id);
  const [fileInputKey, setFileInputKey] = useState(0);
  const navigate = useNavigate();

  const breadcrumbItems = [
    { path: "/", label: "Home" },
    { path: "/courses", label: "Courses" },
    { label: course?.title || "Course" },
  ];

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(CourseSchema),
    defaultValues: {
      id: "",
      title: "",
      location: "",
      description: "",
      level: "beginner",
      start_date: "",
      available_spots: 0,
      remaining_spots: 0,
      duration_days: 0,
      price: 0,
      advance_price: 0,
      is_open: false,
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

      // 🔁 Replace image only if a new one is selected
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

  if (isLoading || !course) {
    return <Loader />;
  }

  if (!course && error) return <Navigate to="/courses" />;

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Breadcrumb items={breadcrumbItems} />
      {/* Actions */}
      <div className="flex flex-col md:flex-row gap-2">
        <Button
          type="submit"
          disabled={!form.formState.isDirty || updateCourseMutation.isPending}
        >
          {updateCourseMutation.isPending ? (
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

        <Link to="/courses">
          <Button type="button" className="w-full md:w-auto" variant="outline">
            <XIcon className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        </Link>

        {!course.is_open && (
          <Button
            type="button"
            variant="outline"
            title="Open enrollments"
            onClick={() => setOpenEnrollmentsOpen(true)}
          >
            <BookOpenIcon /> Open enrollments
          </Button>
        )}

        {course.is_open && (
          <Button
            variant="outline"
            type="button"
            onClick={() => setCloseEnrollmentsOpen(true)}
          >
            <BookAlertIcon />
            Close enrollments
          </Button>
        )}

        <Button
          type="button"
          variant="destructive"
          title="Delete"
          onClick={() => setDeleteOpen(true)}
        >
          <TrashIcon /> Delete
        </Button>

        <DeleteDialog
          title="Delete Course"
          confirmationMessage={
            <>
              You're about to delete the course{" "}
              <span className="font-semibold">"{course.title}"</span> .
              <br /> Once deleted, the data cannot be recovered.
            </>
          }
          id={course.id}
          queryKeys={[["courses"]]}
          open={isDeleteOpen}
          setOpen={setDeleteOpen}
          onSuccess={() => navigate("/courses")}
          target="course"
        />

        <OpenCourseEnrollmentDialog
          course={course}
          open={isOpenEnrollmentsOpen}
          setOpen={setOpenEnrollmentsOpen}
        />

        <CloseCourseEnrollmentDialog
          open={isCloseEnrollmentsOpen}
          setOpen={setCloseEnrollmentsOpen}
          courseId={course.id}
          courseTitle={course.title}
        />
      </div>
      <DetailsScreen
        mode="Update"
        title={course.title}
        isOpen={isOpen}
        setOpen={setOpen}
      >
        <p className="text-muted-foreground text-sm mb-4">
          Update the course details below.
        </p>
        <Form {...form}>
          <CollapsibleContent>
            <Card className="border-accent flex flex-col items-center w-full overflow-x-auto px-4">
              <CourseForm
                fileInputKey={fileInputKey}
                mode="Update"
                control={form.control}
                errors={form.formState.errors}
                setValue={form.setValue}
                initialDate={course.start_date}
                existingImageUrl={existingImageUrl}
              />{" "}
            </Card>
          </CollapsibleContent>
        </Form>

        <CourseDetailsTabs course={course} />
      </DetailsScreen>{" "}
    </form>
  );
};

export default UpdateCourseScreen;
