# DiffereSelector Component

**Chemin:** `src/components/simulateur/etape-3/DiffereSelector.tsx`

## Description

Composant de sélection du différé de remboursement pour un crédit immobilier. Permet de choisir entre 0, 12 ou 24 mois de différé.

## Props

```typescript
interface DiffereSelectorProps {
  value?: 0 | 12 | 24          // Valeur sélectionnée (défaut: 0)
  onChange: (value: 0 | 12 | 24) => void  // Callback de changement
  typeBien?: "neuf" | "ancien"  // Type de bien (affecte le message contextuel)
  className?: string            // Classes CSS additionnelles
}
```

## Fonctionnalités

- **Select shadcn/ui** : Dropdown élégant avec 3 options
- **Message contextuel** : Adapté selon le type de bien (neuf/ancien)
- **Tooltip explicatif** : Icône "?" avec explication détaillée
- **Valeur par défaut** : 0 mois (sans différé)

## Options

| Valeur | Label | Cas d'usage |
|--------|-------|-------------|
| 0 | Sans différé | Remboursement immédiat |
| 12 | 12 mois (VEFA standard) | Construction neuve standard |
| 24 | 24 mois (grosse construction) | Gros chantiers ou travaux lourds |

## Messages Contextuels

### Bien Neuf
> "Le différé permet de ne pas payer le crédit pendant la construction"

### Bien Ancien
> "Pour les travaux importants, un différé peut être négocié"

## Exemple d'utilisation

```tsx
import { DiffereSelector } from "@/components/simulateur/etape-3"

function FinancementStep() {
  const [differe, setDiffere] = useState<0 | 12 | 24>(0)
  const [typeBien, setTypeBien] = useState<"neuf" | "ancien">("neuf")

  return (
    <DiffereSelector
      value={differe}
      onChange={setDiffere}
      typeBien={typeBien}
    />
  )
}
```

## Design

- **Label** : Clock icon + "Différé de remboursement"
- **Select** : Height 12 (48px), border-2, focus:accent
- **Info contextuelle** : Card avec Info icon, bg-info-subtle
- **Tooltip** : Question mark icon avec explication du différé

## Accessibilité

- `id="differe-select"` pour lier label et select
- `role="alert"` sur l'info contextuelle
- Placeholder descriptif
