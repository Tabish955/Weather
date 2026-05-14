/**
 * Responsive layout hook.
 *
 * Detects viewport dimensions and provides breakpoints
 * without device sniffing — purely based on actual available space.
 */

import { useState, useEffect } from 'react';

export type Breakpoint = 'mobile' | 'tablet' | 'desktop';
export type Orientation = 'portrait' | 'landscape';

export interface ResponsiveLayout {
  breakpoint: Breakpoint;
  orientation: Orientation;
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isShortHeight: boolean;  // viewport < 600px tall
  isNarrow: boolean;       // viewport < 380px wide
}

function computeLayout(): ResponsiveLayout {
  const width = typeof window !== 'undefined' ? window.innerWidth : 1024;
  const height = typeof window !== 'undefined' ? window.innerHeight : 768;

  let breakpoint: Breakpoint = 'mobile';
  if (width >= 1024) breakpoint = 'desktop';
  else if (width >= 640) breakpoint = 'tablet';

  const orientation: Orientation = width >= height ? 'landscape' : 'portrait';

  return {
    breakpoint,
    orientation,
    width,
    height,
    isMobile: breakpoint === 'mobile',
    isTablet: breakpoint === 'tablet',
    isDesktop: breakpoint === 'desktop',
    isShortHeight: height < 600,
    isNarrow: width < 380,
  };
}

export function useResponsiveLayout(): ResponsiveLayout {
  const [layout, setLayout] = useState<ResponsiveLayout>(computeLayout);

  useEffect(() => {
    let rafId: number;

    const handleResize = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        setLayout(computeLayout());
      });
    };

    window.addEventListener('resize', handleResize);
    // Also re-check on orientation change for mobile devices
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return layout;
}
