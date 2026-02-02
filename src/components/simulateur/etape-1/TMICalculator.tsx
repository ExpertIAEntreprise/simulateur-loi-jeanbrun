"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { HelpCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { PARAMETRES_JEANBRUN } from "@/types/simulation"

interface TMICalculatorProps {
  revenuNet: number
  parts: number
  onTMIChange?: (tmi: number) => void
  className?: string
}

type TMITranche = 0 | 11 | 30 | 41 | 45

interface TMIStyle {
  bg: string
  text: string
  border: string
  glow: string
}

const TMI_STYLES: Record<TMITranche, TMIStyle> = {
  0: {
    bg: "bg-gray-500/20",
    text: "text-gray-400",
    border: "border-gray-500/50",
    glow: "",
  },
  11: {
    bg: "bg-emerald-500/20",
    text: "text-emerald-400",
    border: "border-emerald-500/50",
    glow: "shadow-[0_0_12px_oklch(0.72_0.20_145_/_0.4)]",
  },
  30: {
    bg: "bg-amber-500/20",
    text: "text-amber-400",
    border: "border-amber-500/50",
    glow: "shadow-[0_0_12px_oklch(0.78_0.18_75_/_0.4)]",
  },
  41: {
    bg: "bg-orange-500/20",
    text: "text-orange-400",
    border: "border-orange-500/50",
    glow: "shadow-[0_0_12px_oklch(0.70_0.20_45_/_0.4)]",
  },
  45: {
    bg: "bg-red-500/20",
    text: "text-red-400",
    border: "border-red-500/50",
    glow: "shadow-[0_0_12px_oklch(0.63_0.24_25_/_0.4)]",
  },
}

const TMI_DESCRIPTIONS: Record<TMITranche, string> = {
  0: "Non imposable",
  11: "Tranche intermédiaire basse",
  30: "Tranche intermédiaire haute",
  41: "Tranche haute",
  45: "Tranche marginale maximale",
}

/**
 * Calcule la Tranche Marginale d'Imposition (TMI) selon le barème IR 2026
 */
function calculerTMI(revenuNet: number, parts: number): TMITranche {
  if (revenuNet <= 0 || parts <= 0) return 0

  const quotient = revenuNet / parts

  for (const tranche of PARAMETRES_JEANBRUN.baremeIR2026) {
    if (quotient <= tranche.limite) {
      return tranche.taux as TMITranche
    }
  }

  return 45
}

/**
 * Formate le barème IR 2026 pour l'affichage dans le tooltip
 */
function formatBaremeTooltip(): string {
  const bareme = PARAMETRES_JEANBRUN.baremeIR2026
  const lines: string[] = []

  for (let i = 0; i < bareme.length; i++) {
    const tranche = bareme[i]
    const limiteInf = i === 0 ? 0 : (bareme[i - 1]?.limite ?? 0) + 1
    const limiteSup = tranche?.limite ?? 0

    if (limiteSup === Infinity) {
      lines.push(`Au-dela de ${limiteInf.toLocaleString("fr-FR")} euros : ${tranche?.taux ?? 0}%`)
    } else {
      lines.push(
        `De ${limiteInf.toLocaleString("fr-FR")} a ${limiteSup.toLocaleString("fr-FR")} euros : ${tranche?.taux ?? 0}%`
      )
    }
  }

  return lines.join("\n")
}

export function TMICalculator({
  revenuNet,
  parts,
  onTMIChange,
  className,
}: TMICalculatorProps) {
  const [showTooltip, setShowTooltip] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const isFirstRender = useRef(true)
  const prevTmi = useRef<TMITranche | null>(null)

  const tmi = useMemo(() => calculerTMI(revenuNet, parts), [revenuNet, parts])
  const quotient = useMemo(
    () => (parts > 0 ? Math.round(revenuNet / parts) : 0),
    [revenuNet, parts]
  )

  const style = TMI_STYLES[tmi]
  const description = TMI_DESCRIPTIONS[tmi]

  // Notify parent of TMI change
  useEffect(() => {
    onTMIChange?.(tmi)
  }, [tmi, onTMIChange])

  // Trigger animation on TMI change (skip first render)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      prevTmi.current = tmi
      return undefined
    }

    // Only animate if TMI actually changed
    if (prevTmi.current !== tmi) {
      prevTmi.current = tmi
      setIsAnimating(true)
      const timer = setTimeout(() => setIsAnimating(false), 300)
      return () => clearTimeout(timer)
    }

    return undefined
  }, [tmi])

  return (
    <Card className={cn("relative", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-medium">
          <span>Votre TMI</span>
          <div className="relative">
            <button
              type="button"
              className="text-muted-foreground hover:text-foreground transition-colors"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              onFocus={() => setShowTooltip(true)}
              onBlur={() => setShowTooltip(false)}
              aria-label="Informations sur le bareme IR 2026"
            >
              <HelpCircle className="h-4 w-4" />
            </button>

            {/* Tooltip */}
            {showTooltip && (
              <div
                className="absolute z-50 left-1/2 -translate-x-1/2 bottom-full mb-2 w-72 p-3 rounded-lg bg-popover border border-border shadow-lg text-sm"
                role="tooltip"
              >
                <p className="font-medium mb-2">Bareme IR 2026 (par part)</p>
                <div className="space-y-1 text-xs text-muted-foreground whitespace-pre-line">
                  {formatBaremeTooltip()}
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-border" />
              </div>
            )}
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex flex-col items-center gap-3">
          {/* TMI Badge */}
          <Badge
            className={cn(
              "text-2xl font-bold px-6 py-2 transition-all duration-300",
              style.bg,
              style.text,
              style.border,
              style.glow,
              isAnimating && "scale-110"
            )}
          >
            {tmi}%
          </Badge>

          {/* Description */}
          <p className="text-sm text-muted-foreground text-center">
            {description}
          </p>

          {/* Quotient familial */}
          {quotient > 0 && (
            <p className="text-xs text-muted-foreground/70 text-center">
              Quotient familial : {quotient.toLocaleString("fr-FR")} euros/part
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
