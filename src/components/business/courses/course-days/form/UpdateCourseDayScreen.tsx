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
import CourseDayForm from "./CourseDayForm";
import CourseDayTabs from "./CourseDayTabs";
import { CourseDaySchema, type CourseDayFormValues } from "./form-schema";
import { courseDayKeys, useCourseDay } from "../nav-overview/useCourseDays";
import { courseKeys } from "../../overview/useCourses";

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
      label: `Course ${courseDay?.course?.title ?? "Course"}`,
    },
    { label: `Day ${courseDay?.day_number ?? "Update course day"}` },
  ];

  const form = useForm<CourseDayFormValues>({
    resolver: zodResolver(CourseDaySchema),
    defaultValues: {
      id: "",
      display_id: 0,
      title: "",
      day_number: 0,
      image: undefined,
    },
  });

  useEffect(() => {
    if (!courseDay) return;
    form.reset({ ...courseDay, image: undefined });
    setExistingImageUrl(courseDay.image_url || "");
  }, [courseDay, form]);

  const updateCourseDayMutation = useMutation({
    mutationFn: async (values: CourseDayFormValues) => {
      const bucket = "courses";
      let imagePath = values.image_path;

      if (values.image) {
        if (imagePath) await supabase.storage.from(bucket).remove([imagePath]);

        const folder = `${values.course.id}/${Date.now()}`;
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
      queryClient.invalidateQueries({ queryKey: courseKeys.all });
      queryClient.invalidateQueries({
        queryKey: courseKeys.detail(courseDay.course_id),
      });
      queryClient.invalidateQueries({ queryKey: courseDayKeys.all });
      queryClient.invalidateQueries({
        queryKey: courseDayKeys.detail(courseDay.id),
      });
    },
    onError: (err: any) => {
      toast.error(err.message ?? "Failed to update course day");
    },
  });

  const onSubmit = form.handleSubmit((values) =>
    updateCourseDayMutation.mutate(values),
  );

  if (isLoading || !courseDay) return <Loader />;
  if (!courseDay && error) return <Navigate to="/courses" />;

  return (
    <div className="space-y-6">
      <Breadcrumb items={breadcrumbItems} />

      <ToolbarActions>
        <div className="flex items-center gap-2">
          <Link to={`/courses/update/${courseDay.course?.id}`}>
            <Button title="Back" type="button" size="icon" variant="ghost">
              <ChevronLeftIcon />
            </Button>
          </Link>

          <Button
            title="Save"
            type="button"
            size="icon"
            variant="ghost"
            disabled={
              !form.formState.isDirty || updateCourseDayMutation.isPending
            }
            onClick={onSubmit}
          >
            {updateCourseDayMutation.isPending ? (
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

      <DetailsScreen
        mode="Update"
        title={courseDay.title || "Update Course Day"}
        isOpen={isOpen}
        setOpen={setOpen}
      >
        <Form {...form}>
          <CollapsibleContent>
            <CourseDayForm
              mode="Update"
              control={form.control}
              errors={form.formState.errors}
              existingImageUrl={existingImageUrl}
            />
          </CollapsibleContent>
        </Form>

        <CourseDayTabs isOpen={isOpen} courseDay={courseDay} />
      </DetailsScreen>

      <DeleteDialog
        title="Delete course day"
        confirmationMessage={
          <>
            You're about to delete{" "}
            <span className="font-semibold">"{courseDay.title}"</span>.
            <br /> Once deleted, the data cannot be recovered.
          </>
        }
        id={courseDay.id}
        queryKeys={[
          courseDayKeys.all,
          courseKeys.all,
          courseKeys.detail(courseDay.course!.id),
        ]}
        open={isDeleteOpen}
        setOpen={setDeleteOpen}
        onSuccess={() => navigate(`/courses/update/${courseDay.course_id}`)}
        target="course_day"
      />
    </div>
  );
};

export default UpdateCourseDayScreen;
