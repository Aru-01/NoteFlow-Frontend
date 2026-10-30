'use client';

import { useState, useEffect } from "react";

/**
 * Custom hook for 3-device responsive breakpoint detection
 * - isMobile: < 768px
 * - isTablet: 768px - 1024px
 * - isDesktop: > 1024px
 */
export function useMediaQuery() {
  const [device, setDevice] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    width: 1200,
  });

  useEffect(() => {
    function handleResize() {
      const width = window.innerWidth;
      setDevice({
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024,
        width,
      });
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return device;
}

