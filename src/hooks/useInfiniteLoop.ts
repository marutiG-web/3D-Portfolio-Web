import React, { useState, useEffect, useRef, useCallback, RefObject } from 'react';

export interface UseInfiniteLoopReturn {
  set1Ref: RefObject<HTMLDivElement>;
  isLoopEnabled: boolean;
  toggleLoop: () => void;
  loopCount: number;
  setHeight: number;
  scrollProgress: number;
  teleportToTop: () => void;
}

export function useInfiniteLoop(): UseInfiniteLoopReturn {
  const set1Ref = useRef<HTMLDivElement>(null);
  const [isLoopEnabled, setIsLoopEnabled] = useState<boolean>(true);
  const [loopCount, setLoopCount] = useState<number>(1);
  const [setHeight, setSetHeight] = useState<number>(0);
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  // Measure setHeight accurately on resize/mount
  const updateHeight = useCallback(() => {
    if (set1Ref.current) {
      const h = set1Ref.current.getBoundingClientRect().height;
      if (h > 0) {
        setSetHeight(h);
      }
    }
  }, []);

  useEffect(() => {
    updateHeight();

    if (!set1Ref.current) return;
    const resizeObserver = new ResizeObserver(() => {
      updateHeight();
    });
    resizeObserver.observe(set1Ref.current);

    window.addEventListener('resize', updateHeight);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateHeight);
    };
  }, [updateHeight]);

  // Infinite Scroll Loop Listener
  useEffect(() => {
    if (!isLoopEnabled) return;

    let isJumping = false;

    const handleScroll = () => {
      if (isJumping) return;
      const h = setHeight || (set1Ref.current ? set1Ref.current.getBoundingClientRect().height : 0);
      if (!h || h <= 0) return;

      const currentY = window.scrollY;

      // Calculate progress inside single loop (0 to 100%)
      const normalizedY = currentY % h;
      const progress = Math.min(100, Math.max(0, Math.round((normalizedY / h) * 100)));
      setScrollProgress(progress);

      // Current loop iteration number
      const loopNumber = Math.floor(currentY / h) + 1;
      setLoopCount(loopNumber);

      // Loop condition: When scrolling down past Set 1 into Set 2
      if (currentY >= h) {
        isJumping = true;
        window.scrollTo({
          top: currentY % h,
          behavior: 'instant' as ScrollBehavior
        });
        requestAnimationFrame(() => {
          isJumping = false;
        });
      } else if (currentY < 0) {
        // Loop condition: When scrolling UP above 0
        isJumping = true;
        window.scrollTo({
          top: h + currentY,
          behavior: 'instant' as ScrollBehavior
        });
        requestAnimationFrame(() => {
          isJumping = false;
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isLoopEnabled, setHeight]);

  const toggleLoop = () => {
    setIsLoopEnabled((prev) => !prev);
  };

  const teleportToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return {
    set1Ref,
    isLoopEnabled,
    toggleLoop,
    loopCount,
    setHeight,
    scrollProgress,
    teleportToTop
  };
}
