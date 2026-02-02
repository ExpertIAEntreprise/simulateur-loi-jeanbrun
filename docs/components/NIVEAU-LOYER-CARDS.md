# NiveauLoyerCards Component

**Chemin:** `src/components/simulateur/etape-4/NiveauLoyerCards.tsx`

## Description

Composant de sélection du niveau de loyer pour la Loi Jeanbrun. Affiche 3 cards représentant les 3 niveaux de loyer avec leurs plafonds et taux d'amortissement respectifs.

## Props

```typescript
interface NiveauLoyerCardsProps {
  value?: NiveauLoyer                      // Niveau sélectionné
  onChange: (value: NiveauLoyer) => void   // Callback de changement
  zoneFiscale?: "A_bis" | "A" | "B1" | "B2" | "C"  // Zone fiscale
  surface?: number                         // Surface du bien (m²)
  className?: string                       // Classes CSS additionnelles
}

type NiveauLoyer = "loyer_intermediaire" | "loyer_social" | "loyer_tres_social"
```

## Les 3 Niveaux de Loyer

### 1. Intermédiaire (Recommandé)

- **Taux amortissement** : 21% sur 12 ans
- **Plafond loyer** : 100% du plafond de base
- **Description** : "Loyer proche du marché"
- **Icône** : Home
- **Badge** : "Recommandé"

### 2. Social

- **Taux amortissement** : 23% sur 12 ans
- **Plafond loyer** : -20% vs Intermédiaire
- **Description** : "Impact social + bonus fiscal"
- **Icône** : Users

### 3. Très Social

- **Taux amortissement** : 26% sur 12 ans
- **Plafond loyer** : -40% vs Intermédiaire
- **Description** : "Maximum avantage fiscal"
- **Icône** : Heart

## Plafonds de Loyer par Zone Fiscale

| Zone | Plafond de base (€/m²) |
|------|------------------------|
| A bis | 18.89 |
| A | 14.03 |
| B1 | 11.31 |
| B2 | 9.83 |
| C | 8.61 |

## Calcul du Loyer Maximum

Le loyer maximum mensuel est calculé selon la formule :

```typescript
loyerMax = plafondBase × modificateur × coeffSurface × surface

// Coefficient de surface (plafonné à 1.2)
coeffSurface = 0.7 + (19 / surface)
```

**Modificateurs** :
- Intermédiaire : 1.0
- Social : 0.8 (-20%)
- Très Social : 0.6 (-40%)

## Fonctionnalités

- **Calcul automatique** : Loyer max affiché si zone fiscale et surface renseignés
- **Cards cliquables** : Hover scale(1.02), selected avec border-accent
- **Radio indicator** : Indicateur de sélection en haut à droite
- **Badge recommandé** : Sur "Intermédiaire"
- **Info zone fiscale** : Card info avec plafond de base

## Exemple d'utilisation

```tsx
import { NiveauLoyerCards, type NiveauLoyer } from "@/components/simulateur/etape-4"

function LoyerStep() {
  const [niveau, setNiveau] = useState<NiveauLoyer>("loyer_intermediaire")
  const zoneFiscale = "B1"
  const surface = 50

  return (
    <NiveauLoyerCards
      value={niveau}
      onChange={setNiveau}
      zoneFiscale={zoneFiscale}
      surface={surface}
    />
  )
}
```

## Design

### Card States

- **Default** : border-border, bg-card, hover:border-accent/50
- **Selected** : border-accent, bg-accent/10, shadow-glow
- **Hover** : scale-[1.02], transition 300ms ease-out

### Layout

- **Grid** : 1 col mobile, 3 cols desktop (md:grid-cols-3)
- **Min height** : 240px
- **Padding** : p-6
- **Gap** : gap-4

### Colors

- **Accent** : #F5A623 (oklch(0.78 0.18 75))
- **Info background** : bg-info-subtle
- **Border selected** : border-accent (2px)

## Accessibilité

- `aria-pressed` sur les cards
- `focus-visible:ring-2` pour navigation clavier
- Texte tabulaire (`tabular-nums`) pour les montants

## États Conditionnels

### Sans zone fiscale ou surface
Message : "Renseignez la zone fiscale et la surface pour voir les loyers maximums"

### Avec zone fiscale
Info card : "Zone fiscale X - Plafond de base : Y €/m²"

### Loyer max calculable
Affiche dans chaque card : "Loyer max : XXX €/mois"
