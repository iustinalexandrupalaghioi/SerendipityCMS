import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PlusIcon } from "lucide-react";
import { Link } from "react-router";

interface AddButtonProps {
  variant?: "default" | "outline" | "ghost";
  path: string;
  className?: string;
}
const AddButton = ({ variant, className, path }: AddButtonProps) => {
  return (
    <Link to={path}>
      <Button
        variant={variant}
        className={cn("w-full sm:w-auto cursor-pointer mb-2", className)}
      >
        <PlusIcon /> Add{" "}
      </Button>{" "}
    </Link>
  );
};

export default AddButton;
