import { DataTableColumnHeader } from "@/components/partials/data-table/DataTableHeader";
import DeleteDialog from "@/components/partials/dialog/DeleteDialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";
import { scrollToTop } from "@/lib/utils";
import type { CourseDay } from "@/types/Course";
import type { ColumnDef } from "@tanstack/react-table";
import { PenIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

export const CourseDayColumns: ColumnDef<CourseDay>[] = [
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
    id: "Day",
    accessorKey: "day_number",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),

    enableResizing: true,
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
    id: "Actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),
    cell: ({ row }) => {
      const [isDeleteOpen, setDeleteOpen] = useState<boolean>(false);
      const courseDay = row.original;

      const deleteCourseDay = async (id: string) => {
        // Step 1: Fetch the course_day to get the image path
        const { data: courseDay, error: fetchError } = await supabase
          .from("course_day")
          .select("image_path")
          .eq("id", id)
          .single();

        if (fetchError || !courseDay) {
          console.error("Error fetching course_day:", fetchError);
          throw new Error("Failed to fetch course_day image.");
        }

        // Step 2: Delete the image from Supabase Storage if it exists
        if (courseDay.image_path) {
          const bucket = "courses"; // your bucket name
          const { error: deleteImageError } = await supabase.storage
            .from(bucket)
            .remove([courseDay.image_path]);

          if (deleteImageError) {
            console.error("Error deleting course_day image:", deleteImageError);
            throw new Error("Failed to delete course_day image.");
          }
        }

        // Step 3: Delete the course_day record from the database
        const { error: deleteCourseDayError } = await supabase
          .from("course_day")
          .delete()
          .eq("id", id);

        if (deleteCourseDayError) {
          console.error(
            "Error deleting course_day record:",
            deleteCourseDayError,
          );
          throw new Error("Failed to delete course_day.");
        }

        console.log("Course day and its image deleted successfully.");
      };
      return (
        <div className="flex gap-2">
          <Link
            to={`/courses/update/${courseDay.course_id}/course-days/update/${courseDay.id}`}
          >
            <Button
              type="button"
              onClick={scrollToTop}
              size="icon"
              variant="outline"
              title="Edit"
            >
              <PenIcon />
            </Button>
          </Link>

          <Button
            type="button"
            size="icon"
            variant="destructive"
            title="Delete"
            onClick={() => setDeleteOpen(true)}
          >
            <TrashIcon />
          </Button>

          {isDeleteOpen && (
            <DeleteDialog
              title="Delete Course Day"
              confirmationMessage={
                <>
                  You're about to delete the course day{" "}
                  <span className="font-semibold">"{courseDay.title}"</span> .
                  <br /> Once deleted, the data cannot be recovered.
                </>
              }
              id={courseDay.id}
              queryKeys={[
                ["courses"],
                ["course", courseDay.course_id],
                ["course-days", courseDay.id],
              ]}
              open={isDeleteOpen}
              setOpen={setDeleteOpen}
              target="course_day"
              deleteFn={() => deleteCourseDay(courseDay.id)}
            />
          )}
        </div>
      );
    },
  },
];
