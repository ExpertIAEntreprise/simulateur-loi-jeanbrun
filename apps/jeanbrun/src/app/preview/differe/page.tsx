"use client"

import { useState } from "react"
import { DiffereSelector } from "@/components/simulateur/etape-3"

export default function DifferePreviewPage() {
  const [differe, setDiffere] = useState<0 | 12 | 24>(0)
  const [typeBien, setTypeBien] = useState<"neuf" | "ancien">("neuf")

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Différé Selector - Preview</h1>
          <p className="text-muted-foreground">
            Composant de sélection du différé de remboursement
          </p>
        </div>

        {/* Controls */}
        <div className="grid gap-4 md:grid-cols-2 p-6 bg-card border border-border rounded-lg">
          <div>
            <label className="text-sm font-medium">Type de Bien</label>
            <select
              value={typeBien}
              onChange={(e) => setTypeBien(e.target.value as typeof typeBien)}
              className="mt-1 w-full h-10 px-3 rounded-md border border-input bg-background"
            >
              <option value="neuf">Neuf (VEFA)</option>
              <option value="ancien">Ancien à rénover</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Différé Sélectionné</label>
            <div className="mt-1 h-10 flex items-center px-3 rounded-md border border-input bg-muted/50 text-sm">
              {differe} mois
            </div>
          </div>
        </div>

        {/* Component */}
        <div className="p-6 bg-card border border-border rounded-lg">
          <DiffereSelector
            value={differe}
            onChange={setDiffere}
            typeBien={typeBien}
          />
        </div>

        {/* JSON Output */}
        <div className="p-6 bg-card border border-border rounded-lg">
          <h2 className="text-lg font-semibold mb-4">État Actuel</h2>
          <pre className="text-sm bg-muted p-4 rounded-md overflow-auto">
            {JSON.stringify(
              {
                differe,
                typeBien,
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
