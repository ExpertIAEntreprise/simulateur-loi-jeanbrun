# Composants Étapes 3 et 4 - Simulateur Loi Jeanbrun

**Date de création** : 2 février 2026
**Version** : 1.0.0

## Vue d'ensemble

Deux nouveaux composants UI créés pour le simulateur Loi Jeanbrun avec Tailwind CSS v4 et shadcn/ui.

## Fichiers créés

### Composants

| Fichier | Description | Taille | Lignes |
|---------|-------------|--------|--------|
| `src/components/simulateur/etape-3/DiffereSelector.tsx` | Sélection différé de remboursement | ~3.5 KB | 127 |
| `src/components/simulateur/etape-3/index.ts` | Exports étape 3 | ~200 B | 3 |
| `src/components/simulateur/etape-4/NiveauLoyerCards.tsx` | Sélection niveau de loyer | ~8 KB | 265 |
| `src/components/simulateur/etape-4/index.ts` | Exports étape 4 | ~250 B | 8 |

### Preview Pages

| Fichier | URL | Description |
|---------|-----|-------------|
| `src/app/preview/differe/page.tsx` | `/preview/differe` | Test DiffereSelector |
| `src/app/preview/niveau-loyer/page.tsx` | `/preview/niveau-loyer` | Test NiveauLoyerCards |

### Documentation

| Fichier | Contenu |
|---------|---------|
| `docs/components/DIFFERE-SELECTOR.md` | Doc technique DiffereSelector |
| `docs/components/NIVEAU-LOYER-CARDS.md` | Doc technique NiveauLoyerCards |

## Caractéristiques Techniques

### Design System

```css
/* Accent color */
--color-accent: oklch(0.78 0.18 75); /* #F5A623 */

/* States */
.selected {
  border: 2px solid var(--color-accent);
  background: oklch(0.78 0.18 75 / 0.1);
  box-shadow: 0 0 20px oklch(0.78 0.18 75 / 0.3);
}

.hover {
  scale: 1.02;
  transition: 300ms ease-out;
}
```

### Stack Technique

- **React 19** : "use client" components
- **TypeScript** : Strict mode (exactOptionalPropertyTypes)
- **Tailwind CSS v4** : Utility-first styling
- **shadcn/ui** : Select, Badge components
- **Lucide Icons** : Clock, Home, Users, Heart, Info

## DiffereSelector (C.3)

### Signature

```typescript
interface DiffereSelectorProps {
  value?: 0 | 12 | 24
  onChange: (value: 0 | 12 | 24) => void
  typeBien?: "neuf" | "ancien"
  className?: string
}
```

### Pattern utilisé

- **Select shadcn/ui** : Radix UI Select primitive
- **Message contextuel** : Adapté au type de bien
- **Tooltip explicatif** : Question mark icon

### Options

| Valeur | Label |
|--------|-------|
| 0 | Sans différé |
| 12 | 12 mois (VEFA standard) |
| 24 | 24 mois (grosse construction) |

## NiveauLoyerCards (C.5)

### Signature

```typescript
interface NiveauLoyerCardsProps {
  value?: NiveauLoyer
  onChange: (value: NiveauLoyer) => void
  zoneFiscale?: "A_bis" | "A" | "B1" | "B2" | "C"
  surface?: number
  className?: string
}

type NiveauLoyer =
  | "loyer_intermediaire"
  | "loyer_social"
  | "loyer_tres_social"
```

### Pattern utilisé

- **Cards custom** : Button + div (pattern TypeBienSelector)
- **Radio indicator** : Top-right corner
- **Badge "Recommandé"** : Sur Intermédiaire
- **Calcul dynamique** : Loyer max selon zone + surface

### Formules Loi Jeanbrun

```typescript
// Coefficient de surface (plafonné à 1.2)
coeffSurface = 0.7 + (19 / surface)

// Loyer maximum mensuel
loyerMax = plafondBase × modificateur × coeffSurface × surface
```

| Niveau | Taux Amortissement | Durée | Modificateur |
|--------|-------------------|-------|--------------|
| Intermédiaire | 21% | 12 ans | 1.0 |
| Social | 23% | 12 ans | 0.8 (-20%) |
| Très Social | 26% | 12 ans | 0.6 (-40%) |

### Plafonds par zone

| Zone | €/m² |
|------|------|
| A bis | 18.89 |
| A | 14.03 |
| B1 | 11.31 |
| B2 | 9.83 |
| C | 8.61 |

## Patterns de Référence

### TypeBienSelector (Étape 2)

