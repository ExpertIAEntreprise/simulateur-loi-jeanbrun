# Phase 3 - Interface Simulateur

**Sprint:** 3
**Semaines:** S5-S6 (03-14 Mars 2026)
**Effort estimé:** 18,5 jours
**Objectif:** Simulateur 6 étapes complet et responsive

---

## 1. Objectifs du sprint

### 1.1 Livrables attendus

| Livrable | Description | Critère de validation |
|----------|-------------|----------------------|
| Layout simulateur | Structure avec progress bar | Navigation fluide |
| Étape 1: Profil | Formulaire investisseur | TMI auto-calculé |
| Étape 2: Projet | Sélection bien | Seuil travaux validé |
| Étape 3: Financement | Configuration crédit | Jauge endettement |
| Étape 4: Location | Stratégie locative | Visualisation gain/perte |
| Étape 5: Sortie | Durée et hypothèses | Slider interactif |
| Étape 6: Structure | Choix juridique | Comparatif affiché |
| Page résultats | Synthèse + graphiques | Sections premium masquées |
| Mobile responsive | Design mobile first | Utilisable sur 375px |

### 1.2 Dépendances

- Sprint 2 terminé (moteur de calcul OK)
- Composants shadcn/ui disponibles
- Données villes EspoCRM accessibles

---

## 2. Architecture des composants

### 2.1 Structure des fichiers

```
src/
├── app/
│   └── simulateur/
│       ├── page.tsx                    # Simulateur rapide
│       ├── layout.tsx                  # Layout partagé
│       ├── avance/
│       │   ├── page.tsx               # Étape 1
│       │   ├── etape-2/page.tsx
│       │   ├── etape-3/page.tsx
│       │   ├── etape-4/page.tsx
│       │   ├── etape-5/page.tsx
│       │   └── etape-6/page.tsx
│       └── resultat/
│           └── [id]/page.tsx          # Page résultats
├── components/
│   └── simulateur/
│       ├── SimulateurLayout.tsx
│       ├── StepNavigation.tsx
│       ├── ProgressBar.tsx
│       ├── etape-1/
│       │   ├── ProfilForm.tsx
│       │   ├── TMICalculator.tsx
│       │   ├── ObjectifSelector.tsx
│       │   └── index.ts
│       ├── etape-2/
│       │   ├── TypeBienSelector.tsx
│       │   ├── VilleAutocomplete.tsx
│       │   ├── TravauxValidator.tsx
│       │   ├── RecapProjet.tsx
│       │   └── index.ts
│       ├── etape-3/
│       │   ├── FinancementForm.tsx
│       │   ├── DiffereSelector.tsx
│       │   ├── JaugeEndettement.tsx
│       │   └── index.ts
│       ├── etape-4/
│       │   ├── NiveauLoyerCards.tsx
│       │   ├── PerteGainVisualisation.tsx
│       │   ├── ChargesForm.tsx
│       │   └── index.ts
│       ├── etape-5/
│       │   ├── DureeSlider.tsx
│       │   ├── RevalorisationInput.tsx
│       │   ├── StrategieSortie.tsx
│       │   └── index.ts
│       ├── etape-6/
│       │   ├── StructureCards.tsx
│       │   ├── ComparatifTable.tsx
│       │   └── index.ts
│       └── resultats/
│           ├── SyntheseCard.tsx
│           ├── GraphiquePatrimoine.tsx
│           ├── TableauAnnuel.tsx
│           ├── ComparatifLMNP.tsx
│           ├── ExportPDF.tsx
│           └── index.ts
└── lib/
    └── hooks/
        ├── useSimulation.ts
        ├── useLocalStorage.ts
        └── useVilleAutocomplete.ts
```

---

## 3. Tâches détaillées

### 3.1 Layout simulateur + progress bar (1j)

**ID:** 3.1

**Fichier:** `src/components/simulateur/SimulateurLayout.tsx`

```tsx
'use client'

import { PropsWithChildren } from 'react'
import { ProgressBar } from './ProgressBar'
import { StepNavigation } from './StepNavigation'

interface SimulateurLayoutProps extends PropsWithChildren {
  currentStep: number
  totalSteps?: number
  onBack?: () => void
  onNext?: () => void
  canProceed?: boolean
}

export function SimulateurLayout({
  children,
  currentStep,
  totalSteps = 6,
  onBack,
  onNext,
  canProceed = true,
}: SimulateurLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header avec progress */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <ProgressBar current={currentStep} total={totalSteps} />
        </div>
      </header>

      {/* Contenu principal */}
      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-2xl">
          {children}
        </div>
      </main>

      {/* Navigation bas de page */}
      <footer className="sticky bottom-0 border-t bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <StepNavigation
            currentStep={currentStep}
            totalSteps={totalSteps}
            onBack={onBack}
            onNext={onNext}
            canProceed={canProceed}
          />
        </div>
      </footer>
    </div>
  )
}
```

**Fichier:** `src/components/simulateur/ProgressBar.tsx`

