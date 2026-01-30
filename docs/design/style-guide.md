# Guide de Style - Simulateur Loi Jeanbrun

**Version:** 1.0
**Date:** 30 janvier 2026
**Stack:** Next.js 16 + Tailwind CSS v4 + shadcn/ui

---

## 1. Philosophie Design

### 1.1 Principes Directeurs

| Principe | Description |
|----------|-------------|
| **Confiance** | Design professionnel inspirant la confiance pour un sujet financier sensible |
| **Clarté** | Informations complexes rendues accessibles grâce à une hiérarchie visuelle forte |
| **Modernité** | Esthétique dark mode premium, tendance SaaS/Fintech 2026 |
| **Conversion** | Focus sur les CTAs et le parcours utilisateur optimisé |

### 1.2 Références Design

- **Wireframe Jeanbrun** : Dark mode avec bordures dashed dorées, style technique/wireframe
- **simulation-pinel.fr** : Formulaire multi-étapes professionnel, cards de sélection épurées

---

## 2. Palette de Couleurs

### 2.1 Couleurs Principales (Dark Mode)

```
BACKGROUND
├── Background Primary    : #0A0A0B    (oklch(0.07 0 0))
├── Background Secondary  : #111113    (oklch(0.10 0.005 285))
└── Background Card       : #18181B    (oklch(0.14 0.005 285))

FOREGROUND
├── Text Primary          : #FAFAFA    (oklch(0.98 0 0))
├── Text Secondary        : #A1A1AA    (oklch(0.70 0.015 285))
└── Text Muted            : #71717A    (oklch(0.55 0.015 285))

ACCENT (Or/Jaune)
├── Accent Primary        : #F5A623    (oklch(0.78 0.18 75))
├── Accent Hover          : #FFB940    (oklch(0.82 0.16 80))
└── Accent Muted          : #F5A623/20 (rgba(245,166,35,0.2))

BORDER
├── Border Default        : #27272A    (oklch(0.22 0.005 285))
├── Border Dashed         : #F5A623/40 (rgba(245,166,35,0.4))
└── Border Focus          : #F5A623    (oklch(0.78 0.18 75))
```

### 2.2 Couleurs Sémantiques

```
SUCCESS (Vert)
├── Success Background    : #052E16    (oklch(0.20 0.08 145))
├── Success Border        : #22C55E    (oklch(0.72 0.20 145))
├── Success Text          : #86EFAC    (oklch(0.87 0.15 150))
└── Success Solid         : #22C55E    (oklch(0.72 0.20 145))

WARNING (Orange)
├── Warning Background    : #431407    (oklch(0.25 0.10 40))
├── Warning Border        : #F97316    (oklch(0.70 0.20 45))
├── Warning Text          : #FDBA74    (oklch(0.82 0.14 55))
└── Warning Solid         : #F97316    (oklch(0.70 0.20 45))

ERROR (Rouge)
├── Error Background      : #450A0A    (oklch(0.22 0.10 25))
├── Error Border          : #EF4444    (oklch(0.63 0.24 25))
├── Error Text            : #FCA5A5    (oklch(0.78 0.15 20))
└── Error Solid           : #EF4444    (oklch(0.63 0.24 25))

INFO (Bleu)
├── Info Background       : #0C1929    (oklch(0.15 0.05 250))
├── Info Border           : #3B82F6    (oklch(0.62 0.22 260))
├── Info Text             : #93C5FD    (oklch(0.82 0.12 255))
└── Info Solid            : #3B82F6    (oklch(0.62 0.22 260))
```

### 2.3 Couleurs Jauge Endettement

```
JAUGE ENDETTEMENT
├── Safe (< 30%)          : #22C55E    (Vert)
├── Warning (30-35%)      : #F97316    (Orange)
└── Danger (> 35%)        : #EF4444    (Rouge)
```

---

## 3. Typographie

### 3.1 Police Principale

**Font Family:** `Inter` (Google Fonts) ou system-ui fallback

```css
font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
```

### 3.2 Échelle Typographique

| Niveau | Taille | Line Height | Weight | Usage |
|--------|--------|-------------|--------|-------|
| `display-1` | 48px (3rem) | 1.1 | 700 | Hero title |
| `display-2` | 36px (2.25rem) | 1.2 | 700 | Section titles |
| `h1` | 30px (1.875rem) | 1.3 | 600 | Page titles |
| `h2` | 24px (1.5rem) | 1.35 | 600 | Card titles |
| `h3` | 20px (1.25rem) | 1.4 | 600 | Subsection titles |
| `h4` | 18px (1.125rem) | 1.4 | 500 | Small headings |
| `body-lg` | 18px (1.125rem) | 1.6 | 400 | Lead paragraphs |
| `body` | 16px (1rem) | 1.5 | 400 | Body text |
| `body-sm` | 14px (0.875rem) | 1.5 | 400 | Secondary text |
| `caption` | 12px (0.75rem) | 1.4 | 400 | Labels, captions |

