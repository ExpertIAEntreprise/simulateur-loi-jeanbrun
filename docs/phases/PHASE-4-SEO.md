# Phase 4 - Pages SEO

**Sprint:** 4
**Semaines:** S7-S8 (17-28 Mars 2026)
**Effort estimé:** 13,75 jours
**Objectif:** 50 pages villes SEO-ready indexables

---

## 1. Objectifs du sprint

### 1.1 Livrables attendus

| Livrable | Description | Critère de validation |
|----------|-------------|----------------------|
| Template page ville | Page dynamique SSG | Build OK 50 pages |
| Données marché | Prix, loyers, tension | Affichage correct |
| Plafonds Jeanbrun | 3 niveaux par zone | Calculs exacts |
| Programmes intégrés | Top 3 par ville | Liens fonctionnels |
| Simulateur pré-rempli | Ville injectée | Navigation fluide |
| Contenu éditorial | 400-600 mots uniques | 50 textes validés |
| JSON-LD | Données structurées | Rich Results Test OK |
| Sitemap.xml | Dynamique | Toutes URLs listées |
| Maillage interne | Villes proches | Liens automatiques |
| Index villes | Page /villes | Filtres fonctionnels |

### 1.2 Dépendances

- Sprint 3 terminé (simulateur OK)
- Entités cVille remplies dans EspoCRM
- Données marché disponibles (DVF, loyers)

---

## 2. Liste des 50 villes MVP

### 2.1 Répartition par zone fiscale

| Zone | Nombre | Exemples |
|------|--------|----------|
| A bis | 5 | Paris, Neuilly, Levallois, Boulogne, Vincennes |
| A | 15 | Lyon, Marseille, Nice, Montpellier, Bordeaux... |
| B1 | 20 | Nantes, Toulouse, Rennes, Grenoble, Strasbourg... |
| B2 | 10 | Orléans, Tours, Limoges, Amiens, Metz... |

### 2.2 Liste complète

```
Zone A bis (5):
Paris, Neuilly-sur-Seine, Levallois-Perret, Boulogne-Billancourt, Vincennes

Zone A (15):
Lyon, Marseille, Nice, Montpellier, Bordeaux, Lille, Strasbourg,
Aix-en-Provence, Toulouse, Nantes, Villeurbanne, Saint-Denis,
Montreuil, Argenteuil, Nanterre

Zone B1 (20):
Rennes, Grenoble, Rouen, Toulon, Angers, Le Mans, Dijon, Clermont-Ferrand,
Caen, Nancy, Metz, Brest, Reims, Perpignan, Besançon, Orléans, Mulhouse,
Dunkerque, Poitiers, Avignon

Zone B2/C (10):
Le Havre, Saint-Étienne, Amiens, Limoges, Tours, Nîmes, Créteil,
Vitry-sur-Seine, Colombes, Asnières-sur-Seine
```

---

## 3. Tâches détaillées

### 3.1 Template page ville (2j)

**ID:** 4.1
**Fichier:** `src/app/villes/[slug]/page.tsx`

