import Breadcrumb from "@/components/partials/Breadcrumb";
import DetailsScreen from "@/components/partials/DetailsScreen";
import { Button } from "@/components/ui/button";
import { CollapsibleContent } from "@/components/ui/collapsible";
import { Form } from "@/components/ui/form";
import { useCourse } from "@/hooks/useCourses";
import { supabase } from "@/lib/supabaseClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2Icon, SaveIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import CourseDayForm from "./CourseDayForm";
import { CourseDaySchema, type CourseDayFormValues } from "./form-schema";
import { Card } from "@/components/ui/card";

const AddCourseDayScreen = () => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { courseId } = useParams();
  const { data: course } = useCourse(courseId || "");

  /* =====================
     BREADCRUMB ITEMS
  ====================== */
  const breadcrumbItems = [
    { path: "/", label: "Home" },
    { path: "/courses", label: "Courses" },
    { path: `/courses/update/${courseId}`, label: course?.title || "Course" },
    { label: "Course Days" },
    { label: "Add Course Day" },
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
      if (!values.course?.id) {
        throw new Error("Course is required to add a course day.");
      }

      if (!values.image) {
        throw new Error("Course day image is required.");
      }

      /* =====================
         IMAGE UPLOAD
      ====================== */
      const bucket = "courses";
      const folder = `${values.course.id}/${Date.now().toString()}`;
      const filePath = `${folder}/${values.image.name}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, values.image, { upsert: false });

      if (uploadError) throw uploadError;

      /* =====================
         INSERT COURSE DAY
      ====================== */
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
      queryClient.refetchQueries({ queryKey: ["courses"] });
      queryClient.refetchQueries({ queryKey: ["course-days"] });
      queryClient.refetchQueries({
        queryKey: ["course", courseDay.course_id],
      });
      queryClient.refetchQueries({ queryKey: ["course-day", courseDay.id] });
      reset();
      navigate(
        `/courses/update/${courseDay.course_id}/course-days/update/${courseDay.id} `,
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
    <>
      <Breadcrumb items={breadcrumbItems} />
      <DetailsScreen
        mode="Add"
        title="Add Course Day"
        isOpen={open}
        setOpen={setOpen}
      >
        <CollapsibleContent>
          <p className="text-muted-foreground text-sm my-2">
            Create a new day for an existing course.
          </p>

          <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-4 w-full">
              {/* ACTIONS */}
              <div className="flex w-full flex-col md:flex-row gap-2 mt-4">
                <Button
                  type="submit"
                  disabled={
                    !formState.isDirty || addCourseDayMutation.isPending
                  }
                >
                  {addCourseDayMutation.isPending ? (
                    <>
                      <Loader2Icon className="animate-spin mr-2 h-4 w-4" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <SaveIcon className="h-4 w-4 mr-2" />
                      Add
                    </>
                  )}
                </Button>

                <Link
                  to={`/courses/update/${course?.id}`}
                  className="w-full md:w-auto"
                >
                  <Button
                    type="button"
                    className="w-full md:w-auto"
                    variant="outline"
                  >
                    <XIcon className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </Link>
              </div>

              {/* FORM */}
              <Card className="border-accent flex flex-col items-center w-full overflow-x-auto px-4">
                <CourseDayForm
                  mode="Add"
                  control={control}
                  errors={formState.errors}
                />
              </Card>
            </form>
          </Form>
        </CollapsibleContent>
      </DetailsScreen>{" "}
    </>
  );
};

export default AddCourseDayScreen;
