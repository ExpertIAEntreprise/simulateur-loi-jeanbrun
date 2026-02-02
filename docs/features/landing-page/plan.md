# Plan d'Implementation - Landing Page

**Feature:** Landing Page Simulateur Loi Jeanbrun
**Statut:** Phase 2 Sprint 2 termine
**Estimation:** 5.5 jours

---

## Phase 1 : Design Tokens et Configuration ✅

**Objectif:** Configurer les tokens CSS et polices pour le theme dark premium
**Statut:** TERMINE (2 fevrier 2026)

### Taches

- [x] Ajouter tokens landing page dans `src/app/globals.css`
  ```css
  --anchor-amount: oklch(0.85 0.20 75);
  --anchor-glow: 0 0 40px oklch(0.78 0.18 75 / 0.5);
  --hero-gradient: radial-gradient(ellipse 80% 50% at 50% -20%, oklch(0.78 0.18 75 / 0.08) 0%, transparent 50%);
  --muted-foreground: oklch(0.65 0.015 265);
  ```

- [x] Ajouter media query `prefers-reduced-motion` dans `src/app/globals.css`
  ```css
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }
  ```

- [x] Configurer polices dans `src/app/layout.tsx`
  - DM Serif Display (titres, variable `--font-serif`)
  - JetBrains Mono (chiffres, variable `--font-mono`)

- [x] Creer hook `src/hooks/usePrefersReducedMotion.ts`

### Validation Phase 1

```bash
pnpm check  # ✅ 0 errors, warnings only pre-existing
```

---

## Phase 2 : Composants Landing - Sprint 1 (CRITIQUES) ✅

**Objectif:** Creer les 5 composants critiques above-the-fold
**Statut:** TERMINE (2 fevrier 2026)

### Fichiers crees

| Fichier | Description |
|---------|-------------|
| `src/components/landing/HeroSection.tsx` | Titre 50 000EUR + CTAs |
| `src/components/landing/SimulatorQuickForm.tsx` | Formulaire 4 etapes |
| `src/components/landing/TrustSignalsBar.tsx` | 4 badges confiance |
| `src/components/landing/AnimatedCounter.tsx` | Compteur anime |
| `src/components/landing/UrgencyBanner.tsx` | Bandeau urgence 2027 |
| `src/components/landing/index.ts` | Barrel export |

### Taches

- [x] Creer `AnimatedCounter.tsx`
  - Animation de 0 a 50 000 avec useSyncExternalStore
  - Respect `usePrefersReducedMotion`
  - Format `50 000 EUR` (espace milliers, fr-FR locale)
  - Glow effect avec --anchor-amount et --anchor-glow

- [x] Creer `HeroSection.tsx`
  - Titre : "Jusqu'a 50 000EUR d'economie d'impot avec la Loi Jeanbrun"
  - Sous-titre : "Le produit d'excellence pour preparer votre retraite"
  - Integrer `AnimatedCounter`
  - 2 CTAs (principal + secondaire)
  - Background gradient hero avec --hero-gradient

- [x] Creer `SimulatorQuickForm.tsx`
  - 4 etapes : montant, TMI, type bien, niveau loyer
  - Validation Zod v4 avec messages FR
  - Progress indicator accessible (role="progressbar")
  - Calcul client-side immediat
  - React Hook Form integration

- [x] Creer `TrustSignalsBar.tsx`
  - 4 badges avec icones Lucide (Wallet, TrendingUp, Shield, Clock)
  - Layout responsive (2x2 mobile, 4x1 desktop)
  - Accessibilite: aria-label, aria-hidden

- [x] Creer `UrgencyBanner.tsx`
  - Texte : "Offre bonifiee : 21 400EUR/an jusqu'au 31/12/2027"
  - Background accent or avec icone CalendarClock
  - Countdown optionnel (jours restants)
  - Position : sous le hero

- [x] Creer `index.ts` barrel export

### Validation Phase 2 Sprint 1

```bash
pnpm check  # ✅ 0 errors, warnings only pre-existing
```

---

## Phase 2 : Composants Landing - Sprint 2 (HAUTES) ✅

**Objectif:** Creer les composants de contenu principal
**Statut:** TERMINE (2 fevrier 2026)

### Fichiers crees

| Fichier | Description |
|---------|-------------|
| `src/components/landing/FeatureCards.tsx` | 4 cards avantages retraite |
| `src/components/landing/RetirementSection.tsx` | Timeline 22/30 ans |
| `src/components/landing/ProcessSteps.tsx` | 3 etapes visuelles |
| `src/components/landing/ComparisonTable.tsx` | Jeanbrun vs Pinel vs LMNP |
| `src/components/landing/ExampleCalculation.tsx` | Cas TMI 45% |