```tsx
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { espocrm } from '@/lib/api/espocrm'
import { DonneesMarche } from '@/components/villes/DonneesMarche'
import { PlafondsJeanbrun } from '@/components/villes/PlafondsJeanbrun'
import { ProgrammesList } from '@/components/villes/ProgrammesList'
import { SimulateurPreRempli } from '@/components/villes/SimulateurPreRempli'
import { VillesProches } from '@/components/villes/VillesProches'
import { ContenuEditorial } from '@/components/villes/ContenuEditorial'
import { JsonLdVille } from '@/components/common/JsonLd'

interface PageProps {
  params: { slug: string }
}

// Génération statique des 50 villes
export async function generateStaticParams() {
  const { list } = await espocrm.getVilles({ maxSize: 50 })
  return list.map((ville) => ({ slug: ville.slug }))
}

// Métadonnées dynamiques
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const ville = await espocrm.getVilleBySlug(params.slug)

  if (!ville) {
    return { title: 'Ville non trouvée' }
  }

  return {
    title: ville.metaTitle || `Loi Jeanbrun à ${ville.name} - Simulation défiscalisation`,
    description: ville.metaDescription ||
      `Simulez votre investissement Jeanbrun à ${ville.name}. Prix m²: ${ville.prixM2Moyen}€, Zone ${ville.zoneFiscale}.`,
    openGraph: {
      title: `Investir avec la loi Jeanbrun à ${ville.name}`,
      description: `Découvrez les plafonds de loyer et l'économie fiscale possible à ${ville.name}.`,
      images: [`/og/ville/${params.slug}.png`],
    },
    alternates: {
      canonical: `https://simuler-loi-fiscale-jeanbrun.fr/villes/${params.slug}`,
    },
  }
}

export default async function VillePage({ params }: PageProps) {
  const ville = await espocrm.getVilleBySlug(params.slug)

  if (!ville) {
    notFound()
  }

  // Récupération des programmes de la ville
  const { list: programmes } = await espocrm.getProgrammes({
    villeId: ville.id,
    eligible: true,
    maxSize: 3,
  })

  // Villes proches (même département ou région)
  const { list: villesProches } = await espocrm.getVilles({
    where: [
      { type: 'equals', attribute: 'region', value: ville.region },
      { type: 'notEquals', attribute: 'id', value: ville.id },
    ],
    maxSize: 5,
  })

  return (
    <>
      {/* JSON-LD */}
      <JsonLdVille ville={ville} programmes={programmes} />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <a href="/villes" className="hover:underline">Villes</a>
            <span>/</span>
            <span>{ville.departement}</span>
          </div>
          <h1 className="mt-2 text-4xl font-bold">
            Loi Jeanbrun à {ville.name}
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Simulation défiscalisation immobilière - Zone {ville.zoneFiscale}
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Colonne principale */}
          <div className="space-y-8 lg:col-span-2">
            {/* Données marché */}
            <section>
              <h2 className="mb-4 text-2xl font-semibold">
                Marché immobilier à {ville.name}
              </h2>
              <DonneesMarche ville={ville} />
            </section>

            {/* Plafonds Jeanbrun */}
            <section>
              <h2 className="mb-4 text-2xl font-semibold">
                Plafonds de loyer Jeanbrun
              </h2>
              <PlafondsJeanbrun ville={ville} />
            </section>

            {/* Contenu éditorial */}
            <section>
              <ContenuEditorial ville={ville} />
            </section>

            {/* Programmes */}
            {programmes.length > 0 && (
              <section>
                <h2 className="mb-4 text-2xl font-semibold">
                  Programmes neufs éligibles
                </h2>
                <ProgrammesList programmes={programmes} />
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Simulateur */}
            <div className="sticky top-4">
              <h2 className="mb-4 text-xl font-semibold">
                Simuler mon investissement
              </h2>
              <SimulateurPreRempli ville={ville} />
            </div>
          </aside>
        </div>

        {/* Villes proches */}
        {villesProches.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-4 text-2xl font-semibold">
              Villes proches en {ville.region}
            </h2>
            <VillesProches villes={villesProches} />
          </section>
        )}
      </main>
    </>
  )
}

// Revalidation ISR toutes les 24h
export const revalidate = 86400
```

---

### 3.2 Composant données marché (1j)

**ID:** 4.2
**Fichier:** `src/components/villes/DonneesMarche.tsx`

```tsx
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatEuros, formatPercent } from '@/lib/utils/format'
import { TrendingUp, TrendingDown, Home, Building, MapPin } from 'lucide-react'
import type { CVille } from '@/types/espocrm'

interface DonnesMarcheProps {
  ville: CVille
}