```tsx
interface ProgressBarProps {
  current: number
  total: number
}

const STEP_LABELS = [
  'Profil',
  'Projet',
  'Financement',
  'Location',
  'Sortie',
  'Structure',
]

export function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = (current / total) * 100

  return (
    <div className="space-y-2">
      {/* Labels des étapes */}
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>Étape {current}/{total}</span>
        <span>{STEP_LABELS[current - 1]}</span>
      </div>

      {/* Barre de progression */}
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Points d'étape */}
      <div className="flex justify-between">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`h-3 w-3 rounded-full border-2 transition-colors ${
              i < current
                ? 'border-primary bg-primary'
                : i === current - 1
                  ? 'border-primary bg-background'
                  : 'border-muted bg-muted'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
```

**Fichier:** `src/components/simulateur/StepNavigation.tsx`

```tsx
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight } from 'lucide-react'

interface StepNavigationProps {
  currentStep: number
  totalSteps: number
  onBack?: () => void
  onNext?: () => void
  canProceed?: boolean
}

export function StepNavigation({
  currentStep,
  totalSteps,
  onBack,
  onNext,
  canProceed = true,
}: StepNavigationProps) {
  const isFirstStep = currentStep === 1
  const isLastStep = currentStep === totalSteps

  return (
    <div className="flex items-center justify-between">
      <Button
        variant="outline"
        onClick={onBack}
        disabled={isFirstStep}
        className="gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour
      </Button>

      <Button
        onClick={onNext}
        disabled={!canProceed}
        className="gap-2"
      >
        {isLastStep ? 'Voir mes résultats' : 'Continuer'}
        {!isLastStep && <ArrowRight className="h-4 w-4" />}
      </Button>
    </div>
  )
}
```

---

### 3.2 Étape 1: Profil investisseur (2j)

**ID:** 3.2

**Fichier:** `src/components/simulateur/etape-1/ProfilForm.tsx`

```tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { TMICalculator } from './TMICalculator'
import { ObjectifSelector } from './ObjectifSelector'

const profilSchema = z.object({
  situationFamiliale: z.enum(['celibataire', 'couple']),
  nombreEnfants: z.number().min(0).max(10),
  revenuNetImposable: z.number().min(0),
  objectif: z.enum(['reduire_impots', 'revenus', 'patrimoine', 'retraite']),
})

type ProfilFormData = z.infer<typeof profilSchema>

interface ProfilFormProps {
  defaultValues?: Partial<ProfilFormData>
  onSubmit: (data: ProfilFormData) => void
}