### 3.3 Styles Spéciaux

```css
/* Titres en uppercase (style wireframe) */
.title-uppercase {
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Accent doré pour mise en valeur */
.text-accent {
  color: #F5A623;
}

/* Texte monospace pour les chiffres */
.font-mono {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-variant-numeric: tabular-nums;
}
```

---

## 4. Espacement

### 4.1 Échelle d'Espacement

```
SPACING SCALE (base: 4px)
├── space-0   : 0px
├── space-1   : 4px    (0.25rem)
├── space-2   : 8px    (0.5rem)
├── space-3   : 12px   (0.75rem)
├── space-4   : 16px   (1rem)
├── space-5   : 20px   (1.25rem)
├── space-6   : 24px   (1.5rem)
├── space-8   : 32px   (2rem)
├── space-10  : 40px   (2.5rem)
├── space-12  : 48px   (3rem)
├── space-16  : 64px   (4rem)
├── space-20  : 80px   (5rem)
└── space-24  : 96px   (6rem)
```

### 4.2 Layout Spacing

| Élément | Desktop | Mobile |
|---------|---------|--------|
| Container max-width | 1280px | 100% |
| Container padding | 32px | 16px |
| Section gap | 64px | 40px |
| Card padding | 24px | 16px |
| Form gap | 24px | 16px |
| Input gap | 16px | 12px |

---

## 5. Rayons de Bordure

```
BORDER RADIUS
├── radius-none : 0px
├── radius-sm   : 4px    (inputs petits)
├── radius-md   : 6px    (badges, tags)
├── radius-lg   : 8px    (cards, modals) - DEFAULT
├── radius-xl   : 12px   (cards importantes)
├── radius-2xl  : 16px   (hero sections)
└── radius-full : 9999px (avatars, pills)
```

---

## 6. Ombres

### 6.1 Ombres Dark Mode

```css
/* Ombre subtile pour cards */
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.4);

/* Ombre moyenne pour dropdowns */
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.5);

/* Ombre forte pour modals */
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.6);

/* Ombre XL pour éléments flottants */
--shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.7);

/* Glow doré pour CTAs */
--shadow-glow: 0 0 20px rgba(245, 166, 35, 0.3);
```

---

## 7. Bordures Spéciales (Style Wireframe)

### 7.1 Bordure Dashed Dorée

Le style signature du wireframe de référence : bordures en pointillés avec couleur dorée.

```css
/* Bordure dashed pour sections importantes */
.border-dashed-gold {
  border: 1px dashed rgba(245, 166, 35, 0.4);
}

/* Double bordure pour emphasis */
.border-double-gold {
  border: 2px dashed rgba(245, 166, 35, 0.5);
  padding: 2px;
  background: linear-gradient(135deg, rgba(245,166,35,0.05) 0%, transparent 100%);
}

/* Corner accents (style wireframe technique) */
.corner-accents {
  position: relative;
}
.corner-accents::before,
.corner-accents::after {
  content: '';
  position: absolute;
  width: 12px;
  height: 12px;
  border-color: rgba(245, 166, 35, 0.6);
}
.corner-accents::before {
  top: -1px;
  left: -1px;
  border-top: 2px solid;
  border-left: 2px solid;
}
.corner-accents::after {
  bottom: -1px;
  right: -1px;
  border-bottom: 2px solid;
  border-right: 2px solid;
}
```

---

## 8. Breakpoints Responsive

```
BREAKPOINTS
├── mobile    : < 640px    (sm)
├── tablet    : 640-1024px (md)
├── desktop   : 1024-1440px (lg)
└── large     : > 1440px   (xl)
```

### 8.1 Comportement Mobile

| Élément | Desktop | Mobile |
|---------|---------|--------|
| Navigation | Header sticky | Menu hamburger |
| Cards options | 2-3 colonnes | 1 colonne empilée |
| Graphiques | 12 points | 4 points (An 1,5,9,12) |
| Tableaux | Colonnes | Cards/Onglets swipables |
| Progress bar | Labels visibles | Dots uniquement |
| Boutons navigation | Côte à côte | Pleine largeur empilés |

---

## 9. États Interactifs

