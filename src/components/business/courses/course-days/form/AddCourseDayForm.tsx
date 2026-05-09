import Breadcrumb from "@/components/partials/Breadcrumb";
import DetailsScreen from "@/components/partials/DetailsScreen";
import ToolbarActions from "@/components/toolbar/ToolbarActions";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { supabase } from "@/lib/supabaseClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronLeftIcon, Loader2Icon, SaveIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { courseKeys, useCourse } from "../../overview/useCourses";
import { courseDayKeys } from "../nav-overview/useCourseDays";
import CourseDayForm from "./CourseDayForm";
import { CourseDaySchema, type CourseDayFormValues } from "./form-schema";

const AddCourseDayScreen = () => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { courseId } = useParams();
  const { data: course } = useCourse(courseId || "");

  const breadcrumbItems = [
    { path: "/", label: "Home" },
    { path: "/courses", label: "Courses" },
    {
      path: `/courses/update/${course?.id}`,
      label: `Course ${course?.display_id ?? "Course"}`,
    },
    { label: "Add course day" },
  ];

  const form = useForm<CourseDayFormValues>({
    resolver: zodResolver(CourseDaySchema),
    defaultValues: {
      title: "",
      day_number: 1,
      course: course || undefined,
      image: undefined,
    },
  });

  const { control, handleSubmit, formState, reset } = form;

  const addCourseDayMutation = useMutation({
    mutationFn: async (values: CourseDayFormValues) => {
      if (!values.course?.id) throw new Error("Course is required.");
      if (!values.image) throw new Error("Course day image is required.");

      const bucket = "courses";
      const folder = `${values.course.id}/${Date.now()}`;
      const filePath = `${folder}/${values.image.name}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, values.image, { upsert: false });
      if (uploadError) throw uploadError;

      const { image, course, ...valuesToInsert } = values;
      const { data, error } = await supabase
        .from("course_day")
        .insert({
          ...valuesToInsert,
          course_id: course.id,
          image_path: filePath,
        })
        .select()
        .single();
      if (error) throw error;

      return { courseDay: data };
    },
    onSuccess: ({ courseDay }) => {
      toast.success("Course day added successfully");
      queryClient.invalidateQueries({
        queryKey: courseKeys.all,
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: courseKeys.detail(courseDay.course_id),
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: courseDayKeys.all,
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: courseDayKeys.detail(courseDay.id),
        refetchType: "all",
      });
      reset();
      navigate(
        `/courses/update/${courseDay.course_id}/course-days/update/${courseDay.id}`,
      );
    },
    onError: (err: any) => {
      toast.error(err.message ?? "Failed to add course day");
    },
  });

  const onSubmit = handleSubmit((values) =>
    addCourseDayMutation.mutate(values),
  );

  return (
    <div className="space-y-6">
      <Breadcrumb items={breadcrumbItems} />

      <ToolbarActions>
        <div className="flex items-center gap-2">
          <Link to={`/courses/update/${courseId}`}>
            <Button title="Back" type="button" size="icon" variant="ghost">
              <ChevronLeftIcon />
            </Button>
          </Link>

          <Button
            title="Save"
            type="button"
            size="icon"
            variant="ghost"
            disabled={!formState.isDirty || addCourseDayMutation.isPending}
            onClick={onSubmit}
          >
            {addCourseDayMutation.isPending ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              <SaveIcon />
            )}
          </Button>
        </div>
      </ToolbarActions>

      <DetailsScreen
        mode="Add"
        title="Add Course Day"
        isOpen={open}
        setOpen={setOpen}
        collapsible={false}
      >
        <Form {...form}>
          <CourseDayForm
            mode="Add"
            control={control}
            errors={formState.errors}
          />
        </Form>
      </DetailsScreen>
    </div>
  );
};

export default AddCourseDayScreen;