export function ProfilForm({ defaultValues, onSubmit }: ProfilFormProps) {
  const form = useForm<ProfilFormData>({
    resolver: zodResolver(profilSchema),
    defaultValues: {
      situationFamiliale: 'celibataire',
      nombreEnfants: 0,
      revenuNetImposable: 0,
      objectif: 'reduire_impots',
      ...defaultValues,
    },
  })

  const situationFamiliale = form.watch('situationFamiliale')
  const nombreEnfants = form.watch('nombreEnfants')
  const revenuNetImposable = form.watch('revenuNetImposable')

  // Calcul des parts fiscales
  const partsFiscales = calculerPartsFiscales(situationFamiliale, nombreEnfants)

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Votre profil investisseur</h2>
          <p className="text-muted-foreground">
            Ces informations nous permettent de calculer votre économie d'impôt personnalisée.
          </p>
        </div>

        {/* Situation familiale */}
        <FormField
          control={form.control}
          name="situationFamiliale"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Situation familiale</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="celibataire" id="celibataire" />
                    <label htmlFor="celibataire">Célibataire</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="couple" id="couple" />
                    <label htmlFor="couple">Marié(e) / Pacsé(e)</label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Nombre d'enfants */}
        <FormField
          control={form.control}
          name="nombreEnfants"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre d'enfants à charge</FormLabel>
              <Select
                onValueChange={(v) => field.onChange(parseInt(v))}
                defaultValue={String(field.value)}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {[0, 1, 2, 3, 4, 5].map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n === 0 ? 'Aucun' : `${n} enfant${n > 1 ? 's' : ''}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Parts fiscales: {partsFiscales}
              </p>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Revenus */}
        <FormField
          control={form.control}
          name="revenuNetImposable"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Revenu net imposable annuel (foyer)</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="50000"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    className="pr-8"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    €
                  </span>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* TMI auto-calculé */}
        <TMICalculator
          revenuNetImposable={revenuNetImposable}
          partsFiscales={partsFiscales}
        />

        {/* Objectif */}
        <FormField
          control={form.control}
          name="objectif"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Objectif principal</FormLabel>
              <FormControl>
                <ObjectifSelector
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}

function calculerPartsFiscales(
  situation: 'celibataire' | 'couple',
  enfants: number
): number {
  const base = situation === 'couple' ? 2 : 1
  const partsEnfants = enfants <= 2 ? enfants * 0.5 : 1 + (enfants - 2)
  return base + partsEnfants
}
```

**Fichier:** `src/components/simulateur/etape-1/TMICalculator.tsx`

```tsx
import { useMemo } from 'react'
import { determinerTMI } from '@/lib/calculs/tmi'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Info } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

interface TMICalculatorProps {
  revenuNetImposable: number
  partsFiscales: number
}

export function TMICalculator({
  revenuNetImposable,
  partsFiscales,
}: TMICalculatorProps) {
  const tmiResult = useMemo(() => {
    if (revenuNetImposable <= 0) return null
    return determinerTMI(revenuNetImposable, partsFiscales)
  }, [revenuNetImposable, partsFiscales])

  if (!tmiResult) {
    return (
      <Card className="p-4 bg-muted/50">
        <p className="text-sm text-muted-foreground">
          Renseignez vos revenus pour voir votre TMI
        </p>
      </Card>
    )
  }

  const tmiPercent = tmiResult.tmi * 100

  return (
    <Card className="p-4 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">
            Votre Tranche Marginale d'Imposition
          </span>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">
                La TMI est le taux d'imposition appliqué à la dernière tranche
                de vos revenus. C'est ce taux qui détermine votre économie d'impôt.
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
        <Badge variant={tmiPercent >= 30 ? 'destructive' : 'secondary'}>
          {tmiPercent}%
        </Badge>
      </div>
      <p className="text-sm text-muted-foreground">
        Économie potentielle: {tmiPercent}% de l'amortissement Jeanbrun
      </p>
    </Card>
  )
}
```

---

### 3.3 Étape 2: Projet immobilier (2,5j)

**ID:** 3.3

**Fichier:** `src/components/simulateur/etape-2/TypeBienSelector.tsx`

```tsx
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Building2, Home } from 'lucide-react'

interface TypeBienSelectorProps {
  value: 'neuf' | 'ancien' | null
  onChange: (value: 'neuf' | 'ancien') => void
}

export function TypeBienSelector({ value, onChange }: TypeBienSelectorProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card
        className={`cursor-pointer p-6 transition-all hover:border-primary ${
          value === 'neuf' ? 'border-2 border-primary bg-primary/5' : ''
        }`}
        onClick={() => onChange('neuf')}
      >
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="rounded-full bg-primary/10 p-4">
            <Building2 className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Logement Neuf</h3>
            <p className="text-sm text-muted-foreground">
              VEFA ou achevé depuis moins de 5 ans
            </p>
          </div>
          <Badge variant="outline">
            Jusqu'à 12 000€/an de déduction
          </Badge>
        </div>
      </Card>

      <Card
        className={`cursor-pointer p-6 transition-all hover:border-primary ${
          value === 'ancien' ? 'border-2 border-primary bg-primary/5' : ''
        }`}
        onClick={() => onChange('ancien')}
      >
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="rounded-full bg-secondary/10 p-4">
            <Home className="h-8 w-8 text-secondary" />
          </div>
          <div>
            <h3 className="font-semibold">Logement Ancien</h3>
            <p className="text-sm text-muted-foreground">
              Avec travaux de rénovation énergétique
            </p>
          </div>
          <Badge variant="outline">
            Travaux ≥ 30% du prix d'achat
          </Badge>
        </div>
      </Card>
    </div>
  )
}
```

**Fichier:** `src/components/simulateur/etape-2/TravauxValidator.tsx`

```tsx
import { useMemo } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { CheckCircle2, AlertTriangle } from 'lucide-react'
import { formatEuros } from '@/lib/utils/format'

interface TravauxValidatorProps {
  prixAcquisition: number
  montantTravaux: number
}

export function TravauxValidator({
  prixAcquisition,
  montantTravaux,
}: TravauxValidatorProps) {
  const validation = useMemo(() => {
    const seuilRequis = prixAcquisition * 0.30
    const ratio = prixAcquisition > 0 ? montantTravaux / prixAcquisition : 0
    const eligible = ratio >= 0.30
    const manquant = eligible ? 0 : seuilRequis - montantTravaux
    const pourcentage = Math.min(100, ratio * 100 / 0.30)

    return {
      seuilRequis,
      ratio,
      eligible,
      manquant,
      pourcentage,
    }
  }, [prixAcquisition, montantTravaux])

  if (prixAcquisition === 0) return null

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Seuil minimum de travaux (30%)</span>
          <span className="font-medium">{formatEuros(validation.seuilRequis)}</span>
        </div>
        <Progress value={validation.pourcentage} />
        <p className="text-sm text-muted-foreground">
          {(validation.ratio * 100).toFixed(1)}% du prix d'acquisition
        </p>
      </div>

      {validation.eligible ? (
        <Alert className="border-green-500 bg-green-50">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Éligible Jeanbrun Ancien</AlertTitle>
          <AlertDescription className="text-green-700">
            Le montant de vos travaux respecte le seuil de 30% requis.
          </AlertDescription>
        </Alert>
      ) : (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Travaux insuffisants</AlertTitle>
          <AlertDescription>
            Il manque <strong>{formatEuros(validation.manquant)}</strong> pour
            atteindre le seuil d'éligibilité de 30%.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
```

**Fichier:** `src/components/simulateur/etape-2/VilleAutocomplete.tsx`

```tsx
'use client'

import { useState, useCallback } from 'react'
import { useDebounce } from '@/lib/hooks/useDebounce'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Check, ChevronsUpDown, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Ville {
  slug: string
  name: string
  departement: string
  zoneFiscale: string
}

interface VilleAutocompleteProps {
  value: string | null
  onChange: (ville: Ville | null) => void
}

export function VilleAutocomplete({ value, onChange }: VilleAutocompleteProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<Ville[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedVille, setSelectedVille] = useState<Ville | null>(null)

  const debouncedQuery = useDebounce(query, 300)

  // Fetch suggestions
  const fetchSuggestions = useCallback(async (q: string) => {
    if (q.length < 2) {
      setSuggestions([])
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/villes/autocomplete?q=${encodeURIComponent(q)}`)
      const data = await response.json()
      setSuggestions(data.suggestions || [])
    } catch (error) {
      console.error('Erreur autocomplete:', error)
      setSuggestions([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Effect pour déclencher la recherche
  useState(() => {
    fetchSuggestions(debouncedQuery)
  })

  const handleSelect = (ville: Ville) => {
    setSelectedVille(ville)
    onChange(ville)
    setOpen(false)
    setQuery('')
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedVille ? (
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              {selectedVille.name} ({selectedVille.departement})
            </span>
          ) : (
            <span className="text-muted-foreground">Rechercher une ville...</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput
            placeholder="Tapez le nom d'une ville..."
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            {loading && (
              <div className="p-4 text-center text-sm text-muted-foreground">
                Recherche...
              </div>
            )}
            <CommandEmpty>Aucune ville trouvée.</CommandEmpty>
            <CommandGroup>
              {suggestions.map((ville) => (
                <CommandItem
                  key={ville.slug}
                  value={ville.slug}
                  onSelect={() => handleSelect(ville)}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      selectedVille?.slug === ville.slug ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  <div className="flex flex-col">
                    <span>{ville.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {ville.departement} - Zone {ville.zoneFiscale}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
```

---

### 3.4 Étape 3: Financement (2j)

**ID:** 3.4

**Fichier:** `src/components/simulateur/etape-3/JaugeEndettement.tsx`

```tsx
import { useMemo } from 'react'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react'

interface JaugeEndettementProps {
  revenuMensuel: number
  mensualiteCredit: number
  autresCredits: number
}

export function JaugeEndettement({
  revenuMensuel,
  mensualiteCredit,
  autresCredits,
}: JaugeEndettementProps) {
  const endettement = useMemo(() => {
    if (revenuMensuel === 0) return { taux: 0, niveau: 'none' as const }

    const totalCharges = mensualiteCredit + autresCredits
    const taux = (totalCharges / revenuMensuel) * 100

    let niveau: 'safe' | 'warning' | 'danger' | 'none'
    if (taux <= 33) niveau = 'safe'
    else if (taux <= 35) niveau = 'warning'
    else niveau = 'danger'

    return { taux, niveau }
  }, [revenuMensuel, mensualiteCredit, autresCredits])

  const colorClass = {
    none: 'bg-muted',
    safe: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger: 'bg-red-500',
  }[endettement.niveau]

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Taux d'endettement</span>
          <span className="font-bold">{endettement.taux.toFixed(1)}%</span>
        </div>

        <div className="relative h-4 overflow-hidden rounded-full bg-muted">
          {/* Zones de couleur */}
          <div className="absolute inset-y-0 left-0 w-[33%] bg-green-200" />
          <div className="absolute inset-y-0 left-[33%] w-[2%] bg-yellow-200" />
          <div className="absolute inset-y-0 left-[35%] bg-red-200" />

          {/* Jauge */}
          <div
            className={`absolute inset-y-0 left-0 transition-all ${colorClass}`}
            style={{ width: `${Math.min(endettement.taux, 100)}%` }}
          />

          {/* Marqueur 33% */}
          <div
            className="absolute inset-y-0 w-0.5 bg-black/50"
            style={{ left: '33%' }}
          />
          <div
            className="absolute inset-y-0 w-0.5 bg-black/50"
            style={{ left: '35%' }}
          />
        </div>

        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0%</span>
          <span>33%</span>
          <span>35%</span>
          <span>100%</span>
        </div>
      </div>

      {endettement.niveau === 'safe' && (
        <Alert className="border-green-500 bg-green-50">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700">
            Votre taux d'endettement est dans les normes bancaires (&lt; 33%).
          </AlertDescription>
        </Alert>
      )}

      {endettement.niveau === 'warning' && (
        <Alert className="border-yellow-500 bg-yellow-50">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-700">
            Taux d'endettement limite. Un apport supplémentaire pourrait faciliter l'obtention du prêt.
          </AlertDescription>
        </Alert>
      )}

      {endettement.niveau === 'danger' && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>
            Taux d'endettement trop élevé (&gt; 35%). Le financement pourrait être refusé.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
```

---

### 3.5 Étape 4: Stratégie locative (2j)

**ID:** 3.5

**Fichier:** `src/components/simulateur/etape-4/NiveauLoyerCards.tsx`

```tsx
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatEuros } from '@/lib/utils/format'

type NiveauLoyer = 'intermediaire' | 'social' | 'tres_social'

interface NiveauLoyerCardsProps {
  value: NiveauLoyer | null
  onChange: (value: NiveauLoyer) => void
  plafonds: {
    intermediaire: number
    social: number
    tres_social: number
  }
  surface: number
  zoneFiscale: string
}

export function NiveauLoyerCards({
  value,
  onChange,
  plafonds,
  surface,
  zoneFiscale,
}: NiveauLoyerCardsProps) {
  const niveaux: {
    id: NiveauLoyer
    label: string
    description: string
    color: string
  }[] = [
    {
      id: 'intermediaire',
      label: 'Intermédiaire',
      description: 'Loyer libre, plafond le plus élevé',
      color: 'border-blue-500 bg-blue-50',
    },
    {
      id: 'social',
      label: 'Social',
      description: 'Loyer modéré, meilleur amortissement',
      color: 'border-green-500 bg-green-50',
    },
    {
      id: 'tres_social',
      label: 'Très Social',
      description: 'Loyer bas, amortissement maximum',
      color: 'border-purple-500 bg-purple-50',
    },
  ]

  // Coefficient de surface
  const coefficient = Math.min(1.2, 0.7 + 19 / surface)

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        Zone {zoneFiscale} - Surface {surface} m² - Coefficient: {coefficient.toFixed(2)}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {niveaux.map((niveau) => {
          const plafondM2 = plafonds[niveau.id]
          const loyerMax = Math.round(plafondM2 * surface * coefficient)
          const amortissement = {
            intermediaire: { neuf: '3.5%', ancien: '3.0%' },
            social: { neuf: '4.5%', ancien: '3.5%' },
            tres_social: { neuf: '5.5%', ancien: '4.0%' },
          }[niveau.id]

          return (
            <Card
              key={niveau.id}
              className={`cursor-pointer p-4 transition-all hover:shadow-md ${
                value === niveau.id
                  ? `border-2 ${niveau.color}`
                  : ''
              }`}
              onClick={() => onChange(niveau.id)}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{niveau.label}</h3>
                  {value === niveau.id && (
                    <Badge variant="default">Sélectionné</Badge>
                  )}
                </div>

                <p className="text-sm text-muted-foreground">
                  {niveau.description}
                </p>

                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Loyer max:</span>
                    <span className="font-medium">{formatEuros(loyerMax)}/mois</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Amort. neuf:</span>
                    <span className="font-medium text-primary">{amortissement.neuf}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Amort. ancien:</span>
                    <span className="font-medium">{amortissement.ancien}</span>
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
```

**Fichier:** `src/components/simulateur/etape-4/PerteGainVisualisation.tsx`

```tsx
import { useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { formatEuros } from '@/lib/utils/format'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface PerteGainVisualisationProps {
  loyerMarche: number
  loyerPlafonne: number
  economieFiscale: number
}

export function PerteGainVisualisation({
  loyerMarche,
  loyerPlafonne,
  economieFiscale,
}: PerteGainVisualisationProps) {
  const bilan = useMemo(() => {
    const perteLoyerAnnuelle = (loyerMarche - loyerPlafonne) * 12
    const gainNetAnnuel = economieFiscale - perteLoyerAnnuelle

    return {
      perteLoyerAnnuelle,
      economieFiscale,
      gainNetAnnuel,
      estPositif: gainNetAnnuel >= 0,
    }
  }, [loyerMarche, loyerPlafonne, economieFiscale])

  return (
    <Card className="p-6">
      <h3 className="mb-4 font-semibold">Impact du niveau de loyer</h3>

      <div className="space-y-4">
        {/* Ligne loyer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-red-500" />
            <span>Perte sur loyer (vs marché)</span>
          </div>
          <span className="font-medium text-red-500">
            -{formatEuros(bilan.perteLoyerAnnuelle)}/an
          </span>
        </div>

        {/* Ligne économie */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span>Économie fiscale</span>
          </div>
          <span className="font-medium text-green-500">
            +{formatEuros(bilan.economieFiscale)}/an
          </span>
        </div>

        {/* Séparateur */}
        <div className="border-t border-dashed" />

        {/* Bilan */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {bilan.estPositif ? (
              <TrendingUp className="h-5 w-5 text-green-600" />
            ) : (
              <TrendingDown className="h-5 w-5 text-red-600" />
            )}
            <span className="font-semibold">Gain net annuel</span>
          </div>
          <span
            className={`text-lg font-bold ${
              bilan.estPositif ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {bilan.estPositif ? '+' : ''}{formatEuros(bilan.gainNetAnnuel)}
          </span>
        </div>
      </div>
    </Card>
  )
}
```

---

### 3.6 Étape 5: Durée et sortie (1,5j)

**ID:** 3.6

**Fichier:** `src/components/simulateur/etape-5/DureeSlider.tsx`

```tsx
import { Slider } from '@/components/ui/slider'
import { Card } from '@/components/ui/card'
import { Info } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

interface DureeSliderProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
}

export function DureeSlider({
  value,
  onChange,
  min = 9,
  max = 30,
}: DureeSliderProps) {
  const handleChange = (values: number[]) => {
    onChange(values[0])
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-medium">Durée de détention prévue</span>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">
                L'engagement Jeanbrun est de 9 ans minimum.
                Au-delà, les abattements sur la plus-value augmentent.
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
        <span className="text-2xl font-bold text-primary">{value} ans</span>
      </div>

      <Slider
        value={[value]}
        onValueChange={handleChange}
        min={min}
        max={max}
        step={1}
        className="w-full"
      />

      <div className="flex justify-between text-sm text-muted-foreground">
        <span>{min} ans (minimum)</span>
        <span>{max} ans</span>
      </div>

      {/* Info contextuelles */}
      <Card className="bg-muted/50 p-4">
        <div className="space-y-2 text-sm">
          {value === 9 && (
            <p>⚠️ Durée minimum d'engagement Jeanbrun</p>
          )}
          {value >= 22 && value < 30 && (
            <p>✅ Exonération totale d'IR sur la plus-value</p>
          )}
          {value >= 30 && (
            <p>✅ Exonération totale d'IR + prélèvements sociaux</p>
          )}
          {value > 9 && value < 22 && (
            <p>
              📊 Abattement PV: {((value - 5) * 6).toFixed(0)}% IR /
              {((value - 5) * 1.65).toFixed(1)}% PS
            </p>
          )}
        </div>
      </Card>
    </div>
  )
}
```

---

### 3.7 Étape 6: Structure juridique (1,5j)

**ID:** 3.7

**Fichier:** `src/components/simulateur/etape-6/StructureCards.tsx`

```tsx
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, X } from 'lucide-react'

type Structure = 'nom_propre' | 'sci_ir' | 'sci_is'

interface StructureCardsProps {
  value: Structure | null
  onChange: (value: Structure) => void
  recommandation?: Structure
}

const structures: {
  id: Structure
  label: string
  description: string
  avantages: string[]
  inconvenients: string[]
}[] = [
  {
    id: 'nom_propre',
    label: 'Nom propre',
    description: 'Détention directe du bien',
    avantages: [
      'Simplicité de gestion',
      'Pas de frais de structure',
      'Amortissement Jeanbrun direct',
    ],
    inconvenients: [
      'Transmission complexe',
      'Responsabilité illimitée',
    ],
  },
  {
    id: 'sci_ir',
    label: 'SCI à l\'IR',
    description: 'Société civile immobilière transparente',
    avantages: [
      'Transmission facilitée',
      'Amortissement Jeanbrun applicable',
      'Gestion patrimoine familial',
    ],
    inconvenients: [
      'Frais de création (~1500€)',
      'Comptabilité obligatoire',
    ],
  },
  {
    id: 'sci_is',
    label: 'SCI à l\'IS',
    description: 'Société soumise à l\'impôt sur les sociétés',
    avantages: [
      'IS 15% jusqu\'à 42 500€',
      'Amortissement comptable',
      'Déduction des intérêts',
    ],
    inconvenients: [
      'Pas d\'amortissement Jeanbrun',
      'Double imposition dividendes',
      'Plus-value professionnelle',
    ],
  },
]

export function StructureCards({
  value,
  onChange,
  recommandation,
}: StructureCardsProps) {
  return (
    <div className="space-y-4">
      {structures.map((structure) => {
        const isRecommanded = structure.id === recommandation
        const isSelected = structure.id === value

        return (
          <Card
            key={structure.id}
            className={`cursor-pointer p-4 transition-all hover:shadow-md ${
              isSelected ? 'border-2 border-primary bg-primary/5' : ''
            }`}
            onClick={() => onChange(structure.id)}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{structure.label}</h3>
                <div className="flex gap-2">
                  {isRecommanded && (
                    <Badge variant="secondary">Recommandé</Badge>
                  )}
                  {isSelected && (
                    <Badge variant="default">Sélectionné</Badge>
                  )}
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                {structure.description}
              </p>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="mb-2 text-xs font-medium text-green-700">
                    Avantages
                  </p>
                  <ul className="space-y-1">
                    {structure.avantages.map((a, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Check className="mt-0.5 h-3 w-3 text-green-600" />
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="mb-2 text-xs font-medium text-red-700">
                    Inconvénients
                  </p>
                  <ul className="space-y-1">
                    {structure.inconvenients.map((i, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <X className="mt-0.5 h-3 w-3 text-red-600" />
                        {i}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
```

---

### 3.8 Page résultats simulation (3j)

**ID:** 3.8

**Fichier:** `src/components/simulateur/resultats/SyntheseCard.tsx`

```tsx
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatEuros, formatPercent } from '@/lib/utils/format'
import { TrendingUp, Wallet, PiggyBank, Home } from 'lucide-react'

interface SyntheseCardProps {
  economieFiscaleAnnuelle: number
  economieFiscaleTotale: number
  cashFlowMensuel: number
  rendementNet: number
  loyerMensuel: number
  mensualiteCredit: number
}

export function SyntheseCard({
  economieFiscaleAnnuelle,
  economieFiscaleTotale,
  cashFlowMensuel,
  rendementNet,
  loyerMensuel,
  mensualiteCredit,
}: SyntheseCardProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Économie fiscale annuelle */}
      <Card className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              Économie fiscale annuelle
            </p>
            <p className="mt-1 text-3xl font-bold text-green-600">
              {formatEuros(economieFiscaleAnnuelle)}
            </p>
          </div>
          <div className="rounded-full bg-green-100 p-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
          </div>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Total sur 9 ans: {formatEuros(economieFiscaleTotale)}
        </p>
      </Card>

      {/* Cash-flow mensuel */}
      <Card className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Cash-flow mensuel</p>
            <p
              className={`mt-1 text-3xl font-bold ${
                cashFlowMensuel >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {cashFlowMensuel >= 0 ? '+' : ''}{formatEuros(cashFlowMensuel)}
            </p>
          </div>
          <div className="rounded-full bg-blue-100 p-2">
            <Wallet className="h-5 w-5 text-blue-600" />
          </div>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Loyer {formatEuros(loyerMensuel)} - Crédit {formatEuros(mensualiteCredit)}
        </p>
      </Card>

      {/* Rendement net */}
      <Card className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Rendement net</p>
            <p className="mt-1 text-3xl font-bold text-primary">
              {formatPercent(rendementNet)}
            </p>
          </div>
          <div className="rounded-full bg-primary/10 p-2">
            <PiggyBank className="h-5 w-5 text-primary" />
          </div>
        </div>
        <Badge variant="outline" className="mt-2">
          Après charges et fiscalité
        </Badge>
      </Card>

      {/* Effort d'épargne */}
      <Card className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Effort d'épargne</p>
            <p
              className={`mt-1 text-3xl font-bold ${
                cashFlowMensuel >= 0 ? 'text-green-600' : 'text-amber-600'
              }`}
            >
              {cashFlowMensuel >= 0
                ? 'Autofinancé'
                : formatEuros(Math.abs(cashFlowMensuel))}
            </p>
          </div>
          <div className="rounded-full bg-amber-100 p-2">
            <Home className="h-5 w-5 text-amber-600" />
          </div>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          {cashFlowMensuel >= 0
            ? 'Aucun effort requis'
            : 'Effort mensuel nécessaire'}
        </p>
      </Card>
    </div>
  )
}
```

---

### 3.9 Composant graphique patrimoine (1j)

**ID:** 3.9

**Fichier:** `src/components/simulateur/resultats/GraphiquePatrimoine.tsx`

```tsx
'use client'

import { useMemo } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { Card } from '@/components/ui/card'
import { formatEuros } from '@/lib/utils/format'

interface GraphiquePatrimoineProps {
  donnees: {
    annee: number
    valeurBien: number
    capitalRembourse: number
    capitalRestant: number
    economieCumulee: number
  }[]
}

export function GraphiquePatrimoine({ donnees }: GraphiquePatrimoineProps) {
  const dataFormatted = useMemo(() => {
    return donnees.map((d) => ({
      ...d,
      patrimoineNet: d.valeurBien - d.capitalRestant + d.economieCumulee,
    }))
  }, [donnees])

  return (
    <Card className="p-6">
      <h3 className="mb-4 font-semibold">Évolution de votre patrimoine</h3>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={dataFormatted}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="annee"
              tickFormatter={(v) => `An ${v}`}
            />
            <YAxis
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}k€`}
            />
            <Tooltip
              formatter={(value: number, name: string) => [
                formatEuros(value),
                {
                  valeurBien: 'Valeur du bien',
                  capitalRembourse: 'Capital remboursé',
                  economieCumulee: 'Économies fiscales cumulées',
                  patrimoineNet: 'Patrimoine net',
                }[name] || name,
              ]}
              labelFormatter={(label) => `Année ${label}`}
            />
            <Legend />

            <Area
              type="monotone"
              dataKey="valeurBien"
              name="Valeur du bien"
              stroke="#3b82f6"
              fill="#3b82f680"
              stackId="1"
            />
            <Area
              type="monotone"
              dataKey="economieCumulee"
              name="Économies fiscales"
              stroke="#22c55e"
              fill="#22c55e80"
              stackId="2"
            />
            <Area
              type="monotone"
              dataKey="patrimoineNet"
              name="Patrimoine net"
              stroke="#8b5cf6"
              fill="none"
              strokeWidth={2}
              strokeDasharray="5 5"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <p className="mt-4 text-sm text-muted-foreground">
        Ce graphique illustre l'évolution de votre patrimoine sur la durée de détention.
        Le patrimoine net tient compte de la valeur du bien, du capital remboursé
        et des économies fiscales cumulées.
      </p>
    </Card>
  )
}
```

---

### 3.10 Sauvegarde localStorage (0,5j)

**ID:** 3.10

**Fichier:** `src/lib/hooks/useSimulation.ts`

```tsx
'use client'

import { useState, useCallback, useEffect } from 'react'
import { useLocalStorage } from './useLocalStorage'
import type { SimulationInput, SimulationResult } from '@/types/simulation'

const STORAGE_KEY = 'simulateur-jeanbrun-draft'

interface SimulationState {
  currentStep: number
  data: Partial<SimulationInput>
  lastUpdated: string
}

export function useSimulation() {
  const [storedState, setStoredState] = useLocalStorage<SimulationState | null>(
    STORAGE_KEY,
    null
  )

  const [currentStep, setCurrentStep] = useState(storedState?.currentStep || 1)
  const [data, setData] = useState<Partial<SimulationInput>>(
    storedState?.data || {}
  )
  const [result, setResult] = useState<SimulationResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Sauvegarde automatique
  useEffect(() => {
    setStoredState({
      currentStep,
      data,
      lastUpdated: new Date().toISOString(),
    })
  }, [currentStep, data, setStoredState])

  // Navigation
  const goToStep = useCallback((step: number) => {
    setCurrentStep(Math.max(1, Math.min(6, step)))
  }, [])

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => Math.min(6, prev + 1))
  }, [])

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(1, prev - 1))
  }, [])

  // Mise à jour des données
  const updateData = useCallback(
    (stepData: Partial<SimulationInput>) => {
      setData((prev) => ({ ...prev, ...stepData }))
    },
    []
  )

  // Soumission finale
  const submitSimulation = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/simulation/avancee', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la simulation')
      }

      const result = await response.json()
      setResult(result)

      // Nettoyage du brouillon après succès
      setStoredState(null)

      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [data, setStoredState])

  // Reset
  const reset = useCallback(() => {
    setCurrentStep(1)
    setData({})
    setResult(null)
    setError(null)
    setStoredState(null)
  }, [setStoredState])

  return {
    currentStep,
    data,
    result,
    isLoading,
    error,
    goToStep,
    nextStep,
    prevStep,
    updateData,
    submitSimulation,
    reset,
    hasDraft: !!storedState,
  }
}
```

---

### 3.11 Responsive mobile (1,5j)

**ID:** 3.11

**Points d'attention:**

```css
/* Breakpoints Tailwind */
/* sm: 640px, md: 768px, lg: 1024px, xl: 1280px */

/* Mobile first: tous les styles de base sont pour mobile */
/* Les classes md:, lg: ajoutent les styles desktop */
```

**Checklist responsive:**

- [ ] Progress bar: compacter sur mobile (sans labels)
- [ ] Cards sélection: 1 colonne mobile, 2-3 colonnes desktop
- [ ] Formulaires: inputs pleine largeur mobile
- [ ] Navigation bas: boutons pleine largeur mobile
- [ ] Graphiques: hauteur réduite mobile (250px vs 400px)
- [ ] Tables: scroll horizontal si nécessaire
- [ ] Modales: sheet mobile, dialog desktop
- [ ] Touch targets: minimum 44px

---

## 4. Checklist de fin de sprint

### 4.1 Validations fonctionnelles

- [ ] 6 étapes navigables avec retour
- [ ] Validation temps réel sur tous les champs
- [ ] TMI calculé automatiquement
- [ ] Seuil travaux 30% vérifié (ancien)
- [ ] Jauge endettement avec couleurs
- [ ] Visualisation Perte/Gain locatif
- [ ] Page résultats avec synthèse
- [ ] Sauvegarde localStorage fonctionnelle

### 4.2 Validations techniques

- [ ] Tests composants >= 70% coverage
- [ ] Accessibilité WCAG 2.1 AA (axe-core)
- [ ] Design responsive vérifié (375px → 1440px)
- [ ] Performance: INP < 200ms

### 4.3 Documentation

- [ ] Storybook composants principaux
- [ ] Types TypeScript complets

---

## 5. Ressources

| Ressource | URL |
|-----------|-----|
| Wireframes v2.0 | /root/simulateur_loi_Jeanbrun/wireframes_simulateur_jeanbrun.md |
| shadcn/ui | https://ui.shadcn.com |
| React Hook Form | https://react-hook-form.com |
| Recharts | https://recharts.org |

---

**Auteur:** Équipe Claude Code
**Date:** 30 janvier 2026
