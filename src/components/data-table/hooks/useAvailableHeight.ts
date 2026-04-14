import { useEffect, useState } from "react";

/**
 * Measures the available vertical space from the top of the referenced element
 * to the bottom of the viewport. Re-measures on window resize and DOM changes.
 */
export function useAvailableHeight(
  ref: React.RefObject<HTMLElement | null>,
): number {
  const [height, setHeight] = useState(0);

  useEffect(() => {
    function measure() {
      if (!ref.current) return;
      const top = ref.current.getBoundingClientRect().top;
      setHeight(window.innerHeight - top - 8);
    }

    measure();
    window.addEventListener("resize", measure);

    const ro = new ResizeObserver(measure);
    ro.observe(document.documentElement);

    return () => {
      window.removeEventListener("resize", measure);
      ro.disconnect();
    };
  }, [ref]);

  return height;
}
