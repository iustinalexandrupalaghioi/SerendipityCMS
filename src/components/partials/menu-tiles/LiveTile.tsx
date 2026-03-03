import type { LucideProps } from "lucide-react";
import type { ForwardRefExoticComponent, RefAttributes } from "react";
import { NavLink } from "react-router";
import { Card, CardContent } from "../../ui/card";
import { cn } from "@/lib/utils";

export interface BaseTileProps {
  name: string;
  path: string;
  title: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  className?: string;
}

export interface LiveTileProps extends BaseTileProps {
  liveNumber: number;
}

const LiveTile = ({
  title,
  path,
  name,
  icon: Icon,
  liveNumber,
  className,
}: LiveTileProps) => {
  return (
    <NavLink title={title} to={path} key={name} className="group">
      <Card className="w-32 sm:w-36 h-32 flex flex-col items-center justify-center rounded-2xl border hover:shadow-lg hover:border-primary/50 transition-all duration-200">
        <CardContent className="flex flex-col items-center justify-center space-y-2 p-3">
          <div className="flex justify-between gap-2 sm:gap-5 items-center">
            <Icon className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
            <span className="text-3xl sm:text-4xl font-bold text-center group-hover:text-primary transition-colors">
              {liveNumber}
            </span>
          </div>
          {liveNumber <= 100 && (
            <span
              className={cn(
                "text-sm font-medium text-center group-hover:text-primary transition-colors",
                className,
              )}
            >
              {name}
            </span>
          )}
        </CardContent>
      </Card>
    </NavLink>
  );
};

export default LiveTile;
