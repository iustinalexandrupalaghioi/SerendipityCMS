import { Button } from "@/components/ui/button";
import { SearchIcon } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

const LookupButton = ({
  setOpen,
}: {
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <Button
      title="Lookup"
      onClick={() => setOpen(true)}
      type="button"
      variant="ghost"
      className="inline-flex"
    >
      <SearchIcon />
    </Button>
  );
};

export default LookupButton;
