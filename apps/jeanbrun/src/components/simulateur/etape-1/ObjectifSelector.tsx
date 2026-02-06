"use client"

import { useCallback, useRef } from "react"
import { Receipt, Wallet, Building2, CalendarClock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

export type ObjectifType = "reduire_impots" | "revenus" | "patrimoine" | "retraite"

interface ObjectifSelectorProps {
  value?: ObjectifType | undefined
  onChange: (value: ObjectifType) => void
  className?: string
}

interface ObjectifOption {
  id: ObjectifType
  label: string
  icon: LucideIcon
  description: string
}

const OBJECTIFS: ObjectifOption[] = [
  {
    id: "reduire_impots",
    label: "Reduire mes impots",
    icon: Receipt,
    description: "Optimiser ma fiscalite",
  },
  {
    id: "revenus",
    label: "Generer des revenus",
    icon: Wallet,
    description: "Revenus complementaires",
  },
  {
    id: "patrimoine",
    label: "Construire un patrimoine",
    icon: Building2,
    description: "Investir dans l'immobilier",
  },
  {
    id: "retraite",
    label: "Preparer ma retraite",
    icon: CalendarClock,
    description: "Anticiper l'avenir",
  },
]

export function ObjectifSelector({
  value,
  onChange,
  className,
}: ObjectifSelectorProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const currentIndex = OBJECTIFS.findIndex((o) => o.id === value)
      let nextIndex = currentIndex

      switch (e.key) {
        case "ArrowDown":
        case "ArrowRight":
          e.preventDefault()
          nextIndex = currentIndex < OBJECTIFS.length - 1 ? currentIndex + 1 : 0
          break
        case "ArrowUp":
        case "ArrowLeft":
          e.preventDefault()
          nextIndex = currentIndex > 0 ? currentIndex - 1 : OBJECTIFS.length - 1
          break
        case "Home":
          e.preventDefault()
          nextIndex = 0
          break
        case "End":
          e.preventDefault()
          nextIndex = OBJECTIFS.length - 1
          break
        default:
          return
      }

      const nextOption = OBJECTIFS[nextIndex]
      if (nextOption) {
        onChange(nextOption.id)
        // Focus the new button
        const buttons = containerRef.current?.querySelectorAll('[role="radio"]')
        const nextButton = buttons?.[nextIndex] as HTMLButtonElement | undefined
        nextButton?.focus()
      }
    },
    [value, onChange]
  )

  return (
    <div
      ref={containerRef}
      className={cn(
        "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-2",
        className
      )}
      role="radiogroup"
      aria-label="Selectionnez votre objectif principal"
      onKeyDown={handleKeyDown}
    >
      {OBJECTIFS.map((objectif, index) => {
        const Icon = objectif.icon
        const isSelected = value === objectif.id

        return (
          <button
            key={objectif.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            tabIndex={isSelected || (value === undefined && index === 0) ? 0 : -1}
            onClick={() => onChange(objectif.id)}
            className="text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg"
          >
            <Card
              className={cn(
                "cursor-pointer transition-all duration-200 ease-out",
                "hover:scale-[1.02] hover:border-accent/50",
                isSelected && [
                  "border-2 border-accent bg-accent/10",
                  "shadow-[0_0_20px_rgba(245,166,35,0.3)]",
                ],
                !isSelected && "border border-border hover:bg-accent/5"
              )}
            >
              <CardContent className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4">
                <div
                  className={cn(
                    "flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-lg transition-colors duration-200",
                    isSelected
                      ? "bg-accent/20 text-accent"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span
                    className={cn(
                      "font-medium transition-colors duration-200 text-sm sm:text-base",
                      isSelected ? "text-accent" : "text-foreground"
                    )}
                  >
                    {objectif.label}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {objectif.description}
                  </span>
                </div>
              </CardContent>
            </Card>
          </button>
        )
      })}
    </div>
  )
}
