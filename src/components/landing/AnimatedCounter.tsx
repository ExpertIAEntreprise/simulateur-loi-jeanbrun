"use client";

import { useMemo, useSyncExternalStore } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

interface AnimatedCounterProps {
  /** Target value to animate to (default: 50000) */
  targetValue?: number;
  /** Animation duration in milliseconds (default: 2000) */
  duration?: number;
  /** Suffix to display after the number (default: "€") */
  suffix?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Format a number to French locale with space as thousand separator
 * e.g., 50000 -> "50 000"
 */
function formatNumber(value: number): string {
  return Math.round(value).toLocaleString("fr-FR");
}

/**
 * Easing function: easeOutQuart
 * Creates a smooth deceleration effect
 */
function easeOutQuart(t: number): number {
  return 1 - Math.pow(1 - t, 4);
}

interface AnimationStore {
  subscribe: (callback: () => void) => () => void;
  getSnapshot: () => number;
  getServerSnapshot: () => number;
}

/**
 * Creates an animation store that can be subscribed to
 */
function createAnimationStore(
  targetValue: number,
  duration: number
): AnimationStore {
  let currentValue = 0;
  let startTime: number | null = null;
  let animationId: number | null = null;
  const listeners = new Set<() => void>();

  const notify = () => {
    listeners.forEach((listener) => listener());
  };

  const animate = (timestamp: number) => {
    if (startTime === null) {
      startTime = timestamp;
    }

    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeOutQuart(progress);
    currentValue = easedProgress * targetValue;

    notify();

    if (progress < 1) {
      animationId = requestAnimationFrame(animate);
    } else {
      currentValue = targetValue;
      notify();
    }
  };

  return {
    subscribe: (callback: () => void) => {
      listeners.add(callback);
      // Start animation on first subscription
      if (listeners.size === 1 && animationId === null) {
        animationId = requestAnimationFrame(animate);
      }
      return () => {
        listeners.delete(callback);
        if (listeners.size === 0 && animationId !== null) {
          cancelAnimationFrame(animationId);
          animationId = null;
        }
      };
    },
    getSnapshot: () => currentValue,
    getServerSnapshot: () => targetValue,
  };
}

/**
 * AnimatedCounter - Animated number counter with accessibility support
 *
 * Features:
 * - Smooth animation from 0 to target value
 * - French number formatting (space as thousand separator)
 * - Respects prefers-reduced-motion accessibility setting
 * - Uses aria-live for screen reader announcements
 * - JetBrains Mono font for consistent number display
 * - Gold color with glow effect using CSS custom properties
 *
 * @example
 * ```tsx
 * <AnimatedCounter />
 * <AnimatedCounter targetValue={100000} duration={3000} suffix=" EUR" />
 * ```
 */
export function AnimatedCounter({
  targetValue = 50000,
  duration = 2000,
  suffix = " €",
  className,
}: AnimatedCounterProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  // Create stable store - only recreates if targetValue or duration changes
  const store = useMemo(
    () => createAnimationStore(targetValue, duration),
    [targetValue, duration]
  );

  // Subscribe to animation updates using useSyncExternalStore
  const animatedValue = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot
  );

  // Show target value immediately if reduced motion is preferred
  const valueToShow = prefersReducedMotion ? targetValue : animatedValue;
  const formattedValue = formatNumber(valueToShow);

  return (
    <span
      className={cn("font-mono tabular-nums tracking-tight", className)}
      style={{
        color: "var(--anchor-amount)",
        textShadow: "var(--anchor-glow)",
      }}
      aria-live="polite"
      aria-atomic="true"
      role="status"
    >
      {formattedValue}
      {suffix}
    </span>
  );
}

export default AnimatedCounter;
