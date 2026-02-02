"use client"

import { useCallback, useRef } from "react"
import { Building2, Home, Info } from "lucide-react"
import { cn } from "@/lib/utils"

export interface TypeBienSelectorProps {
  value?: "neuf" | "ancien" | undefined
  onChange: (value: "neuf" | "ancien") => void
  className?: string | undefined
}

interface TypeBienOption {
  id: "neuf" | "ancien"
  title: string
  description: string
  icon: typeof Building2
  infoText?: string | undefined
}

const options: readonly TypeBienOption[] = [
  {
    id: "neuf",
    title: "Bien neuf (VEFA)",
    description: "Logement neuf ou en construction - Frais de notaire reduits (2,5%)",
    icon: Building2,
  },
  {
    id: "ancien",
    title: "Bien ancien a renover",
    description: "Travaux minimum 30% du prix - Eligible si DPE final A ou B",
    icon: Home,
    infoText: "Les travaux doivent representer au moins 30% du prix d'acquisition pour etre eligible a la loi Jeanbrun.",
  },
] as const

export function TypeBienSelector({
  value,
  onChange,
  className,
}: TypeBienSelectorProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const currentIndex = options.findIndex((o) => o.id === value)
      let nextIndex = currentIndex

      switch (e.key) {
        case "ArrowDown":
        case "ArrowRight":
          e.preventDefault()
          nextIndex = currentIndex < options.length - 1 ? currentIndex + 1 : 0
          break
        case "ArrowUp":
        case "ArrowLeft":
          e.preventDefault()
          nextIndex = currentIndex > 0 ? currentIndex - 1 : options.length - 1
          break
        case "Home":
          e.preventDefault()
          nextIndex = 0
          break
        case "End":
          e.preventDefault()
          nextIndex = options.length - 1
          break
        default:
          return
      }

      const nextOption = options[nextIndex]
      if (nextOption) {
        onChange(nextOption.id)
        const buttons = containerRef.current?.querySelectorAll('[role="radio"]')
        const nextButton = buttons?.[nextIndex] as HTMLButtonElement | undefined
        nextButton?.focus()
      }
    },
    [value, onChange]
  )

  return (
    <div
      className={cn("space-y-4", className)}
      role="radiogroup"
      aria-label="Type de bien immobilier"
      onKeyDown={handleKeyDown}
    >
      <div ref={containerRef} className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2">
        {options.map((option, index) => {
          const isSelected = value === option.id
          const Icon = option.icon

          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              tabIndex={isSelected || (value === undefined && index === 0) ? 0 : -1}
              onClick={() => onChange(option.id)}
              className={cn(
                // Base styles
                "relative flex flex-col items-center gap-3 sm:gap-4 p-4 sm:p-6",
                "min-h-[160px] sm:min-h-[180px] rounded-lg border-2 text-left",
                "transition-all duration-300 ease-out",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                // Default state
                "border-border bg-card hover:border-accent/50 hover:scale-[1.02]",
                // Selected state
                isSelected && [
                  "border-accent bg-accent/5",
                  "shadow-glow",
                ]
              )}
            >
              {/* Radio indicator */}
              <div
                className={cn(
                  "absolute top-4 right-4 h-5 w-5 rounded-full border-2",
                  "flex items-center justify-center",
                  "transition-all duration-200",
                  isSelected
                    ? "border-accent bg-accent"
                    : "border-muted-foreground/40 bg-transparent"
                )}
              >
                {isSelected && (
                  <div className="h-2 w-2 rounded-full bg-accent-foreground" />
                )}
              </div>

              {/* Icon */}
              <div
                className={cn(
                  "flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full",
                  "transition-colors duration-200",
                  isSelected
                    ? "bg-accent/20"
                    : "bg-muted"
                )}
              >
                <Icon
                  className={cn(
                    "h-6 w-6 sm:h-7 sm:w-7 transition-colors duration-200",
                    isSelected ? "text-accent" : "text-muted-foreground"
                  )}
                />
              </div>

              {/* Content */}
              <div className="flex flex-col items-center gap-2 text-center">
                <h3
                  className={cn(
                    "text-base sm:text-lg font-semibold transition-colors duration-200",
                    isSelected ? "text-accent" : "text-foreground"
                  )}
                >
                  {option.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {option.description}
                </p>
              </div>
            </button>
          )
        })}
      </div>

      {/* Conditional info for "ancien" selection */}
      {value === "ancien" && (
        <div
          className={cn(
            "flex items-start gap-3 p-4 rounded-lg",
            "bg-info-subtle border border-info/30",
            "animate-fade-in"
          )}
          role="alert"
        >
          <Info className="h-5 w-5 text-info shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-info-foreground">
              Travaux obligatoires
            </p>
            <p className="text-sm text-muted-foreground">
              Les travaux doivent representer au moins 30% du prix d'acquisition
              pour etre eligible a la loi Jeanbrun. Le logement doit atteindre
              une classe DPE A ou B apres renovation.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
