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
          className={cn(
            "md:min-w-xl max-w-full mt-4 top-4 md:top-0 translate-y-0 max-h-[80vh] md:max-h-[90vh] flex flex-col overflow-hidden",
            className,
          )}
        >
          <DialogHeader className="text-start shrink-0 border-b pb-3">
            <DialogTitle className="text-primary">{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          {children && (
            <div className="flex-1 min-h-0 flex flex-col overflow-hidden -mb-5">
              {children}
            </div>
          )}
          {showFooter && (
            <DialogFooter className="flex shrink-0 border-t flex-col md:flex-row-reverse gap-2 pt-4 mt-4">
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
