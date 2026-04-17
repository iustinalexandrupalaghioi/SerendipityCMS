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
    <Dialog modal={false} open={open} onOpenChange={setOpen}>
      {open && (
        <DialogContent
          // onInteractOutside={(e) => e.preventDefault()}
          className={cn(
            "md:min-w-xl max-w-full mt-4 top-0 translate-y-0 max-h-[80vh]  md:max-h-[90vh] overflow-y-auto scrollbar-thin dark:scrollbar-track-[#09090b] scrollbar-thumb-rounded scrollbar-thumb-primary",
            className,
          )}
        >
          <DialogHeader className="text-start">
            <DialogTitle className="text-primary">
              {title}{" "}
              {!disableUpdate && <span className="text-accent">(update)</span>}
            </DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>

          {children}
        </DialogContent>
      )}
    </Dialog>
  );
};

export default UpdateDialog;
