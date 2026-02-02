# Formulaires Financement & Charges

Documentation des composants React Hook Form + Zod pour les étapes 3 et 4 du simulateur.

## FinancementForm (Étape 3)

Formulaire pour les informations de financement avec validation Zod et calcul temps réel de la mensualité.

### Import

```typescript
import { FinancementForm, type FinancementFormProps } from "@/components/simulateur/etape-3"
```

### Props

```typescript
interface FinancementFormProps {
  onDataChange: (data: WizardStep3) => void
  initialData?: Partial<WizardStep3>
  prixTotal: number
  className?: string
}
```

### Exemple d'utilisation

```typescript
"use client"

import { useState } from "react"
import { FinancementForm } from "@/components/simulateur/etape-3"
import type { WizardStep3 } from "@/contexts/SimulationContext"

export default function Etape3Page() {
  const [data, setData] = useState<Partial<WizardStep3>>({})
  const prixTotal = 250000 // Prix acquisition + travaux

  const handleDataChange = (formData: WizardStep3) => {
    setData(formData)
    console.log("Données financement:", formData)
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Financement</h1>
      <FinancementForm
        onDataChange={handleDataChange}
        initialData={data}
        prixTotal={prixTotal}
      />
    </div>
  )
}
```

### Fonctionnalités

- **Apport personnel**: Input number avec validation min 0
- **Durée crédit**: Slider 10-25 ans avec marqueurs (10, 15, 20, 25)
- **Taux crédit**: Input number 0.5-10% avec step 0.1
- **Différé**: Select 0/12/24 mois
- **Autres crédits**: Input optionnel
- **Calcul mensualité**: Affichage temps réel avec formule M = K * (t/12) / (1 - (1 + t/12)^(-n*12))

### Validation Zod

```typescript
z.object({
  apport: z.number().min(0),
  dureeCredit: z.number().min(10).max(25),
  tauxCredit: z.number().min(0.5).max(10),
  differe: z.enum(["0", "12", "24"]),
  autresCredits: z.number().min(0).optional(),
})
```

---

## ChargesForm (Étape 4)

Formulaire pour les charges locatives avec validation Zod et calcul du total.

### Import

```typescript
import { ChargesForm, type ChargesFormProps } from "@/components/simulateur/etape-4"
```

### Props

```typescript
interface ChargesFormProps {
  onChange: (data: Partial<WizardStep4>) => void
  initialData?: Partial<WizardStep4>
  className?: string
}
```

### Exemple d'utilisation

```typescript
"use client"

import { useState } from "react"
import { ChargesForm } from "@/components/simulateur/etape-4"
import type { WizardStep4 } from "@/contexts/SimulationContext"

export default function Etape4Page() {
  const [charges, setCharges] = useState<Partial<WizardStep4>>({})

  const handleChargesChange = (formData: Partial<WizardStep4>) => {
    setCharges(formData)
    console.log("Charges:", formData)
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Charges locatives</h1>
      <ChargesForm
        onChange={handleChargesChange}
        initialData={charges}
      />
    </div>
  )
}
```

### Fonctionnalités

- **Charges annuelles**: Input number avec placeholder "Ex: 1 200"
- **Taxe foncière**: Input number avec placeholder "Ex: 800"
- **Vacance locative**: Slider 0-12 mois avec marqueurs (0, 3, 6, 9, 12)
- **Total charges**: Affichage récapitulatif (annuel + mensuel)

### Validation Zod

```typescript
z.object({
  chargesAnnuelles: z.number().min(0),
  taxeFonciere: z.number().min(0),
  vacance: z.number().min(0).max(12),
})
```

---

## Style Dark Mode

Les deux composants utilisent les classes oklch pour le dark mode :

### Couleurs sémantiques

- **Accent doré**: `oklch(0.78_0.18_75)` (#F5A623)
- **Background cards**: `oklch(0.15_0.05_75)`
- **Borders dashed**: `oklch(0.78_0.18_75_/_0.5)`
- **Focus ring**: `ring-amber-500/50`

### Classes utilitaires

- `tabular-nums`: Pour aligner les chiffres
- `border-dashed border-2`: Bordures pointillées
- `animate-fade-in`: Animation d'apparition

---

## Pattern React Hook Form

Les deux composants suivent le pattern recommandé :

1. **Schema Zod** avec validation stricte
2. **useForm** avec `zodResolver` et `mode: "onBlur"`
3. **defaultValues** pour éviter les warnings "uncontrolled to controlled"
4. **useEffect + form.watch** pour sync avec le parent
5. **Affichage erreurs** avec `role="alert"` pour accessibilité

---

## Intégration avec SimulationContext

```typescript
import { useSimulation } from "@/lib/hooks/useSimulation"

// Dans la page
const { state, updateStep3, updateStep4 } = useSimulation()

// Étape 3
<FinancementForm
  onDataChange={updateStep3}
  initialData={state.step3}
  prixTotal={state.step2.prixAcquisition + (state.step2.montantTravaux ?? 0)}
/>

// Étape 4
<ChargesForm
  onChange={updateStep4}
  initialData={state.step4}
/>
```

---

## Tests

### Test de validation

```typescript
import { z } from "zod"

const financementSchema = z.object({
  apport: z.number().min(0),
  dureeCredit: z.number().min(10).max(25),
  tauxCredit: z.number().min(0.5).max(10),
})

// Test valide
expect(() => financementSchema.parse({
  apport: 50000,
  dureeCredit: 20,
  tauxCredit: 3.5,
})).not.toThrow()

// Test invalide
expect(() => financementSchema.parse({
  apport: -1000, // Erreur: min 0
  dureeCredit: 30, // Erreur: max 25
  tauxCredit: 0.2, // Erreur: min 0.5
})).toThrow()
```

### Test de calcul mensualité

```typescript
import { calculateMensualite } from "./utils" // À extraire

const capital = 200000
const taux = 3.5
const duree = 20

const mensualite = calculateMensualite(capital, taux, duree)

// Mensualité attendue: ~1158 EUR
expect(mensualite).toBeCloseTo(1158, 0)
```

---

## Améliorations futures

- [ ] Ajouter composant **DiffereSelector** (cards au lieu de select)
- [ ] Ajouter composant **NiveauLoyerCards** pour étape 4
- [ ] Extraire formule mensualité dans utils partagé
- [ ] Ajouter tests E2E avec Playwright
- [ ] Ajouter animation de transition pour les calculs

---

**Créé le:** 2026-02-02
**Auteur:** Claude Code
**Pattern:** React Hook Form + Zod + Shadcn UI
