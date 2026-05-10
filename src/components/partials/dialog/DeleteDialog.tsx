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
import { supabase } from "@/lib/supabaseClient";
import {
  type QueryKey,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { type Dispatch, type ReactNode, type SetStateAction } from "react";
import { toast } from "sonner";

interface DeleteDialogProps {
  open: boolean;
  title: string;
  setOpen: Dispatch<SetStateAction<boolean>>;
  id: string | number;
  confirmationMessage?: ReactNode;
  target: string;
  queryKeys: QueryKey[];
  deleteFn?: () => Promise<void>;
  onSuccess?: () => void;
}

const DeleteDialog = ({
  open,
  setOpen,
  id,
  title,
  confirmationMessage,
  target,
  queryKeys,
  deleteFn,
  onSuccess,
}: DeleteDialogProps) => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      if (!deleteFn) {
        if (!id) throw new Error("Invalid ID for deletion.");

        const { error } = await supabase.from(target).delete().eq("id", id);

        if (error) {
          throw error;
        }
      }

      if (deleteFn) {
        await deleteFn();
      }
    },
    onSuccess: async () => {
      toast.success("Item deleted successfully!");

      for (const queryKey of queryKeys) {
        await queryClient.invalidateQueries({ queryKey });
      }
      onSuccess?.();
      setOpen(false);
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to delete item.");
      setOpen(false);
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="md:min-w-2xl max-w-full mt-4 top-4 translate-y-0">
        <DialogHeader>
          <DialogTitle className="text-primary">{title}</DialogTitle>
          <DialogDescription className="text-foreground">
            {confirmationMessage ??
              "Are you sure you want to delete this item?"}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex w-full flex-col md:flex-row-reverse gap-2 mt-4">
          <Button
            onClick={() => mutate()}
            className="flex-1"
            type="button"
            disabled={isPending}
            title="Delete"
          >
            {isPending ? (
              <>
                <Loader2Icon className="animate-spin mr-2 h-4 w-4" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </Button>

          <DialogClose className="flex-1" asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDialog;
