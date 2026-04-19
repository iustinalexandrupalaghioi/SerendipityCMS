import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { LoaderIcon } from "lucide-react";
import { type Dispatch, type ReactNode, type SetStateAction } from "react";

interface AddDialogProps {
  open: boolean;
  action?: string;
  showFooter?: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  title: string;
  description?: ReactNode;
  isPending?: boolean;
  children?: ReactNode;
  onClick?: () => void;
  onCancel?: () => void;
  className?: string;
  isDirty?: boolean;
}

const ActionDialog = ({
  open,
  setOpen,
  title,
  action,
  showFooter = true,
  children,
  description,
  isPending = false,
  className,
  onClick,
  onCancel,
  isDirty,
}: AddDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {open && (
        <DialogContent
          // onInteractOutside={(e) => e.preventDefault()}
          className={cn(
            "max-w-full md:min-w-xl mt-4 top-0 translate-y-0 max-h-[70vh] md:max-h-[90vh] overflow-y-auto scrollbar-thin dark:scrollbar-track-[#09090b] scrollbar-thumb-rounded scrollbar-thumb-primary",
            className,
          )}
        >
          <DialogHeader>
            <DialogTitle className="text-primary">{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          {children && children}
          {showFooter && (
            <DialogFooter className="flex w-full flex-col md:flex-row-reverse gap-2 mt-4">
              <Button
                className="flex-1"
                type="submit"
                title={action}
                disabled={isPending || !isDirty}
                onClick={onClick}
              >
                {isPending ? (
                  <>
                    <LoaderIcon className="animate-spin" />
                    Loading...
                  </>
                ) : (
                  <span>{action}</span>
                )}
              </Button>
              <DialogClose className="flex-1" asChild>
                <Button
                  title="Cancel"
                  onClick={onCancel}
                  type="button"
                  variant="outline"
                >
                  Cancel
                </Button>
              </DialogClose>
            </DialogFooter>
          )}
        </DialogContent>
      )}
    </Dialog>
  );
};

export default ActionDialog;
