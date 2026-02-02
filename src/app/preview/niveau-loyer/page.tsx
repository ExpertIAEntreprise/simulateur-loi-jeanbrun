"use client"

import { useState } from "react"
import { NiveauLoyerCards } from "@/components/simulateur/etape-4"
import type { WizardStep4 } from "@/contexts/SimulationContext"

type ZoneFiscale = "A_BIS" | "A" | "B1" | "B2" | "C"

export default function NiveauLoyerPreviewPage() {
  const [niveau, setNiveau] = useState<WizardStep4["niveauLoyer"]>("intermediaire")
  const [zoneFiscale, setZoneFiscale] = useState<ZoneFiscale>("B1")
  const [surface, setSurface] = useState<number>(50)

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Niveau Loyer Cards - Preview</h1>
          <p className="text-muted-foreground">
            Composant de selection du niveau de loyer Jeanbrun
          </p>
        </div>

        {/* Controls */}
        <div className="grid gap-4 md:grid-cols-3 p-6 bg-card border border-border rounded-lg">
          <div>
            <label className="text-sm font-medium">Zone Fiscale</label>
            <select
              value={zoneFiscale}
              onChange={(e) => setZoneFiscale(e.target.value as ZoneFiscale)}
              className="mt-1 w-full h-10 px-3 rounded-md border border-input bg-background"
            >
              <option value="A_BIS">A bis (Paris)</option>
              <option value="A">A (Grandes villes)</option>
              <option value="B1">B1 (Villes moyennes)</option>
              <option value="B2">B2 (Petites villes)</option>
              <option value="C">C (Rural)</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Surface (m2)</label>
            <input
              type="number"
              value={surface}
              onChange={(e) => setSurface(Number(e.target.value))}
              className="mt-1 w-full h-10 px-3 rounded-md border border-input bg-background"
              min="9"
              max="200"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Niveau Selectionne</label>
            <div className="mt-1 h-10 flex items-center px-3 rounded-md border border-input bg-muted/50 text-sm">
              {niveau}
            </div>
          </div>
        </div>

        {/* Component */}
        <div className="p-6 bg-card border border-border rounded-lg">
          <NiveauLoyerCards
            value={niveau}
            onChange={setNiveau}
            zoneFiscale={zoneFiscale}
            surface={surface}
          />
        </div>

        {/* JSON Output */}
        <div className="p-6 bg-card border border-border rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Etat Actuel</h2>
          <pre className="text-sm bg-muted p-4 rounded-md overflow-auto">
            {JSON.stringify(
              {
                niveau,
                zoneFiscale,
                surface,
              },
              null,
              2
            )}
          </pre>
        </div>
      </div>
    </div>
  )
}