export function DonneesMarche({ ville }: DonnesMarcheProps) {
  const tendance = ville.evolutionPrix1An >= 0 ? 'hausse' : 'baisse'

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Prix m² moyen */}
      <Card className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Prix m² moyen</p>
            <p className="mt-1 text-2xl font-bold">
              {formatEuros(ville.prixM2Moyen)}
            </p>
          </div>
          <div className="rounded-full bg-blue-100 p-2">
            <Home className="h-4 w-4 text-blue-600" />
          </div>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Médian: {formatEuros(ville.prixM2Median)}/m²
        </p>
      </Card>

      {/* Évolution prix */}
      <Card className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Évolution 1 an</p>
            <p
              className={`mt-1 text-2xl font-bold ${
                tendance === 'hausse' ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {formatPercent(ville.evolutionPrix1An, true)}
            </p>
          </div>
          <div
            className={`rounded-full p-2 ${
              tendance === 'hausse' ? 'bg-green-100' : 'bg-red-100'
            }`}
          >
            {tendance === 'hausse' ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
          </div>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Tendance: {tendance === 'hausse' ? 'Marché haussier' : 'Marché baissier'}
        </p>
      </Card>

      {/* Loyer m² */}
      <Card className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Loyer m² moyen</p>
            <p className="mt-1 text-2xl font-bold">
              {formatEuros(ville.loyerM2Moyen)}
            </p>
          </div>
          <div className="rounded-full bg-purple-100 p-2">
            <Building className="h-4 w-4 text-purple-600" />
          </div>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Rendement brut estimé: {((ville.loyerM2Moyen * 12) / ville.prixM2Moyen * 100).toFixed(1)}%
        </p>
      </Card>

      {/* Tension locative */}
      <Card className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Tension locative</p>
            <Badge
              className="mt-1"
              variant={
                ville.tensionLocative === 'tres_forte'
                  ? 'destructive'
                  : ville.tensionLocative === 'forte'
                    ? 'default'
                    : 'secondary'
              }
            >
              {formatTension(ville.tensionLocative)}
            </Badge>
          </div>
          <div className="rounded-full bg-amber-100 p-2">
            <MapPin className="h-4 w-4 text-amber-600" />
          </div>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Zone fiscale: {ville.zoneFiscale.replace('_', ' ')}
        </p>
      </Card>
    </div>
  )
}

function formatTension(tension: string): string {
  return {
    faible: 'Faible',
    moyenne: 'Moyenne',
    forte: 'Forte',
    tres_forte: 'Très forte',
  }[tension] || tension
}
```

---

### 3.3 Composant plafonds Jeanbrun (0,5j)

**ID:** 4.3
**Fichier:** `src/components/villes/PlafondsJeanbrun.tsx`

```tsx
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatEuros } from '@/lib/utils/format'
import { Info } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import type { CVille } from '@/types/espocrm'

interface PlafondsJeanbrunProps {
  ville: CVille
}

export function PlafondsJeanbrun({ ville }: PlafondsJeanbrunProps) {
  const niveaux = [
    {
      id: 'intermediaire',
      label: 'Intermédiaire',
      plafond: ville.plafondIntermediaire,
      description: 'Loyer libre avec plafond',
      tauxNeuf: '3.5%',
      tauxAncien: '3.0%',
      plafondDeduction: 8000,
    },
    {
      id: 'social',
      label: 'Social',
      plafond: ville.plafondSocial,
      description: 'Loyer conventionné social',
      tauxNeuf: '4.5%',
      tauxAncien: '3.5%',
      plafondDeduction: 10000,
    },
    {
      id: 'tres_social',
      label: 'Très Social',
      plafond: ville.plafondTresSocial,
      description: 'Loyer très social (PLS)',
      tauxNeuf: '5.5%',
      tauxAncien: '4.0%',
      plafondDeduction: 12000,
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Badge variant="outline">Zone {ville.zoneFiscale}</Badge>
        <Tooltip>
          <TooltipTrigger>
            <Info className="h-4 w-4 text-muted-foreground" />
          </TooltipTrigger>
          <TooltipContent>
            <p className="max-w-xs">
              Les plafonds de loyer Jeanbrun varient selon la zone géographique
              et le niveau de loyer choisi. Un coefficient de surface s'applique.
            </p>
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {niveaux.map((niveau) => (
          <Card key={niveau.id} className="p-4">
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold">{niveau.label}</h3>
                <p className="text-sm text-muted-foreground">
                  {niveau.description}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Plafond loyer:</span>
                  <span className="font-medium">
                    {formatEuros(niveau.plafond)}/m²
                  </span>
                </div>

                <div className="border-t pt-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    Amortissement Jeanbrun
                  </p>
                  <div className="mt-1 flex justify-between text-sm">
                    <span>Neuf:</span>
                    <span className="font-medium text-primary">
                      {niveau.tauxNeuf}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Ancien:</span>
                    <span className="font-medium">{niveau.tauxAncien}</span>
                  </div>
                </div>

                <div className="border-t pt-2">
                  <div className="flex justify-between text-sm">
                    <span>Plafond déduction:</span>
                    <span className="font-medium text-green-600">
                      {formatEuros(niveau.plafondDeduction)}/an
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <p className="text-sm text-muted-foreground">
        * Un coefficient de surface s'applique: 0.7 + (19 / surface), plafonné à 1.2.
        Pour un T2 de 45m², le coefficient est de 1.12.
      </p>
    </div>
  )
}
```

---

### 3.4 Liste programmes intégrée (1j)

**ID:** 4.4
**Fichier:** `src/components/villes/ProgrammesList.tsx`

```tsx
import Link from 'next/link'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatEuros } from '@/lib/utils/format'
import { Building2, MapPin, Calendar, ArrowRight } from 'lucide-react'
import type { CProgramme } from '@/types/espocrm'

interface ProgrammesListProps {
  programmes: CProgramme[]
}

export function ProgrammesList({ programmes }: ProgrammesListProps) {
  if (programmes.length === 0) {
    return (
      <Card className="p-6 text-center">
        <Building2 className="mx-auto h-12 w-12 text-muted-foreground" />
        <p className="mt-4 text-muted-foreground">
          Aucun programme neuf éligible Jeanbrun pour le moment.
        </p>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {programmes.map((programme) => (
        <Card key={programme.id} className="overflow-hidden">
          {/* Image */}
          <div className="relative aspect-video bg-muted">
            {programme.images[0] ? (
              <Image
                src={programme.images[0]}
                alt={programme.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <Building2 className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
            <Badge className="absolute left-2 top-2" variant="default">
              Éligible Jeanbrun
            </Badge>
          </div>

          {/* Contenu */}
          <div className="p-4 space-y-3">
            <div>
              <h3 className="font-semibold line-clamp-1">{programme.name}</h3>
              <p className="text-sm text-muted-foreground">{programme.promoteur}</p>
            </div>

            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="line-clamp-1">{programme.adresse}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Livraison: {formatDate(programme.dateLivraison)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">À partir de</p>
                <p className="text-lg font-bold text-primary">
                  {formatEuros(programme.prixMin)}
                </p>
              </div>
              <Badge variant="outline">
                {programme.nbLotsDisponibles} lots
              </Badge>
            </div>

            <Link href={`/programmes/${programme.slug}`}>
              <Button variant="outline" className="w-full gap-2">
                Voir le programme
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </Card>
      ))}
    </div>
  )
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const trimestre = Math.ceil((date.getMonth() + 1) / 3)
  return `T${trimestre} ${date.getFullYear()}`
}
```

---

### 3.5 Simulateur pré-rempli (1j)

**ID:** 4.5
**Fichier:** `src/components/villes/SimulateurPreRempli.tsx`

```tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { formatEuros } from '@/lib/utils/format'
import { Calculator, ArrowRight } from 'lucide-react'
import type { CVille } from '@/types/espocrm'

interface SimulateurPreRempliProps {
  ville: CVille
}

export function SimulateurPreRempli({ ville }: SimulateurPreRempliProps) {
  const router = useRouter()
  const [budget, setBudget] = useState(200000)
  const [revenus, setRevenus] = useState('30000-50000')
  const [niveauLoyer, setNiveauLoyer] = useState('intermediaire')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{
    economieAnnuelle: number
    loyerEstime: number
  } | null>(null)

  const handleSimulation = async () => {
    setIsLoading(true)

    try {
      const response = await fetch('/api/simulation/rapide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          villeSlug: ville.slug,
          budget,
          revenus,
          niveauLoyer,
        }),
      })

      const data = await response.json()
      setResult({
        economieAnnuelle: data.economieAnnuelle,
        loyerEstime: data.loyerEstime,
      })
    } catch (error) {
      console.error('Erreur simulation:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const goToSimulateurComplet = () => {
    const params = new URLSearchParams({
      ville: ville.slug,
      budget: String(budget),
      revenus,
      niveau: niveauLoyer,
    })
    router.push(`/simulateur/avance?${params}`)
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Calculator className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">Simulation rapide</h3>
      </div>

      <div className="space-y-4">
        {/* Ville (pré-remplie) */}
        <div className="rounded-md bg-muted p-3">
          <p className="text-sm text-muted-foreground">Ville sélectionnée</p>
          <p className="font-medium">
            {ville.name} (Zone {ville.zoneFiscale})
          </p>
        </div>

        {/* Budget */}
        <div className="space-y-2">
          <Label>Budget d'investissement</Label>
          <div className="flex items-center gap-4">
            <Slider
              value={[budget]}
              onValueChange={(v) => setBudget(v[0])}
              min={100000}
              max={500000}
              step={10000}
              className="flex-1"
            />
            <span className="w-24 text-right font-medium">
              {formatEuros(budget)}
            </span>
          </div>
        </div>

        {/* Revenus */}
        <div className="space-y-2">
          <Label>Revenus annuels du foyer</Label>
          <Select value={revenus} onValueChange={setRevenus}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0-30000">Moins de 30 000€</SelectItem>
              <SelectItem value="30000-50000">30 000€ - 50 000€</SelectItem>
              <SelectItem value="50000-80000">50 000€ - 80 000€</SelectItem>
              <SelectItem value="80000-120000">80 000€ - 120 000€</SelectItem>
              <SelectItem value="120000+">Plus de 120 000€</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Niveau loyer */}
        <div className="space-y-2">
          <Label>Niveau de loyer</Label>
          <Select value={niveauLoyer} onValueChange={setNiveauLoyer}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="intermediaire">
                Intermédiaire ({formatEuros(ville.plafondIntermediaire)}/m²)
              </SelectItem>
              <SelectItem value="social">
                Social ({formatEuros(ville.plafondSocial)}/m²)
              </SelectItem>
              <SelectItem value="tres_social">
                Très social ({formatEuros(ville.plafondTresSocial)}/m²)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bouton simulation */}
        <Button
          onClick={handleSimulation}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Calcul en cours...' : 'Calculer mon économie'}
        </Button>

        {/* Résultats */}
        {result && (
          <div className="mt-4 space-y-3 rounded-md border bg-green-50 p-4">
            <div className="flex justify-between">
              <span>Économie fiscale annuelle:</span>
              <span className="font-bold text-green-600">
                {formatEuros(result.economieAnnuelle)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Loyer mensuel estimé:</span>
              <span className="font-medium">
                {formatEuros(result.loyerEstime)}
              </span>
            </div>
            <div className="border-t pt-3">
              <p className="text-sm text-green-700">
                Sur 9 ans: <strong>{formatEuros(result.economieAnnuelle * 9)}</strong> d'économie totale
              </p>
            </div>
            <Button
              onClick={goToSimulateurComplet}
              variant="outline"
              className="w-full gap-2"
            >
              Simulation détaillée
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </Card>
  )
}
```

---

### 3.6 Contenu éditorial 50 villes (3j)

**ID:** 4.6

**Structure du contenu par ville:**

1. **Introduction** (100 mots): Contexte marché local
2. **Marché immobilier** (150 mots): Analyse prix, évolution, quartiers
3. **Intérêt Jeanbrun** (150 mots): Pourquoi investir ici
4. **Conseils pratiques** (100 mots): Recommandations locales

**Template contenu:**

```markdown
## Investir avec la loi Jeanbrun à [VILLE]

[VILLE], située dans le département de [DEPARTEMENT] en région [REGION],
offre des opportunités intéressantes pour les investisseurs en loi Jeanbrun.
Avec un prix moyen de [PRIX_M2]€/m² et une tension locative [TENSION],
le marché immobilier local présente un potentiel de [POTENTIEL].

### Le marché immobilier à [VILLE]

[CONTENU_MARCHE - 150 mots sur l'analyse du marché local, quartiers à privilégier,
évolution des prix, profil des locataires]

### Pourquoi investir en Jeanbrun à [VILLE] ?

[CONTENU_JEANBRUN - 150 mots sur les avantages spécifiques de cette ville pour
le dispositif Jeanbrun, zone fiscale, plafonds de loyer, économie potentielle]

### Nos conseils pour investir à [VILLE]

[CONSEILS - 100 mots de recommandations pratiques: types de biens à privilégier,
quartiers émergents, erreurs à éviter]
```

**Automatisation avec IA (optionnel):**

```typescript
// scripts/generate-contenu-ville.ts
import { generateContent } from '@/lib/ai/content-generator'

async function generateVilleContent(ville: CVille): Promise<string> {
  const prompt = `
    Génère un contenu SEO de 400-600 mots pour la ville de ${ville.name}.

    Données:
    - Département: ${ville.departement}
    - Région: ${ville.region}
    - Zone fiscale: ${ville.zoneFiscale}
    - Prix m²: ${ville.prixM2Moyen}€
    - Loyer m²: ${ville.loyerM2Moyen}€
    - Tension locative: ${ville.tensionLocative}

    Structure:
    1. Introduction (100 mots)
    2. Marché immobilier local (150 mots)
    3. Intérêt Jeanbrun (150 mots)
    4. Conseils pratiques (100 mots)

    Ton: professionnel, informatif, engageant.
    Cible: investisseurs 35-55 ans cherchant à défiscaliser.
  `

  return generateContent(prompt)
}
```

---

### 3.7 JSON-LD pages villes (1j)

**ID:** 4.7
**Fichier:** `src/components/common/JsonLd.tsx`

```tsx
import type { CVille, CProgramme } from '@/types/espocrm'

interface JsonLdVilleProps {
  ville: CVille
  programmes?: CProgramme[]
}

export function JsonLdVille({ ville, programmes = [] }: JsonLdVilleProps) {
  const placeSchema = {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: ville.name,
    address: {
      '@type': 'PostalAddress',
      addressLocality: ville.name,
      addressRegion: ville.region,
      addressCountry: 'FR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      // Coordonnées à ajouter si disponibles
    },
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Accueil',
        item: 'https://simuler-loi-fiscale-jeanbrun.fr',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Villes',
        item: 'https://simuler-loi-fiscale-jeanbrun.fr/villes',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: ville.name,
        item: `https://simuler-loi-fiscale-jeanbrun.fr/villes/${ville.slug}`,
      },
    ],
  }

  const programmesSchema = programmes.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: programmes.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'RealEstateListing',
        name: p.name,
        url: `https://simuler-loi-fiscale-jeanbrun.fr/programmes/${p.slug}`,
        offers: {
          '@type': 'Offer',
          priceCurrency: 'EUR',
          price: p.prixMin,
          priceValidUntil: p.dateLivraison,
        },
      },
    })),
  } : null

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(placeSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {programmesSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(programmesSchema) }}
        />
      )}
    </>
  )
}
```

---

### 3.8 Sitemap.xml dynamique (0,5j)

**ID:** 4.8
**Fichier:** `src/app/sitemap.ts`

```typescript
import { MetadataRoute } from 'next'
import { espocrm } from '@/lib/api/espocrm'

