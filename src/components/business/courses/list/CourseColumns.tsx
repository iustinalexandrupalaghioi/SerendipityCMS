import BooleanDisplay from "@/components/partials/BooleanDisplay";
import { DataTableColumnHeader } from "@/components/partials/data-table/DataTableHeader";
import DeleteDialog from "@/components/partials/dialog/DeleteDialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";
import type { Course } from "@/types/Course";
import type { ColumnDef } from "@tanstack/react-table";
import { PenIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

export const CourseColumns: ColumnDef<Course>[] = [
  {
    id: "Image",
    accessorKey: "image_url",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-start py-1">
        <img
          src={row.original.image_url}
          alt={row.original.title}
          className="w-16 h-16 object-cover rounded-md shadow-sm"
        />
      </div>
    ),
    enableResizing: false,
    maxSize: 80,
    minSize: 80,
  },
  {
    id: "Title",
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),

    enableResizing: true,
  },
  {
    id: "Level",
    accessorKey: "level",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),
    cell: ({ row }) => <span className="capitalize">{row.original.level}</span>,
    enableResizing: true,
  },

  {
    id: "Description",
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),
    enableResizing: true,
  },
  {
    id: "Duration (days)",
    accessorKey: "duration_days",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),
    enableResizing: true,
  },
  {
    id: "Open",
    accessorKey: "is_open",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),
    cell: ({ row }) => <BooleanDisplay value={row.original.is_open} />,
    enableResizing: true,
  },
  {
    id: "Price (EUR)",
    accessorKey: "price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),
    enableResizing: true,
  },
  {
    id: "Advance price (EUR)",
    accessorKey: "advance_price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),
    enableResizing: true,
  },

  {
    id: "Actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),
    cell: ({ row }) => {
      const [isDeleteOpen, setDeleteOpen] = useState<boolean>(false);
      const course = row.original;

      const deleteCourse = async (id: string) => {
        // Step 1: Fetch course and course_day image paths
        const { data: course, error: fetchError } = await supabase
          .from("course")
          .select("image_path, course_day(image_path, id)")
          .eq("id", id)
          .single();

        console.log(course);

        if (fetchError || !course) {
          console.error("Error fetching course:", fetchError);
          throw new Error("Failed to fetch course images.");
        }

        // Step 2: Delete course_day images
        if (course.course_day?.length) {
          const bucket = "courses";
          const paths = course.course_day
            .filter((day) => day.image_path)
            .map((day) => day.image_path!);

          if (paths.length) {
            const { error: deleteDayImagesError } = await supabase.storage
              .from(bucket)
              .remove(paths);

            if (deleteDayImagesError) {
              console.error(
                "Error deleting course_day images:",
                deleteDayImagesError,
              );
              throw new Error("Failed to delete course_day images.");
            }
          }
        }

        // Step 3: Delete course image
        if (course.image_path) {
          const bucket = "courses";
          const { error: deleteCourseImageError } = await supabase.storage
            .from(bucket)
            .remove([course.image_path]);

          if (deleteCourseImageError) {
            console.error(
              "Error deleting course image:",
              deleteCourseImageError,
            );
            throw new Error("Failed to delete course image.");
          }
        }

        // Step 4: Delete the course (and optionally course_days if no FK cascade)
        const { error: deleteCourseError } = await supabase
          .from("course")
          .delete()
          .eq("id", id);

        if (deleteCourseError) {
          console.error("Error deleting course record:", deleteCourseError);
          throw new Error("Failed to delete course.");
        }
      };

      return (
        <div className="flex gap-2">
          <Link to={`/courses/update/${course.id}`}>
            <Button size="icon" variant="outline" title="Edit">
              <PenIcon />
            </Button>
          </Link>

          <Button
            size="icon"
            variant="destructive"
            title="Delete"
            onClick={() => setDeleteOpen(true)}
          >
            <TrashIcon />
          </Button>

          {isDeleteOpen && (
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
              target="course"
              deleteFn={() => deleteCourse(course.id)}
            />
          )}
        </div>
      );
    },
  },
];
