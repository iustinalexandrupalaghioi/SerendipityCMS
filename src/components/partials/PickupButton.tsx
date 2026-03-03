import { Button } from "@/components/ui/button";
import { SearchIcon } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

const PickupButton = ({
  setOpen,
}: {
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <Button
      title="Pickup"
      onClick={() => setOpen(true)}
      type="button"
      variant="ghost"
      className="inline-flex"
    >
      <SearchIcon />
    </Button>
  );
};

export default PickupButton;