const BASE_URL = 'https://simuler-loi-fiscale-jeanbrun.fr'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Pages statiques
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${BASE_URL}/simulateur`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/villes`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/programmes`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/guide`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]

  // Pages villes dynamiques
  const { list: villes } = await espocrm.getVilles({ maxSize: 100 })
  const villePages: MetadataRoute.Sitemap = villes.map((ville) => ({
    url: `${BASE_URL}/villes/${ville.slug}`,
    lastModified: new Date(ville.dateMaj),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // Pages programmes dynamiques
  const { list: programmes } = await espocrm.getProgrammes({
    eligible: true,
    maxSize: 200,
  })
  const programmePages: MetadataRoute.Sitemap = programmes.map((prog) => ({
    url: `${BASE_URL}/programmes/${prog.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.6,
  }))

  return [...staticPages, ...villePages, ...programmePages]
}
```

---

### 3.9 robots.txt (0,25j)

**ID:** 4.9
**Fichier:** `src/app/robots.ts`

```typescript
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/compte/',
          '/simulateur/resultat/',
        ],
      },
      {
        userAgent: 'GPTBot',
        disallow: '/',
      },
    ],
    sitemap: 'https://simuler-loi-fiscale-jeanbrun.fr/sitemap.xml',
  }
}
```

---

### 3.10 Metadata SEO dynamiques (0,5j)

**ID:** 4.10

Déjà inclus dans le template page ville (section 3.1).

**Checklist metadata par page:**

| Page | Title | Description | OG Image |
|------|-------|-------------|----------|
| Accueil | Simulateur Loi Jeanbrun - Défiscalisation immobilière 2026 | Simulez... | /og/home.png |
| Simulateur | Simulation Loi Jeanbrun gratuite - Calculez votre économie | Calculez... | /og/simulateur.png |
| Ville | Loi Jeanbrun à [Ville] - Simulation défiscalisation | Simulez... | /og/ville/[slug].png |
| Programme | [Nom] - Programme neuf éligible Jeanbrun | Découvrez... | /og/programme/[slug].png |

---

### 3.11 Maillage interne automatique (1j)

**ID:** 4.11
**Fichier:** `src/components/villes/VillesProches.tsx`

```tsx
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, ArrowRight } from 'lucide-react'
import type { CVille } from '@/types/espocrm'

interface VillesProchesProps {
  villes: CVille[]
}

export function VillesProches({ villes }: VillesProchesProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
      {villes.map((ville) => (
        <Link key={ville.id} href={`/villes/${ville.slug}`}>
          <Card className="p-4 transition-all hover:shadow-md hover:border-primary">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-muted p-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">{ville.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {ville.departement}
                </p>
                <Badge variant="outline" className="mt-2">
                  Zone {ville.zoneFiscale}
                </Badge>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </Card>
        </Link>
      ))}
    </div>
  )
}
```

---

### 3.12 Page index villes (1j)

**ID:** 4.12
**Fichier:** `src/app/villes/page.tsx`

```tsx
import { Metadata } from 'next'
import { espocrm } from '@/lib/api/espocrm'
import { VilleCard } from '@/components/villes/VilleCard'
import { VillesFilters } from '@/components/villes/VillesFilters'

export const metadata: Metadata = {
  title: 'Villes éligibles Loi Jeanbrun - Guide par zone fiscale',
  description:
    'Explorez les villes éligibles au dispositif Jeanbrun. Filtrez par zone fiscale (A, B1, B2) et découvrez les plafonds de loyer.',
}

interface PageProps {
  searchParams: {
    zone?: string
    region?: string
    q?: string
  }
}

export default async function VillesPage({ searchParams }: PageProps) {
  const where: object[] = []

  if (searchParams.zone) {
    where.push({
      type: 'equals',
      attribute: 'zoneFiscale',
      value: searchParams.zone,
    })
  }

  if (searchParams.region) {
    where.push({
      type: 'equals',
      attribute: 'region',
      value: searchParams.region,
    })
  }

  if (searchParams.q) {
    where.push({
      type: 'contains',
      attribute: 'name',
      value: searchParams.q,
    })
  }

  const { list: villes, total } = await espocrm.getVilles({
    where: where.length > 0 ? where : undefined,
    maxSize: 50,
    orderBy: 'name',
  })

  // Liste des régions pour le filtre
  const regions = [...new Set(villes.map((v) => v.region))].sort()

  return (
    <main className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold">
          Villes éligibles Loi Jeanbrun
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          {total} villes disponibles pour votre investissement défiscalisé
        </p>
      </header>

      {/* Filtres */}
      <VillesFilters
        currentZone={searchParams.zone}
        currentRegion={searchParams.region}
        currentQuery={searchParams.q}
        regions={regions}
      />

      {/* Grille de villes */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {villes.map((ville) => (
          <VilleCard key={ville.id} ville={ville} />
        ))}
      </div>

      {villes.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">
            Aucune ville trouvée avec ces critères.
          </p>
        </div>
      )}
    </main>
  )
}

export const revalidate = 86400 // 24h
```

---

### 3.13 SSG build 50 villes (1j)

**ID:** 4.13

**Configuration Next.js:**

```typescript
// next.config.ts
const nextConfig = {
  // ...
  experimental: {
    // Augmenter le timeout de build pour SSG
    staticPageGenerationTimeout: 120,
  },
}
```

**Commandes de build:**

```bash
# Build avec vérification des pages statiques
npm run build

# Vérifier le nombre de pages générées
find .next/server/app/villes -name "*.html" | wc -l
# Doit afficher: 50

# Vérifier la taille du build
du -sh .next/
```

**Vérification des performances:**

```bash
# Lighthouse CI
npx lighthouse https://simuler-loi-fiscale-jeanbrun.fr/villes/lyon \
  --output=html \
  --output-path=./lighthouse-report.html
```

---

## 4. Checklist de fin de sprint

### 4.1 Validations SEO

- [ ] 50 pages villes générées statiquement
- [ ] Données marché affichées correctement
- [ ] Plafonds Jeanbrun par zone calculés
- [ ] Simulateur pré-rempli fonctionnel
- [ ] Contenu unique par ville (400-600 mots)
- [ ] JSON-LD valide (Rich Results Test)
- [ ] Sitemap.xml complet (toutes URLs)
- [ ] robots.txt correct

### 4.2 Validations performance

- [ ] Core Web Vitals >= 90 mobile
- [ ] TTFB < 200ms (pages SSG)
- [ ] LCP < 2.5s
- [ ] CLS < 0.1

### 4.3 Validations techniques

- [ ] Build production OK en < 5 minutes
- [ ] ISR revalidation 24h configurée
- [ ] Maillage interne fonctionnel
- [ ] Index villes avec filtres

---

## 5. Ressources

| Ressource | URL |
|-----------|-----|
| Google Rich Results Test | https://search.google.com/test/rich-results |
| PageSpeed Insights | https://pagespeed.web.dev |
| Schema.org Place | https://schema.org/Place |
| Next.js SSG | https://nextjs.org/docs/app/building-your-application/data-fetching |

---

**Auteur:** Équipe Claude Code
**Date:** 30 janvier 2026
