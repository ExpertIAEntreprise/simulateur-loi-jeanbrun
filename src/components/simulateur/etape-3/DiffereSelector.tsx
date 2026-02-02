"use client"

import { Clock, Info } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

export interface DiffereSelectorProps {
  value?: 0 | 12 | 24 | undefined
  onChange: (value: 0 | 12 | 24) => void
  typeBien?: "neuf" | "ancien" | undefined
  className?: string | undefined
}

interface DiffereOption {
  value: 0 | 12 | 24
  label: string
}

const DIFFERE_OPTIONS: readonly DiffereOption[] = [
  { value: 0, label: "Sans différé" },
  { value: 12, label: "12 mois (VEFA standard)" },
  { value: 24, label: "24 mois (grosse construction)" },
] as const

export function DiffereSelector({
  value = 0,
  onChange,
  typeBien,
  className,
}: DiffereSelectorProps) {
  const handleValueChange = (stringValue: string) => {
    const numValue = parseInt(stringValue, 10)
    if (numValue === 0 || numValue === 12 || numValue === 24) {
      onChange(numValue)
    }
  }

  const getContextualInfo = () => {
    if (!typeBien) return null

    if (typeBien === "neuf") {
      return "Le différé permet de ne pas payer le crédit pendant la construction"
    }

    return "Pour les travaux importants, un différé peut être négocié"
  }

  const contextInfo = getContextualInfo()

  return (
    <div className={cn("space-y-4", className)}>
      {/* Label */}
      <div className="flex items-center gap-2">
        <Clock className="h-5 w-5 text-muted-foreground" />
        <label
          htmlFor="differe-select"
          className="text-sm font-medium text-foreground"
        >
          Différé de remboursement
        </label>
      </div>

      {/* Select */}
      <Select
        value={value.toString()}
        onValueChange={handleValueChange}
      >
        <SelectTrigger
          id="differe-select"
          className={cn(
            "h-12 text-base transition-colors duration-200",
            "border-2 focus:border-accent focus:ring-accent/20"
          )}
        >
          <SelectValue placeholder="Sélectionnez un différé" />
        </SelectTrigger>
        <SelectContent>
          {DIFFERE_OPTIONS.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value.toString()}
              className="cursor-pointer text-base"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Contextual Info */}
      {contextInfo && (
        <div
          className={cn(
            "flex items-start gap-3 p-4 rounded-lg",
            "bg-info-subtle border border-info/30",
            "animate-fade-in"
          )}
          role="alert"
        >
          <Info className="h-5 w-5 text-info shrink-0 mt-0.5" />
          <p className="text-sm text-muted-foreground leading-relaxed">
            {contextInfo}
          </p>
        </div>
      )}

      {/* Tooltip explanation */}
      <div className="flex items-start gap-2 text-xs text-muted-foreground">
        <div className="flex h-4 w-4 items-center justify-center rounded-full border border-muted-foreground/40 shrink-0 mt-0.5">
          <span className="text-[10px] font-medium">?</span>
        </div>
        <p>
          Le différé de remboursement vous permet de ne payer que les intérêts
          pendant la période de construction ou de travaux. Le remboursement du
          capital commence après cette période.
        </p>
      </div>
    </div>
  )
}
