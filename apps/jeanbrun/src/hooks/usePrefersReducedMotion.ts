"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Get current reduced motion preference from the browser
 */
function getSnapshot(): boolean {
  return window.matchMedia(QUERY).matches;
}

/**
 * Server-side fallback - assume no motion preference
 */
function getServerSnapshot(): boolean {
  return false;
}

/**
 * Subscribe to media query changes
 */
function subscribe(callback: () => void): () => void {
  const mediaQueryList = window.matchMedia(QUERY);
  mediaQueryList.addEventListener("change", callback);
  return () => mediaQueryList.removeEventListener("change", callback);
}

/**
 * Custom hook to detect user's motion preference
 * Returns true if user prefers reduced motion (accessibility setting)
 *
 * Uses useSyncExternalStore for proper React 18+ integration with
 * external browser APIs without causing cascading renders.
 *
 * Usage:
 * ```tsx
 * const prefersReducedMotion = usePrefersReducedMotion();
 *
 * // In Framer Motion:
 * const variants = prefersReducedMotion
 *   ? { initial: {}, animate: {} }
 *   : { initial: { opacity: 0 }, animate: { opacity: 1 } };
 * ```
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
