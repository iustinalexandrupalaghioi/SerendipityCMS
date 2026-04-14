import type { RowAction } from "@/components/data-table/core/types";
import type { Course } from "@/types/Course";
import type { Row } from "@tanstack/react-table";
import { useMemo, type Dispatch, type SetStateAction } from "react";

// ─────────────────────────────────────────────
// useCourseActions
//
// Returns actions for the context menu and toolbar.
// All actions are disabled for multi-selection —
// dialogs only support a single course at a time.
//
// Dialog state is owned by CoursesOverview so the
// dialogs can be rendered at the page level.
// ─────────────────────────────────────────────

interface UseCourseActionsProps {
  setOpenEnrollmentCourse: Dispatch<SetStateAction<Course | null>>;
  setCloseEnrollmentCourse: Dispatch<SetStateAction<Course | null>>;
}

export function useCourseActions({
  setOpenEnrollmentCourse,
  setCloseEnrollmentCourse,
}: UseCourseActionsProps): RowAction<Course>[] {
  return useMemo(
    () => [
      {
        label: "Open enrollment",
        // Only eligible for a single closed course
        isEligible: (row: Row<Course>) => !row.original.is_open,
        onSelect: (rows: Row<Course>[]) => {
          if (rows.length !== 1) return;
          setOpenEnrollmentCourse(rows[0].original);
        },
      },
      {
        label: "Close enrollment",
        // Only eligible for a single open course
        isEligible: (row: Row<Course>) => row.original.is_open,
        onSelect: (rows: Row<Course>[]) => {
          if (rows.length !== 1) return;
          setCloseEnrollmentCourse(rows[0].original);
        },
      },
    ],
    [setOpenEnrollmentCourse, setCloseEnrollmentCourse],
  );
}
