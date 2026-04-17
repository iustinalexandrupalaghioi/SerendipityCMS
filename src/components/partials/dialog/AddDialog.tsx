import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { PlusIcon } from "lucide-react";
import type { Dispatch, ReactNode, SetStateAction } from "react";

interface AddDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  title: string;
  description: string;
  children: ReactNode; // The form will be inside here
  className?: string;
  triggerVariant?: "default" | "outline" | "ghost";
  showTrigger?: boolean;
}

const AddDialog = ({
  open,
  setOpen,
  title,
  description,
  children,
  className = "",
  triggerVariant = "default",
  showTrigger = true,
}: AddDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {showTrigger && (
        <DialogTrigger asChild>
          <Button
            variant={triggerVariant}
            className="w-full sm:w-auto cursor-pointer mb-2"
          >
            <PlusIcon /> Add
          </Button>
        </DialogTrigger>
      )}

      <DialogContent
        className={cn(
          "md:min-w-xl max-w-full mt-4 top-4 md:top-0 translate-y-0 max-h-[80vh] md:max-h-[90vh] overflow-y-auto dark:scrollbar-track-[#09090b] scrollbar-thumb-rounded scrollbar-thumb-primary scrollbar-thin",
          className,
        )}
      >
        <DialogHeader className="text-start">
          <DialogTitle className="text-primary">
            {title} <span className="text-accent">(new item)</span>
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {children}
      </DialogContent>
    </Dialog>
  );
};

export default AddDialog;
