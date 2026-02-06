"use client"

import { cn } from "@/lib/utils"

const DEFAULT_LABELS = [
  "Profil",
  "Projet",
  "Financement",
  "Location",
  "Sortie",
  "Structure",
]

interface ProgressBarProps {
  currentStep: number
  totalSteps?: number
  labels?: string[]
  className?: string
}

type StepState = "completed" | "current" | "upcoming"

function getStepState(stepIndex: number, currentStep: number): StepState {
  if (stepIndex + 1 < currentStep) return "completed"
  if (stepIndex + 1 === currentStep) return "current"
  return "upcoming"
}

export function ProgressBar({
  currentStep,
  totalSteps = 6,
  labels = DEFAULT_LABELS,
  className,
}: ProgressBarProps) {
  const steps = Array.from({ length: totalSteps }, (_, i) => i)

  return (
    <div className={cn("w-full", className)}>
      {/* Mobile: Simple step counter */}
      <div className="flex items-center justify-center gap-2 md:hidden">
        <span className="text-sm font-medium text-muted-foreground">
          Étape
        </span>
        <span className="text-sm font-bold text-step-current">
          {currentStep}
        </span>
        <span className="text-sm text-muted-foreground">/ {totalSteps}</span>
      </div>

      {/* Desktop: Full progress bar with dots and labels */}
      <div
        className="hidden md:flex items-center justify-between"
        role="progressbar"
        aria-valuenow={currentStep}
        aria-valuemin={1}
        aria-valuemax={totalSteps}
        aria-label={`Étape ${currentStep} sur ${totalSteps}: ${labels[currentStep - 1] ?? ""}`}
      >
        {steps.map((stepIndex) => {
          const state = getStepState(stepIndex, currentStep)
          const isLast = stepIndex === totalSteps - 1

          return (
            <div
              key={stepIndex}
              className={cn(
                "flex items-center",
                !isLast && "flex-1"
              )}
            >
              {/* Step dot and label */}
              <div className="flex flex-col items-center gap-1.5">
                <StepDot state={state} stepNumber={stepIndex + 1} />
                <span
                  className={cn(
                    "text-xs font-medium transition-colors duration-200",
                    state === "completed" && "text-step-completed",
                    state === "current" && "text-step-current",
                    state === "upcoming" && "text-muted-foreground"
                  )}
                >
                  {labels[stepIndex]}
                </span>
              </div>

              {/* Connector line */}
              {!isLast && (
                <div
                  className={cn(
                    "h-0.5 flex-1 mx-3 transition-colors duration-300",
                    stepIndex + 1 < currentStep
                      ? "bg-step-completed"
                      : "bg-border"
                  )}
                  aria-hidden="true"
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Mobile: Dots only row */}
      <div className="flex items-center justify-center gap-2 mt-3 md:hidden">
        {steps.map((stepIndex) => {
          const state = getStepState(stepIndex, currentStep)
          return (
            <StepDot
              key={stepIndex}
              state={state}
              stepNumber={stepIndex + 1}
              size="sm"
            />
          )
        })}
      </div>
    </div>
  )
}

interface StepDotProps {
  state: StepState
  stepNumber: number
  size?: "sm" | "md"
}

function StepDot({ state, stepNumber, size = "md" }: StepDotProps) {
  return (
    <div
      className={cn(
        "rounded-full border-2 transition-all duration-200 flex items-center justify-center",
        // Size
        size === "sm" && "w-2.5 h-2.5",
        size === "md" && "w-8 h-8",
        // States
        state === "completed" && [
          "bg-step-completed border-step-completed",
          size === "md" && "text-background",
        ],
        state === "current" && [
          "border-step-current bg-background",
          "shadow-[0_0_12px_var(--step-current)]",
          size === "md" && "text-step-current font-semibold",
        ],
        state === "upcoming" && [
          "bg-muted border-border",
          size === "md" && "text-muted-foreground",
        ]
      )}
      aria-hidden="true"
    >
      {size === "md" && (
        state === "completed" ? (
          <CheckIcon className="w-4 h-4" />
        ) : (
          <span className="text-sm">{stepNumber}</span>
        )
      )}
    </div>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={3}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 13l4 4L19 7"
      />
    </svg>
  )
}
