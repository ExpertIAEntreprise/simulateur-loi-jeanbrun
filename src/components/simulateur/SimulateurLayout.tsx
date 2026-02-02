"use client"

import Link from "next/link"
import { Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ProgressBar } from "./ProgressBar"
import { StepNavigation } from "./StepNavigation"

interface SimulateurLayoutProps {
  children: React.ReactNode
  currentStep: number
  totalSteps?: number
  onBack?: () => void
  onNext: () => void
  canGoBack?: boolean
  canGoNext?: boolean
  isLastStep?: boolean
  isSubmitting?: boolean
  className?: string
}

export function SimulateurLayout({
  children,
  currentStep,
  totalSteps = 6,
  onBack,
  onNext,
  canGoBack = true,
  canGoNext = true,
  isLastStep = false,
  isSubmitting = false,
  className,
}: SimulateurLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header - Sticky */}
      <header
        className={cn(
          "sticky top-0 z-50",
          "bg-background/95 backdrop-blur-sm",
          "border-b border-border",
          "supports-[backdrop-filter]:bg-background/80"
        )}
      >
        <div className="container max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Logo / Home link */}
            <Link
              href="/"
              className="flex items-center gap-2 text-foreground hover:text-foreground/80 transition-colors"
            >
              <span className="font-display font-semibold text-lg">
                Jeanbrun
              </span>
            </Link>

            {/* Progress bar - desktop */}
            <div className="hidden sm:flex flex-1 max-w-md mx-4">
              <ProgressBar
                currentStep={currentStep}
                totalSteps={totalSteps}
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="hidden sm:flex gap-1.5 text-muted-foreground"
                title="Votre progression est sauvegardée automatiquement"
              >
                <Save className="h-4 w-4" />
                <span className="text-xs">Sauvegardé</span>
              </Button>
            </div>
          </div>

          {/* Progress bar - mobile */}
          <div className="sm:hidden mt-3">
            <ProgressBar
              currentStep={currentStep}
              totalSteps={totalSteps}
            />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main
        className={cn(
          "flex-1 overflow-y-auto",
          "py-6 sm:py-8 md:py-12",
          "px-4",
          className
        )}
      >
        <div className="container max-w-2xl mx-auto">
          {children}
        </div>
      </main>

      {/* Footer - Sticky navigation */}
      <footer
        className={cn(
          "sticky bottom-0 z-50",
          "bg-background/95 backdrop-blur-sm",
          "border-t border-border",
          "supports-[backdrop-filter]:bg-background/80"
        )}
      >
        <div className="container max-w-2xl mx-auto px-4 py-4">
          <StepNavigation
            onBack={canGoBack ? onBack : undefined}
            onNext={onNext}
            canGoBack={canGoBack && currentStep > 1}
            canGoNext={canGoNext}
            isLastStep={isLastStep}
            isSubmitting={isSubmitting}
          />
        </div>
      </footer>
    </div>
  )
}
