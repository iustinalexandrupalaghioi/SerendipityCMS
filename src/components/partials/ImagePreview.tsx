import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useState } from "react";

// ─────────────────────────────────────────────
// useIsCoarsePointer
//
// Returns true on touch/mobile devices where
// hover is unavailable. Uses the pointer media
// query which is more reliable than user agent.
// ─────────────────────────────────────────────

function useIsCoarsePointer() {
  const [isCoarse, setIsCoarse] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)");
    setIsCoarse(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsCoarse(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return isCoarse;
}

// ─────────────────────────────────────────────
// ImagePreview
//
// Shows filename as a subtle link.
// Desktop — hover tooltip with image preview.
// Mobile  — tap popover with image preview.
// ─────────────────────────────────────────────

interface ImagePreviewProps {
  src: string;
  alt: string;
  filename: string;
}

export function ImagePreview({ src, alt, filename }: ImagePreviewProps) {
  const isCoarse = useIsCoarsePointer();

  const trigger = (
    <span className="cursor-pointer text-xs text-muted-foreground underline-offset-2 hover:underline">
      {filename}
    </span>
  );

  const preview = (
    <img src={src} alt={alt} className="h-64 w-64 rounded-md object-cover" />
  );

  if (isCoarse) {
    return (
      <Popover>
        <PopoverTrigger asChild>{trigger}</PopoverTrigger>
        <PopoverContent side="right" className="w-fit p-1">
          {preview}
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{trigger}</TooltipTrigger>
        <TooltipContent side="right" className="p-1">
          {preview}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