### Taches

- [x] Creer `FeatureCards.tsx`
  - 4 cards avec icones (Wallet, TrendingUp, Shield, Coins)
  - Angle retraite (50k, hors plafond, 0 impot, amortissements)
  - Grid responsive 2x2
  - Badge "Offre limitee" sur card bonification 2027

- [x] Creer `RetirementSection.tsx`
  - Timeline verticale : 9 ans → 22 ans → 30 ans
  - Highlight sur 22 ans et 30 ans avec glow effect
  - Avantages retraite (3 items)
  - `aria-labelledby` pour accessibilite

- [x] Creer `ProcessSteps.tsx`
  - 3 etapes : Simulez, Recevez, Contactez
  - Connecteurs visuels (horizontal desktop, vertical mobile)
  - Icones numerotees avec badges

- [x] Creer `ComparisonTable.tsx`
  - Tableau accessible (`scope`, `aria-label`)
  - Highlight colonne Jeanbrun
  - Icones check/cross/partial avec `sr-only`

- [x] Creer `ExampleCalculation.tsx`
  - Profil : TMI 45%, 30 000EUR revenus fonciers
  - Investissement : 300 000EUR
  - Calcul detaille avec animation chiffres
  - Respect prefers-reduced-motion

### Validation Phase 2 Sprint 2

```bash
pnpm check  # ✅ 0 errors, warnings only pre-existing
```

---

## Phase 2 : Composants Landing - Sprint 3 (MOYENNES)

**Objectif:** Creer les composants footer et FAQ

### Fichiers a creer

| Fichier | Description |
|---------|-------------|
| `src/components/landing/FAQAccordion.tsx` | 7 questions |
| `src/components/landing/CTASection.tsx` | CTA final |
| `src/components/landing/LandingHeader.tsx` | Header simplifie |
| `src/components/landing/LandingFooter.tsx` | Footer liens |
| `src/components/landing/index.ts` | Barrel export |

### Taches

- [ ] Creer `FAQAccordion.tsx`
  - 7 questions avec reponses
  - Utiliser shadcn/ui Accordion
  - `aria-label="Questions frequentes"`
  - Navigation clavier (Enter, Space, Arrow)

- [ ] Creer `CTASection.tsx`
  - Background noir avec glow
  - Titre angle retraite
  - Bouton avec effet pulse

- [ ] Creer `LandingHeader.tsx`
  - Logo
  - Nav simplifiee (Simulateur, Avantages, FAQ)
  - Bouton connexion

- [ ] Creer `LandingFooter.tsx`
  - Copyright
  - Liens legaux (CGU, mentions, confidentialite)
  - Liens sociaux

- [ ] Creer `index.ts` barrel export

### Validation Phase 2 Sprint 3

```bash
pnpm check
```

---

## Phase 3 : Page Landing

**Objectif:** Assembler la page et configurer le SEO

### Fichiers a creer/modifier

| Fichier | Action |
|---------|--------|
| `src/app/page.tsx` | Remplacer par landing |
| `src/components/seo/JsonLdWebPage.tsx` | Creer |
| `src/components/seo/JsonLdSoftwareApp.tsx` | Creer |
| `src/components/seo/JsonLdFaq.tsx` | Creer |
| `src/components/seo/JsonLdOrganization.tsx` | Creer |

### Taches

- [ ] Creer les 4 composants JSON-LD

- [ ] Modifier `src/app/page.tsx`
  ```tsx
  export default function LandingPage() {
    return (
      <>
        <JsonLdWebPage />
        <JsonLdSoftwareApp />
        <JsonLdFaq faqItems={faqItems} />
        <LandingHeader />
        <UrgencyBanner />           {/* NOUVEAU: Bandeau bonification 2027 */}
        <main id="main-content">
          <HeroSection />
          <TrustSignalsBar />
          <FeatureCards />
          <RetirementSection />
          <ProcessSteps />
          <ComparisonTable />
          <ExampleCalculation />
          <FAQAccordion />
          <CTASection />
        </main>
        <LandingFooter />
      </>
    )
  }
  ```

- [ ] Configurer metadata SEO
  ```typescript
  export const metadata: Metadata = {
    title: "Simulateur Loi Jeanbrun 2026 - Jusqu'a 50 000EUR d'Economie d'Impot",
    description: "Simulez gratuitement votre economie d'impot avec la Loi Jeanbrun. Jusqu'a 50 000EUR d'economie pour les TMI 45%. Le produit ideal pour preparer votre retraite.",
    // ...
  }
  ```