- Cards cliquables avec radio indicator
- Hover scale(1.02)
- Selected : border-accent + bg-accent/5 + shadow-glow
- Icon centré avec background circulaire

### ObjectifSelector (Étape 1)

- shadcn/ui Card component
- Grid responsive (1 col → 2 cols)
- Icon + label + description
- transition-all duration-200

## Testing

### Preview URLs

Démarrer le serveur de dev :

```bash
cd /root/simulateur_loi_Jeanbrun
pnpm dev
```

Puis visiter :

- **DiffereSelector** : http://localhost:3000/preview/differe
- **NiveauLoyerCards** : http://localhost:3000/preview/niveau-loyer

### Controls disponibles

#### DiffereSelector Preview
- Switch type de bien (neuf/ancien)
- Visualisation JSON de l'état

#### NiveauLoyerCards Preview
- Select zone fiscale (A bis → C)
- Input surface (9-200 m²)
- Calcul temps réel du loyer max
- Visualisation JSON de l'état

## Commandes Utiles

```bash
# Type checking
pnpm typecheck

# Linting
pnpm lint

# Build production
pnpm build:ci

# Format code
pnpm format
```

## Intégration Future

Ces composants sont prêts à être intégrés dans le wizard multi-étapes :

### Étape 3 - Financement

```tsx
import { DiffereSelector } from "@/components/simulateur/etape-3"

function Etape3() {
  const { data, updateData } = useWizardContext()

  return (
    <DiffereSelector
      value={data.differe}
      onChange={(value) => updateData({ differe: value })}
      typeBien={data.typeBien}
    />
  )
}
```

### Étape 4 - Loyer

```tsx
import { NiveauLoyerCards } from "@/components/simulateur/etape-4"

function Etape4() {
  const { data, updateData } = useWizardContext()

  return (
    <NiveauLoyerCards
      value={data.niveauLoyer}
      onChange={(value) => updateData({ niveauLoyer: value })}
      zoneFiscale={data.zoneFiscale}
      surface={data.surface}
    />
  )
}
```

## Accessibilité

### DiffereSelector

- ✅ Label lié au select via `id`
- ✅ `role="alert"` sur info contextuelle
- ✅ Placeholder descriptif
- ✅ Focus visible avec ring

### NiveauLoyerCards

- ✅ `aria-pressed` sur les cards
- ✅ `focus-visible:ring-2` pour clavier
- ✅ Texte tabulaire pour montants
- ✅ Transitions smooth (300ms ease-out)

## Performance

- **0 dépendances externes** (sauf shadcn/ui et lucide)
- **Tree-shakeable** : Exports nommés
- **Memoization** : Calculs loyer non recalculés si props inchangées
- **Lazy loading** : Components peuvent être lazy-loaded

## Notes de Développement

### TypeScript Strict Mode

Le mode `exactOptionalPropertyTypes: true` impose :

```typescript
// ❌ ERREUR : value peut être undefined
<Select value={value?.toString()} />

// ✅ CORRECT : valeur par défaut
function Component({ value = 0 }: Props) {
  return <Select value={value.toString()} />
}
```

### Imports

```typescript
// shadcn/ui
import { Select, SelectContent, ... } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

// Utils
import { cn } from "@/lib/utils"

// Icons
import { Clock, Info, Home, Users, Heart } from "lucide-react"
```

## Maintenance

### Mise à jour des plafonds de loyer

Si les plafonds de loyer Jeanbrun changent, modifier la constante dans `NiveauLoyerCards.tsx` :

```typescript
const PLAFONDS_LOYER_M2: Record<ZoneFiscale, number> = {
  A_bis: 18.89,  // ← Modifier ici
  A: 14.03,
  B1: 11.31,
  B2: 9.83,
  C: 8.61,
}
```

### Modification des taux d'amortissement

Modifier dans le tableau `OPTIONS` :

```typescript
{
  id: "loyer_intermediaire",
  tauxAmortissement: 21,  // ← Modifier ici
  dureeAmortissement: 12,
  // ...
}
```

## Liens Utiles

- **Shadcn UI** : https://ui.shadcn.com
- **Tailwind CSS v4** : https://tailwindcss.com/blog/tailwindcss-v4-beta
- **Lucide Icons** : https://lucide.dev
- **Loi Jeanbrun** : PLF 2026, dispositif LMNP

---

**Auteur** : Claude Code (Sonnet 4.5)
**Projet** : Simulateur Loi Jeanbrun
**Repository** : https://github.com/ExpertIAEntreprise/simulateur-loi-jeanbrun
