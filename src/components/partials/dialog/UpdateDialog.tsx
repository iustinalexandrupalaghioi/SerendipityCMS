import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { Dispatch, ReactNode, SetStateAction } from "react";

interface UpdateDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  title: string;
  description: string;
  children: ReactNode;
  className?: string;
  disableUpdate?: boolean;
}

const UpdateDialog = ({
  open,
  setOpen,
  title,
  description,
  children,
  className = "",
  disableUpdate,
}: UpdateDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className={cn(
          "md:min-w-xl max-w-full mt-4 top-4 md:top-0 translate-y-0 max-h-[80vh] md:max-h-[90vh] flex flex-col",
          className,
        )}
      >
        <DialogHeader className="text-start shrink-0 border-b pb-3">
          <DialogTitle className="text-primary">
            {title}{" "}
            {!disableUpdate && <span className="text-accent">(update)</span>}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateDialog;
