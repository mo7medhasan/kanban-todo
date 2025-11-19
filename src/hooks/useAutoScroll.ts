// src/hooks/useAutoScroll.ts
import {  useRef } from "react";

interface AutoScrollOptions {
  enabled: boolean;
  speed?: number; // max px per frame
  edgeSize?: number; // distance from edge to activate scroll
}

export function useAutoScroll(
  containerRef: React.RefObject<HTMLElement | null>,
  { enabled, speed = 20, edgeSize = 80 }: AutoScrollOptions
) {
  const frame = useRef<number | null>(null);
  const velocityX = useRef(0);

  const stopScrolling = () => {
    if (frame.current) cancelAnimationFrame(frame.current);
    frame.current = null;
    velocityX.current = 0;
  };

  const step = () => {
    const container = containerRef.current;
    if (!container) return;

    container.scrollLeft += velocityX.current;

    if (Math.abs(velocityX.current) > 0.5) {
      frame.current = requestAnimationFrame(step);
    } else {
      stopScrolling();
    }
  };

  // --------------------------
  // The function we call from dragOver
  // --------------------------
  const updateX = (clientX: number) => {
    const container = containerRef.current;
    if (!container || !enabled) return;

    const rect = container.getBoundingClientRect();
    let vx = 0;

    if (clientX < rect.left + edgeSize) {
      const dist = clientX - rect.left;
      const intensity = 1 - dist / edgeSize;
      vx = -speed * intensity;
    } else if (clientX > rect.right - edgeSize) {
      const dist = rect.right - clientX;
      const intensity = 1 - dist / edgeSize;
      vx = speed * intensity;
    }

    velocityX.current = vx;

    if (!frame.current) frame.current = requestAnimationFrame(step);
  };

  return { updateX };
}
