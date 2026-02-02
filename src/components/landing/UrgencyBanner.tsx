"use client";

import { CalendarClock } from "lucide-react";
import { cn } from "@/lib/utils";

interface UrgencyBannerProps {
  /** Display countdown to deadline (31/12/2027) */
  showCountdown?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * UrgencyBanner - Premium urgency banner for the 2027 bonus deadline
 * Displays the enhanced deduction offer (21,400/year) vs standard (10,700)
 */
export function UrgencyBanner({
  showCountdown = false,
  className,
}: UrgencyBannerProps) {
  // Calculate days remaining until 31/12/2027
  const calculateDaysRemaining = (): number => {
    const deadline = new Date("2027-12-31T23:59:59");
    const now = new Date();
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const daysRemaining = calculateDaysRemaining();

  return (
    <aside
      role="banner"
      aria-label="Offre limitee dans le temps"
      className={cn(
        // Base layout
        "flex flex-col items-center gap-2 py-3 px-4 rounded-lg",
        "sm:flex-row sm:justify-center sm:gap-4",
        // Background gradient (subtle gold)
        "bg-[linear-gradient(90deg,oklch(0.78_0.18_75/0.15),oklch(0.78_0.18_75/0.08))]",
        // Border
        "border border-primary/30",
        className
      )}
    >
      {/* Icon */}
      <div className="flex items-center gap-2 text-foreground">
        <CalendarClock
          className="h-5 w-5 text-primary shrink-0"
          aria-hidden="true"
        />
        {/* Main text */}
        <p className="text-sm sm:text-base font-medium">
          Offre bonifiee :{" "}
          <span
            className="font-bold tabular-nums"
            style={{ color: "var(--anchor-amount)" }}
          >
            21 400 EUR/an
          </span>{" "}
          deductibles jusqu&apos;au 31/12/2027
        </p>
      </div>

      {/* Subtext and optional countdown */}
      <div className="flex items-center gap-3 text-sm">
        <span className="text-muted-foreground">
          (vs 10 700 EUR standard apres cette date)
        </span>

        {showCountdown && daysRemaining > 0 && (
          <>
            <span className="hidden sm:inline text-muted-foreground/50">|</span>
            <span
              className="font-semibold tabular-nums"
              style={{ color: "var(--anchor-amount)" }}
              aria-live="polite"
            >
              {daysRemaining.toLocaleString("fr-FR")} jours restants
            </span>
          </>
        )}
      </div>

      {/* Optional CTA */}
      <a
        href="#simulateur"
        className={cn(
          "hidden lg:inline-flex items-center gap-1",
          "text-sm font-medium text-primary hover:text-primary/80",
          "transition-colors duration-200",
          "whitespace-nowrap"
        )}
      >
        Profitez-en avant la fin
        <span aria-hidden="true">&rarr;</span>
      </a>
    </aside>
  );
}
