import { useCourseEnrollmentsCount } from "@/hooks/useCourses";
import type { ComponentType } from "react";
import LiveTile, { type BaseTileProps } from "./LiveTile";

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
