import { useEffect, useRef, useState } from 'react';

/**
 * Hook to match the height of a target element to the combined height
 * of multiple source elements plus gaps
 */
export function useMatchedHeight(sourceRefs, gap = 16) {
  const targetRef = useRef(null);
  const [height, setHeight] = useState(null);

  useEffect(() => {
    if (!targetRef.current || !Array.isArray(sourceRefs) || sourceRefs.length === 0) return;

    const updateHeight = () => {
      let totalHeight = 0;
      let validRefs = 0;

      sourceRefs.forEach((ref) => {
        if (ref?.current) {
          const rect = ref.current.getBoundingClientRect();
          totalHeight += rect.height;
          validRefs++;
        }
      });

      // Add gaps between elements (gap * (number of elements - 1))
      if (validRefs > 1) {
        totalHeight += gap * (validRefs - 1);
      }

      if (totalHeight > 0) {
        setHeight(totalHeight);
      }
    };

    // Initial calculation
    updateHeight();

    // Update on resize
    const resizeObserver = new ResizeObserver(updateHeight);
    sourceRefs.forEach((ref) => {
      if (ref?.current) {
        resizeObserver.observe(ref.current);
      }
    });

    return () => {
      resizeObserver.disconnect();
    };
  }, [sourceRefs, gap]);

  return [targetRef, height];
}

