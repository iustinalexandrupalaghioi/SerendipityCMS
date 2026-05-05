import type { ComponentType } from "react";
import LiveTile, { type BaseTileProps } from "./LiveTile";
import { useCourseEnrollmentsCount } from "@/components/business/courses/course-enrollments/overview/useEnrollments";

export const createCourseEnrollmentsLiveTile =
  (): ComponentType<BaseTileProps> =>
  ({ name, path, title, icon }: BaseTileProps) => {
    const { data: count } = useCourseEnrollmentsCount();

    return (
      <LiveTile
        name={name}
        path={path}
        title={title}
        icon={icon}
        liveNumber={count ?? 0}
      />
    );
  };