### 9.1 États des Boutons

```
BUTTON STATES
├── Default   : bg-accent, text-background
├── Hover     : bg-accent-hover, shadow-glow
├── Active    : bg-accent, scale(0.98)
├── Focus     : ring-2 ring-accent ring-offset-2
└── Disabled  : opacity-50, cursor-not-allowed
```

### 9.2 États des Inputs

```
INPUT STATES
├── Default   : border-border, bg-background
├── Hover     : border-muted-foreground
├── Focus     : border-accent, ring-1 ring-accent
├── Error     : border-error, ring-1 ring-error
└── Disabled  : opacity-50, bg-muted
```

### 9.3 États des Cards Options

```
CARD OPTION STATES
├── Default   : border-border, bg-card
├── Hover     : border-accent/50, bg-card
├── Selected  : border-accent, bg-accent/10, border-2
└── Disabled  : opacity-50
```

---

## 10. Iconographie

### 10.1 Bibliothèque

**Lucide React** - Icônes cohérentes et légères

### 10.2 Tailles Standard

| Taille | Pixels | Usage |
|--------|--------|-------|
| `xs` | 12px | Inline avec texte caption |
| `sm` | 16px | Inline avec texte body |
| `md` | 20px | Default, boutons |
| `lg` | 24px | Titres, navigation |
| `xl` | 32px | Hero, cards grandes |
| `2xl` | 48px | Illustrations |

### 10.3 Icônes Métier

| Concept | Icône |
|---------|-------|
| Économie impôt | `TrendingUp`, `PiggyBank` |
| Investissement | `Building2`, `Home` |
| Financement | `Wallet`, `CreditCard` |
| Éligibilité OK | `CheckCircle2` |
| Alerte | `AlertTriangle` |
| Info | `Info`, `HelpCircle` |
| Navigation | `ArrowLeft`, `ArrowRight`, `ChevronDown` |
| Téléphone | `Phone` |
| Email | `Mail` |
| Sécurité | `Lock`, `Shield` |

---

## 11. Animation et Transitions

### 11.1 Durées Standard

```
TRANSITION DURATIONS
├── instant   : 0ms      (feedback immédiat)
├── fast      : 100ms    (hover, focus)
├── normal    : 200ms    (transitions UI)
├── slow      : 300ms    (modals, panels)
└── slower    : 500ms    (animations complexes)
```

### 11.2 Easing

```css
/* Easing standard */
--ease-default: cubic-bezier(0.4, 0, 0.2, 1);

/* Easing pour entrées */
--ease-in: cubic-bezier(0.4, 0, 1, 1);

/* Easing pour sorties */
--ease-out: cubic-bezier(0, 0, 0.2, 1);

/* Easing bounce */
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

### 11.3 Transitions Recommandées

```css
/* Boutons */
.btn {
  transition: all 200ms var(--ease-default);
}

/* Cards */
.card {
  transition: border-color 200ms, box-shadow 200ms;
}

/* Inputs */
.input {
  transition: border-color 150ms, box-shadow 150ms;
}

/* Progress bar */
.progress-fill {
  transition: width 300ms var(--ease-out);
}
```

---

## 12. Accessibilité

### 12.1 Contraste Minimum

- **Texte normal** : Ratio 4.5:1 minimum (WCAG AA)
- **Texte large** : Ratio 3:1 minimum
- **Éléments UI** : Ratio 3:1 minimum

### 12.2 Focus Visible

```css
/* Focus ring visible pour accessibilité clavier */
:focus-visible {
  outline: none;
  ring: 2px solid var(--accent);
  ring-offset: 2px;
  ring-offset-color: var(--background);
}
```

### 12.3 Touch Targets

- **Minimum** : 44px × 44px pour tous les éléments interactifs sur mobile

---

## 13. Motifs Visuels Signature

### 13.1 Grid Background (optionnel)

```css
/* Grille subtile style wireframe */
.grid-background {
  background-image:
    linear-gradient(rgba(245,166,35,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(245,166,35,0.03) 1px, transparent 1px);
  background-size: 40px 40px;
}
```

### 13.2 Glow Effect pour CTAs

```css
/* Effet glow sur les boutons principaux */
.btn-glow {
  box-shadow: 0 0 20px rgba(245, 166, 35, 0.3);
}
.btn-glow:hover {
  box-shadow: 0 0 30px rgba(245, 166, 35, 0.5);
}
```

---

## Changelog

| Version | Date | Modifications |
|---------|------|---------------|
| 1.0 | 30/01/2026 | Version initiale basée sur wireframes et références |
