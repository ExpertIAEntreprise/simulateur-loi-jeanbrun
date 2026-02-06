"use client"

import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface StepNavigationProps {
  onBack?: (() => void) | undefined
  onNext: () => void
  canGoBack?: boolean | undefined
  canGoNext?: boolean | undefined
  isLastStep?: boolean | undefined
  isSubmitting?: boolean | undefined
  className?: string | undefined
}

export function StepNavigation({
  onBack,
  onNext,
  canGoBack = true,
  canGoNext = true,
  isLastStep = false,
  isSubmitting = false,
  className,
}: StepNavigationProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-2 sm:gap-4",
        className
      )}
    >
      {/* Back button */}
      {canGoBack && onBack ? (
        <Button
          type="button"
          variant="ghost"
          onClick={onBack}
          disabled={isSubmitting}
          className="gap-1 sm:gap-2 px-2 sm:px-4"
          size="sm"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Retour</span>
        </Button>
      ) : (
        <div />
      )}

      {/* Next / Submit button */}
      <Button
        type="button"
        onClick={onNext}
        disabled={!canGoNext || isSubmitting}
        size="sm"
        className={cn(
          "gap-1 sm:gap-2 flex-1 sm:flex-initial sm:min-w-[140px] md:min-w-[160px]",
          canGoNext &&
            !isSubmitting && [
              "shadow-[0_0_20px_var(--step-current,oklch(0.78_0.18_75))/0.3]",
              "hover:shadow-[0_0_30px_var(--step-current,oklch(0.78_0.18_75))/0.5]",
              "transition-shadow duration-300",
            ]
        )}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm sm:text-base">Calcul en cours...</span>
          </>
        ) : isLastStep ? (
          <>
            <span className="text-sm sm:text-base">Voir les résultats</span>
            <ChevronRight className="h-4 w-4" />
          </>
        ) : (
          <>
            <span className="text-sm sm:text-base">Continuer</span>
            <ChevronRight className="h-4 w-4" />
          </>
        )}
      </Button>
    </div>
  )
}
