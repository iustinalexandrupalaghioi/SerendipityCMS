import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { type Dispatch, type ReactNode, type SetStateAction } from "react";

interface DetailsScreenProps {
  title: string;
  children: ReactNode;
  className?: string;
  mode: "Add" | "Update";
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const DetailsScreen = ({
  title,
  className = "",
  mode,
  isOpen,
  setOpen,
  children,
}: DetailsScreenProps) => {
  return (
    <Collapsible
      defaultOpen={true}
      className={cn("min-h-screen flex flex-col mt-4", className)}
    >
      <CollapsibleTrigger
        className="flex items-center mb-2 gap-2 cursor-pointer"
        onClick={() => setOpen(!isOpen)}
      >
        <span className="text-primary text-start">{title}</span>
        {mode === "Add" && <span className="text-accent">(new item)</span>}
        <ChevronDown
          className={`w-6 h-6 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </CollapsibleTrigger>{" "}
      {children}
    </Collapsible>
  );
};

export default DetailsScreen;
