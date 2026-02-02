# Design System V2 - Simulateur Loi Jeanbrun

**Version:** 2.0
**Date:** 01 fevrier 2026
**Base sur:** Analyse de 4 sites de defiscalisation (la-loi-pinel.com, loi-pinel.fr, la-loi-denormandie.immo, loipinel.fr)

---

## Table des Matieres

1. [Analyse Concurrentielle](#1-analyse-concurrentielle)
2. [Positionnement Visuel](#2-positionnement-visuel)
3. [Palette de Couleurs](#3-palette-de-couleurs)
4. [Typographie Distinctive](#4-typographie-distinctive)
5. [Composants Cles](#5-composants-cles)
6. [Motion Design](#6-motion-design)
7. [Recommandations Shadcn Studio](#7-recommandations-shadcn-studio)
8. [Guidelines Anti-Generique](#8-guidelines-anti-generique)

---

## 1. Analyse Concurrentielle

### Synthese des 4 Sites Analyses

| Site | Palette | Points Forts | Points Faibles |
|------|---------|--------------|----------------|
| **la-loi-pinel.com** | Bleu marine + Rouge | Institutionnel, trust signals forts | Generique, peu memorable |
| **loi-pinel.fr** | Orange + Bleu ciel | Dynamique, formulaire fluide | Couleurs trop vives, fatiguant |
| **la-loi-denormandie.immo** | Bleu + Rouge | Premium, tableaux clairs | Trop classique |
| **loipinel.fr** | Vert + Blanc + Gris | Modern, epure | Manque de personnalite |

### Patterns UI Performants (a adopter)

| Pattern | Taux d'adoption | Implementation Jeanbrun |
|---------|-----------------|------------------------|
| Hero avec simulateur integre | 100% | Hero + CTA "Simuler maintenant" |
| Compteur utilisateurs anime | 75% | "X simulations realisees" |
| Barre de confiance (4 items) | 100% | Trust Signals sous le hero |
| Formulaire 4-6 etapes | 100% | 6 etapes avec progress bar |
| FAQ accordeon | 100% | FAQ avec recherche |
| Rating + avis | 75% | Notation Trustpilot-style |
| Garanties visibles | 100% | "Gratuit, Sans CB, 2 min" |

### Elements de Confiance Observes

```
Compteurs:
- "41 574 tests realises" (la-loi-pinel.com)
- "Plus de 10 000 investisseurs accompagnes" (loi-pinel.fr)

Ratings:
- "4.9/5 (1799 avis)" avec etoiles
- Google Reviews integre

Logos autorite:
- Ministere du Logement
- Service-Public.fr
- LCI, Le Figaro (mentions presse)
- ORIAS, CNCIF (certifications)

Garanties:
- "Gratuit et sans engagement"
- "Resultat en 30 secondes"
- "Conseiller dedie"
```

---

## 2. Positionnement Visuel

### Notre Differentiation

Le design system Jeanbrun se distingue par:

| Critere | Concurrence | Jeanbrun |
|---------|-------------|----------|
| **Mode** | Light mode classique | **Dark mode premium** |
| **Accent** | Bleu/Rouge institutionnel | **Or patrimonial** |
| **Style** | Corporate generique | **Wireframe technique** |
| **Ambiance** | Assurance/Banque | **Fintech/Patrimoine** |
| **Emotion** | Securite froide | **Confiance + Modernite** |

### Persona Visuel

> "Un simulateur qui ressemble a une application de gestion de patrimoine haut de gamme,
> pas a un formulaire administratif."

**References visuelles:**
- Mercury (banking app)
- Linear (SaaS premium)
- Stripe Dashboard

---

## 3. Palette de Couleurs

### 3.1 Core Palette (inchangee)

```
DARK MODE - FONDATION
=====================
Background Primary    : oklch(0.07 0 0)        #0A0A0B
Background Secondary  : oklch(0.10 0.005 285)  #111113
Card                 : oklch(0.14 0.005 285)  #18181B

Text Primary         : oklch(0.98 0 0)        #FAFAFA
Text Secondary       : oklch(0.70 0.015 285)  #A1A1AA
Text Muted           : oklch(0.55 0.015 285)  #71717A

ACCENT (OR)
===========
Accent Primary       : oklch(0.78 0.18 75)    #F5A623
Accent Hover         : oklch(0.82 0.16 80)    #FFB940
Accent Muted         : oklch(0.78 0.18 75 / 0.2)
```

### 3.2 Extension V2 - Trust Colors

```
TRUST (BLEU INSTITUTIONNEL)
===========================
Trust Primary        : oklch(0.55 0.18 250)   Bleu profond
Trust Light          : oklch(0.70 0.14 250)   Bleu clair
Trust Background     : oklch(0.12 0.04 250)   Fond bleu sombre

Usage: Certifications, mentions legales, badges autorite
```

### 3.3 Extension V2 - Highlight Colors

```
HIGHLIGHT (RESULTATS)
=====================
Highlight Economy    : oklch(0.75 0.22 145)   Vert vif economies
Highlight Gain       : oklch(0.80 0.20 75)    Or brillant gains
Highlight Premium    : oklch(0.70 0.15 300)   Violet premium

Usage: Montants d'economie, gains affiches, badges premium
```

### 3.4 Brand-Tinted Neutrals

Les gris teintes avec la hue de l'accent (75 - or) pour une cohesion subtile:

```
Neutral Scale (hue 75)
======================
neutral-50   : oklch(0.98 0.005 75)
neutral-100  : oklch(0.96 0.008 75)
neutral-200  : oklch(0.90 0.010 75)
neutral-300  : oklch(0.80 0.012 75)
neutral-400  : oklch(0.65 0.015 75)
neutral-500  : oklch(0.50 0.015 75)
neutral-600  : oklch(0.40 0.012 75)
neutral-700  : oklch(0.30 0.010 75)
neutral-800  : oklch(0.20 0.008 75)
neutral-900  : oklch(0.12 0.006 75)
```

### 3.5 Contraste WCAG

Tous les ratios de contraste verifies:

| Combinaison | Ratio | Conformite |
|-------------|-------|------------|
| Text Primary sur Background | 18.5:1 | AAA |
| Text Secondary sur Background | 7.2:1 | AAA |
| Accent sur Background | 8.1:1 | AAA |
| Accent Foreground sur Accent | 9.3:1 | AAA |

---

## 4. Typographie Distinctive

### 4.1 Choix Strategiques

| Role | Police | Justification |
|------|--------|---------------|
| **Display/Titres** | DM Serif Display | Gravite juridique, distinction |
| **Corps** | Inter Variable | Lisibilite, chiffres alignes |
| **Mono** | JetBrains Mono | Montants, codes |

**Pourquoi DM Serif Display?**
- Serif moderne sans etre old-school
- Excellent rendu en grand
- Gratuite (Google Fonts)
- Evoque le patrimoine sans etre bancaire

**Alternative:** Fraunces (plus expressive) ou Newsreader (plus sobre)

### 4.2 Echelle Typographique Fluide

```css
--text-display-1: clamp(2.5rem, 5vw + 1rem, 4rem);    /* Hero */
--text-display-2: clamp(2rem, 4vw + 0.5rem, 3rem);    /* Section */
--text-h1: clamp(1.75rem, 3vw + 0.5rem, 2.5rem);
--text-h2: clamp(1.5rem, 2.5vw + 0.25rem, 2rem);
--text-h3: clamp(1.25rem, 2vw + 0.25rem, 1.5rem);
--text-h4: clamp(1.125rem, 1.5vw + 0.25rem, 1.25rem);
```

### 4.3 Styles Signature

```css
/* Titre hero - serif + tracking tight */
.title-hero {
  font-family: var(--font-display);
  font-size: var(--text-display-1);
  line-height: var(--leading-display);
  letter-spacing: var(--tracking-tight);
}

/* Montant economie - mono + accent */
.amount-highlight {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  color: var(--highlight-economy);
}

/* Label uppercase */
.label-uppercase {
  font-family: var(--font-sans);
  font-size: var(--text-caption);
  text-transform: uppercase;
  letter-spacing: var(--tracking-widest);
  color: var(--muted-foreground);
}
```

---

## 5. Composants Cles

### 5.1 Trust Signals Bar

**Structure:**
```tsx
<div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6">
  {trustSignals.map((signal) => (
    <TrustSignalCard
      key={signal.id}
      icon={signal.icon}
      value={signal.value}
      label={signal.label}
    />
  ))}
</div>
```

**Donnees:**
```ts
const trustSignals = [
  { icon: <Trophy />, value: "N°1", label: "Simulateur Jeanbrun" },
  { icon: <Lock />, value: "100%", label: "Gratuit sans CB" },
  { icon: <Zap />, value: "2 min", label: "Resultat immediat" },
  { icon: <Shield />, value: "CGP", label: "Valide par experts" },
]
```

### 5.2 Compteur Anime

**Implementation avec Framer Motion:**
```tsx
import { useInView, useSpring, useTransform, motion } from "framer-motion"

function AnimatedCounter({ target, duration = 2 }: Props) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  const spring = useSpring(0, { duration: duration * 1000 })
  const display = useTransform(spring, (v) => Math.round(v).toLocaleString("fr-FR"))

  useEffect(() => {
    if (isInView) spring.set(target)
  }, [isInView, spring, target])

  return <motion.span ref={ref}>{display}</motion.span>
}
```

### 5.3 Progress Bar Multi-Etapes

**Structure:**
```tsx
<div className="flex items-center justify-between w-full">
  {steps.map((step, index) => (
    <Fragment key={step.id}>
      {/* Dot */}
      <div className={cn(
        "step-dot",
        index < currentStep && "step-dot--completed",
        index === currentStep && "step-dot--current",
        index > currentStep && "step-dot--upcoming"
      )} />

      {/* Line (sauf dernier) */}
      {index < steps.length - 1 && (
        <div className={cn(
          "step-line",
          index < currentStep ? "step-line--active" : "step-line--inactive"
        )} />
      )}
    </Fragment>
  ))}
</div>
```

### 5.4 Card Resultat avec Highlight

**Structure:**
```tsx
<Card className="p-6 relative overflow-hidden">
  {/* Glow background subtil */}
  <div className="absolute inset-0 bg-gradient-to-br from-success/5 to-transparent" />

  <div className="relative">
    <p className="text-sm text-muted-foreground mb-2">{label}</p>
    <p className="text-4xl font-bold text-highlight-economy tabular-nums">
      {formatCurrency(value)}
    </p>
    <p className="text-xs text-muted-foreground mt-2">{description}</p>
  </div>

  {/* Badge coin */}
  <Badge className="absolute top-4 right-4" variant="outline">
    {badge}
  </Badge>
</Card>
```

### 5.5 FAQ Accordeon

**Implementation:**
```tsx
<Accordion type="single" collapsible className="space-y-4">
  {faqs.map((faq) => (
    <AccordionItem
      key={faq.id}
      value={faq.id}
      className="border border-dashed border-accent/30 rounded-lg px-6"
    >
      <AccordionTrigger className="py-4 text-left">
        <span className="font-medium">{faq.question}</span>
      </AccordionTrigger>
      <AccordionContent className="pb-4 text-muted-foreground">
        {faq.answer}
      </AccordionContent>
    </AccordionItem>
  ))}
</Accordion>
```

---

## 6. Motion Design

### 6.1 Philosophie

| Principe | Application |
|----------|-------------|
| **Orchestration** | Entrees en sequence, pas simultanees |
| **Feedback** | Chaque interaction a une reponse |
| **Subtilite** | Animations courtes (200-500ms) |
| **Accessibilite** | Respect `prefers-reduced-motion` |

### 6.2 Animations Standard

**Entree de page:**
```tsx
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
}
```

**Hover CTA:**
```tsx
const buttonVariants = {
  rest: { scale: 1 },
  hover: {
    scale: 1.02,
    boxShadow: "0 0 30px oklch(0.78 0.18 75 / 0.4)",
    transition: { duration: 0.2 },
  },
  tap: { scale: 0.98 },
}
```

**Transition d'etape:**
```tsx
const stepTransition = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
  transition: { duration: 0.3, ease: "easeInOut" },
}
```

### 6.3 Micro-interactions

| Element | Animation | Duree |
|---------|-----------|-------|
| Button hover | scale(1.02) + glow | 200ms |
| Button click | scale(0.98) | 100ms |
| Card hover | translateY(-2px) + shadow | 200ms |
| Input focus | border glow | 150ms |
| Toggle | spring | 300ms |
| Progress fill | width transition | 300ms |
| Number count | spring count-up | 2000ms |

---

## 7. Recommandations Shadcn Studio

### 7.1 Blocks a Reutiliser

| Block | Usage | Personnalisation |
|-------|-------|------------------|
| `hero-section-23` | Hero principal | Remplacer textes + CTAs |
| `pricing-component-20` | Page resultats | Adapter pour Free/Premium |
| `faq-component-12` | FAQ | Changer questions |
| `footer-component-01` | Footer | Liens + mentions legales |
| `features-section-23` | Process etapes | 6 etapes simulateur |

### 7.2 Composants UI a Utiliser

```bash
# Deja installes (probablement)
button, card, badge, input, select, slider, progress

# A ajouter
npx shadcn@latest add accordion     # FAQ
npx shadcn@latest add dialog        # Modals capture
npx shadcn@latest add command       # Autocomplete ville
npx shadcn@latest add tooltip       # Infobulles
npx shadcn@latest add tabs          # Resultats par categorie
```

### 7.3 Customisation Theme

Dans `tailwind.config.ts`, etendre avec les nouveaux tokens:

```ts
theme: {
  extend: {
    fontFamily: {
      display: ['DM Serif Display', 'Georgia', 'serif'],
      sans: ['Inter Variable', 'Inter', 'system-ui', 'sans-serif'],
    },
    colors: {
      trust: 'var(--trust)',
      'trust-light': 'var(--trust-light)',
      'highlight-economy': 'var(--highlight-economy)',
      'highlight-gain': 'var(--highlight-gain)',
    },
    boxShadow: {
      glow: 'var(--glow-accent)',
      'glow-lg': 'var(--glow-accent-lg)',
      'glow-success': 'var(--glow-success)',
    },
    animation: {
      'glow-pulse': 'glowPulse 2s ease-in-out infinite',
      'fade-in-up': 'fadeInUp 0.3s ease-out',
    },
  },
}
```

---

## 8. Guidelines Anti-Generique

### 8.1 A Faire

| Element | Approche Distinctive |
|---------|---------------------|
| **Titres** | Serif (DM Serif Display) pour gravite |
| **CTA** | Glow dore + uppercase + tracking |
| **Cards** | Bordures dashed dorees signature |
| **Montants** | Mono + couleur highlight |
| **Icones** | Lucide avec stroke-width 1.5 |
| **Backgrounds** | Gradients radiaux subtils |
| **Feedback** | Animations spring (Framer) |

### 8.2 A Eviter

| Piege | Alternative |
|-------|-------------|
| Bleu generique (#0066CC) | Or patrimonial ou Trust blue |
| Boutons plats sans feedback | Glow + scale au hover |
| Formulaire en une page | Multi-etapes avec progression |
| Stock photos | Illustrations abstraites ou mockups |
| Texte justifie | Texte aligne a gauche |
| Animations longues (>500ms) | Micro-interactions rapides |
| Coins tres arrondis (24px+) | Coins subtils (8-12px) |

### 8.3 Signature Visuelle Jeanbrun

**3 elements reconnaissables:**

1. **Dark mode premium** - Fond quasi-noir avec accents lumineux
2. **Bordures dashed dorees** - Style wireframe technique
3. **Typographie mixte** - Serif titres + Sans corps

**Regles d'or:**
- Toujours une touche d'or (accent) visible a l'ecran
- Hierarchie visuelle claire (3 niveaux max)
- Espace negatif genereux (pas de surcharge)
- Contrastes forts sur les elements actionnables

---

## Changelog

| Version | Date | Modifications |
|---------|------|---------------|
| 1.0 | 30/01/2026 | Version initiale |
| 2.0 | 01/02/2026 | Ajout Trust/Highlight colors, typographie DM Serif, motion tokens, guidelines anti-generique |