### Validation Phase 3

```bash
pnpm check
pnpm build:ci
```

---

## Phase 4 : SEO Technique

**Objectif:** Optimiser pour les moteurs de recherche

### Fichiers a modifier

| Fichier | Action |
|---------|--------|
| `src/app/sitemap.ts` | Priority 1.0 pour landing |
| `src/app/robots.ts` | Rules optimisees |

### Assets a creer

| Fichier | Description |
|---------|-------------|
| `public/og-image-jeanbrun.jpg` | Image OG 1200x630 avec chiffre 50k |
| `public/logo.png` | Logo transparent |
| `public/apple-touch-icon.png` | Icone iOS |

### Taches

- [ ] Modifier `src/app/sitemap.ts`
  - Ajouter `/` avec priority 1.0
  - changeFrequency: 'weekly'

- [ ] Modifier `src/app/robots.ts`
  - Allow all pour landing
  - Sitemap URL

- [ ] Creer assets SEO (placeholder si necessaire)

### Validation Phase 4

```bash
pnpm build:ci
# Verifier sitemap.xml et robots.txt
```

---

## Phase 5 : Accessibilite

**Objectif:** Atteindre WCAG 2.1 AA

### Taches

- [ ] Formulaire simulateur
  - `role="progressbar"` sur indicateur
  - `aria-required="true"` sur champs
  - `aria-describedby` pour erreurs
  - Focus management (premier champ erreur)

- [ ] Tableau comparatif
  - `aria-label` sur `<table>`
  - `scope="col"` et `scope="row"` sur `<th>`
  - `sr-only` sur icones check/cross

- [ ] FAQ Accordion
  - `aria-labelledby` vers titre section
  - Navigation clavier complete

- [ ] Tests
  - [ ] axe DevTools : 0 issues critiques
  - [ ] Navigation clavier bout en bout
  - [ ] Test VoiceOver/NVDA

### Validation Phase 5

```bash
pnpm check
pnpm build:ci
# Tests manuels accessibilite
```

---

## Verification finale

### Build

```bash
pnpm check          # lint + typecheck
pnpm build:ci       # build production
```

### Performance (Lighthouse mobile)

- [ ] Performance >= 90
- [ ] Accessibility >= 90
- [ ] Best Practices >= 90
- [ ] SEO >= 90

### SEO

- [ ] Rich Results Test : FAQPage valide
- [ ] Rich Results Test : SoftwareApplication valide
- [ ] Mobile-Friendly Test : Pass

### Fonctionnel

- [ ] Formulaire rapide calcule correctement
- [ ] Compteur anime fonctionne
- [ ] FAQ accessible au clavier
- [ ] prefers-reduced-motion respecte

---

## Fichiers crees/modifies (resume)

### Nouveaux fichiers (19)

```
src/components/landing/
├── HeroSection.tsx
├── SimulatorQuickForm.tsx
├── TrustSignalsBar.tsx
├── UrgencyBanner.tsx            # NOUVEAU: Bandeau bonification 2027
├── AnimatedCounter.tsx
├── FeatureCards.tsx
├── RetirementSection.tsx
├── ProcessSteps.tsx
├── ComparisonTable.tsx
├── ExampleCalculation.tsx
├── FAQAccordion.tsx
├── CTASection.tsx
├── LandingHeader.tsx
├── LandingFooter.tsx
└── index.ts

src/components/seo/
├── JsonLdWebPage.tsx
├── JsonLdSoftwareApp.tsx
├── JsonLdFaq.tsx
└── JsonLdOrganization.tsx

src/hooks/
└── usePrefersReducedMotion.ts

public/
├── og-image-jeanbrun.jpg
├── logo.png
└── apple-touch-icon.png
```

### Fichiers modifies (4)

```
src/app/globals.css    # Tokens + prefers-reduced-motion
src/app/layout.tsx     # Fonts
src/app/page.tsx       # Landing page
src/app/sitemap.ts     # Priority landing
src/app/robots.ts      # Rules
```

---

## Agents recommandes

| Phase | Agents |
|-------|--------|
| Phase 1 | `jeanbrun-design-architect` |
| Phase 2 | `ui-expert`, `react-hook-form-expert` |
| Phase 3 | `marketing-expert` (copywriting) |
| Phase 4 | `scraping-expert` (SEO technique) |
| Phase 5 | Revue manuelle accessibilite |

---

*Derniere mise a jour : 1er fevrier 2026*
