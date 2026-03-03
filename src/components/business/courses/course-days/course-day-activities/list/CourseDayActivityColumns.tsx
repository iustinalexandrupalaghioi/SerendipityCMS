import { DataTableColumnHeader } from "@/components/partials/data-table/DataTableHeader";
import DeleteDialog from "@/components/partials/dialog/DeleteDialog";
import { Button } from "@/components/ui/button";
import type { CourseDay, CourseDayActivity } from "@/types/Course";
import type { ColumnDef } from "@tanstack/react-table";
import { PenIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { UpdateCourseDayActivityDialog } from "../form/UpdateCourseDayActivityDialog";

export const CourseDayActivityColumns = (
  course_day: CourseDay,
): ColumnDef<CourseDayActivity>[] => [
  {
    id: "Activity",
    accessorKey: "activity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),
  },

  {
    id: "Actions",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.id} />
    ),
    cell: ({ row }) => {
      const [isDeleteOpen, setDeleteOpen] = useState<boolean>(false);
      const [isEditOpen, setEditOpen] = useState<boolean>(false);
      const activity = row.original;
      return (
        <div className="flex gap-2">
          <Button
            size="icon"
            variant="outline"
            title="Edit"
            onClick={() => setEditOpen(true)}
          >
            <PenIcon />
          </Button>

          <Button
            size="icon"
            variant="destructive"
            title="Delete"
            onClick={() => setDeleteOpen(true)}
          >
            <TrashIcon />
          </Button>

          {isEditOpen && (
            <UpdateCourseDayActivityDialog
              course_day={course_day}
              activity={activity}
              open={isEditOpen}
              setOpen={setEditOpen}
            />
          )}

          {isDeleteOpen && (
            <DeleteDialog
              title="Delete Activity"
              confirmationMessage={
                <>
                  Are you sure you want to delete the activity{" "}
                  <span className="font-semibold">{activity.activity}</span>
                  ? <br /> This action cannot be undone.
                </>
              }
              id={activity.id}
              queryKeys={[
                ["course-days"],
                ["course-day", activity.course_day_id],
              ]}
              open={isDeleteOpen}
              setOpen={setDeleteOpen}
              target="course_day_activity"
            />
          )}
        </div>
      );
    },
  },
];
