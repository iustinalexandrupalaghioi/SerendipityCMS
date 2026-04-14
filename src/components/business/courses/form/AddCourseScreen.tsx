import Breadcrumb from "@/components/partials/Breadcrumb";
import DetailsScreen from "@/components/partials/DetailsScreen";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { supabase } from "@/lib/supabaseClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronLeftIcon, Loader2Icon, SaveIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import CourseForm from "./CourseForm";
import { CourseSchema, type CourseFormValues } from "./form-schema";
import { CollapsibleContent } from "@/components/ui/collapsible";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import ToolbarActions from "@/components/toolbar/ToolbarActions";

const AddCourseScreen = () => {
  const [open, setOpen] = useState(true);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const breadcrumbItems = [
    { path: "/", label: "Home" },
    { path: "/courses", label: "Courses" },
    { label: "Add Course" },
  ];

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(CourseSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      level: "beginner",
      advance_price: 0,
      available_spots: 0,
      remaining_spots: 0,
      location: "",
      image: undefined,
      duration_days: 0,
      start_date: format(new Date(), "yyyy-MM-dd"),
      is_open: true,
    },
  });

  const { control, setValue, handleSubmit, formState, reset } = form;

  const addCourseMutation = useMutation({
    mutationFn: async (values: CourseFormValues) => {
      if (!values.image) {
        throw new Error("Course image is required");
      }

      const bucket = "courses";
      const folder = Date.now().toString();
      const filePath = `${folder}/${values.image.name}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, values.image, { upsert: false });

      if (uploadError) throw uploadError;

      const { error, data } = await supabase
        .from("course")
        .insert({
          title: values.title,
          description: values.description,
          price: values.price,
          advance_price: values.advance_price,
          duration_days: values.duration_days,
          start_date: values.start_date,
          level: values.level,
          location: values.location,
          available_spots: values.available_spots,
          remaining_spots: values.remaining_spots,
          is_open: values.is_open ?? true,
          image_path: filePath,
        })
        .select()
        .single();

      if (error) throw error;

      return { course: data };
    },

    onSuccess: ({ course }) => {
      toast.success("Course added successfully");
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      reset();
      navigate(`/courses/update/${course.id}`);
    },

    onError: (err: any) => {
      toast.error(err.message ?? "Failed to add course");
    },
  });

  const onSubmit = handleSubmit((values) => addCourseMutation.mutate(values));

  return (
    <form onSubmit={onSubmit} className="space-y-6">
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
            disabled={!formState.isDirty || addCourseMutation.isPending}
            onClick={onSubmit}
          >
            {addCourseMutation.isPending ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              <SaveIcon />
            )}
          </Button>
        </div>
      </ToolbarActions>

      <DetailsScreen
        mode="Add"
        title="Add Course"
        isOpen={open}
        setOpen={setOpen}
      >
        <p className="text-muted-foreground text-sm mb-4">
          Fill in the course details below.
        </p>
        <Form {...form}>
          <CollapsibleContent>
            <Card className="border-accent flex flex-col items-center w-full overflow-x-auto px-4">
              <CourseForm
                mode="Add"
                control={control}
                errors={formState.errors}
                setValue={setValue}
              />
            </Card>
          </CollapsibleContent>
        </Form>
      </DetailsScreen>
    </form>
  );
};

export default AddCourseScreen;
