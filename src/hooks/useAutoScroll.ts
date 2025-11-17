import { useEffect, useRef } from 'react';

interface UseAutoScrollOptions {
  enabled: boolean;
  scrollThreshold?: number;
  scrollSpeed?: number;
}

export const useAutoScroll = ({ 
  enabled, 
  scrollThreshold = 100, 
  scrollSpeed = 10 
}: UseAutoScrollOptions) => {
  const animationFrameId = useRef<number | null>(null);
  const scrollContainerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!enabled) {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
      return;
    }

    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      if (!scrollContainerRef.current) {
        scrollContainerRef.current = document.querySelector('.scroll-container');
      }

      const container = scrollContainerRef.current;
      if (!container) return;

      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const rect = container.getBoundingClientRect();

      // Horizontal scrolling
      const distanceFromLeft = clientX - rect.left;
      const distanceFromRight = rect.right - clientX;

      // Vertical scrolling
      const distanceFromTop = clientY - rect.top;
      const distanceFromBottom = rect.bottom - clientY;

      let scrollX = 0;
      let scrollY = 0;

      // Determine horizontal scroll direction and speed
      if (distanceFromLeft < scrollThreshold && distanceFromLeft > 0) {
        scrollX = -scrollSpeed * (1 - distanceFromLeft / scrollThreshold);
      } else if (distanceFromRight < scrollThreshold && distanceFromRight > 0) {
        scrollX = scrollSpeed * (1 - distanceFromRight / scrollThreshold);
      }

      // Determine vertical scroll direction and speed
      if (distanceFromTop < scrollThreshold && distanceFromTop > 0) {
        scrollY = -scrollSpeed * (1 - distanceFromTop / scrollThreshold);
      } else if (distanceFromBottom < scrollThreshold && distanceFromBottom > 0) {
        scrollY = scrollSpeed * (1 - distanceFromBottom / scrollThreshold);
      }

      // Perform scrolling
      if (scrollX !== 0 || scrollY !== 0) {
        const scroll = () => {
          if (container) {
            container.scrollLeft += scrollX;
            container.scrollTop += scrollY;
            animationFrameId.current = requestAnimationFrame(scroll);
          }
        };

        if (!animationFrameId.current) {
          animationFrameId.current = requestAnimationFrame(scroll);
        }
      } else {
        if (animationFrameId.current) {
          cancelAnimationFrame(animationFrameId.current);
          animationFrameId.current = null;
        }
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('touchmove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchmove', handleMouseMove);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [enabled, scrollThreshold, scrollSpeed]);

  return { scrollContainerRef };
};