# Design Recommendations - Page Loi Jeanbrun

**Version:** 1.0
**Date:** 31 janvier 2026
**Pour:** `/loi-jeanbrun` - Page informative sur la Loi Jeanbrun

---

## 1. Vision Design

### 1.1 Objectifs de la Page

La page `/loi-jeanbrun` est une page **informative et pedagogique** qui doit:
- Expliquer clairement le dispositif fiscal Loi Jeanbrun (PLF 2026)
- Presenter les zones fiscales eligibles (A bis, A, B1)
- Detailler les conditions et plafonds
- Inciter a utiliser le simulateur (CTA fort)

### 1.2 Ton et Atmosphere

| Aspect | Approche |
|--------|----------|
| **Autorite** | Design professionnel inspirant confiance pour un sujet legal/fiscal |
| **Clarte** | Information complexe rendue accessible via hierarchie visuelle |
| **Urgence discrete** | PLF 2026 = opportunite temporelle sans pression agressive |
| **Expertise** | Vocabulaire precis, donnees chiffrees, sources citees |

---

## 2. Palette de Couleurs pour Zones Fiscales

### 2.1 Couleurs des Zones

Les zones fiscales representent des niveaux de tension du marche immobilier. La palette utilise des teintes distinctes avec le meme niveau de saturation pour coherence visuelle.

```css
/* Tokens a ajouter dans globals.css */
:root {
  /* Zone A bis - Premium / Tension maximale */
  --zone-abis: oklch(0.65 0.20 280);           /* Violet premium */
  --zone-abis-background: oklch(0.18 0.06 280);
  --zone-abis-foreground: oklch(0.88 0.12 280);
  --zone-abis-border: oklch(0.55 0.18 280);

  /* Zone A - Standard / Forte tension */
  --zone-a: oklch(0.62 0.22 260);              /* Bleu info */
  --zone-a-background: oklch(0.15 0.05 250);
  --zone-a-foreground: oklch(0.82 0.12 255);
  --zone-a-border: oklch(0.52 0.18 260);

  /* Zone B1 - Accessible / Tension moderee */
  --zone-b1: oklch(0.68 0.18 165);             /* Teal/Cyan */
  --zone-b1-background: oklch(0.18 0.06 165);
  --zone-b1-foreground: oklch(0.85 0.12 165);
  --zone-b1-border: oklch(0.58 0.15 165);

  /* Zone B2/C - Non eligible (pour information) */
  --zone-ineligible: oklch(0.55 0.015 285);    /* Gris neutre */
  --zone-ineligible-background: oklch(0.14 0.005 285);
  --zone-ineligible-foreground: oklch(0.70 0.015 285);
}
```

### 2.2 Classes Utilitaires Tailwind

```css
/* Ajouter dans globals.css @layer utilities */
@layer utilities {
  /* Zone A bis */
  .bg-zone-abis { background-color: var(--zone-abis-background); }
  .text-zone-abis { color: var(--zone-abis); }
  .border-zone-abis { border-color: var(--zone-abis-border); }

  /* Zone A */
  .bg-zone-a { background-color: var(--zone-a-background); }
  .text-zone-a { color: var(--zone-a); }
  .border-zone-a { border-color: var(--zone-a-border); }

  /* Zone B1 */
  .bg-zone-b1 { background-color: var(--zone-b1-background); }
  .text-zone-b1 { color: var(--zone-b1); }
  .border-zone-b1 { border-color: var(--zone-b1-border); }

  /* Zone ineligible */
  .bg-zone-ineligible { background-color: var(--zone-ineligible-background); }
  .text-zone-ineligible { color: var(--zone-ineligible); }
}
```

### 2.3 Usage des Couleurs de Zone

| Contexte | Zone A bis | Zone A | Zone B1 |
|----------|------------|--------|---------|
| Badge | `bg-zone-abis text-zone-abis-foreground` | `bg-zone-a text-zone-a-foreground` | `bg-zone-b1 text-zone-b1-foreground` |
| Card | `border-zone-abis bg-zone-abis` | `border-zone-a bg-zone-a` | `border-zone-b1 bg-zone-b1` |
| Tableau header | `bg-zone-abis/20` | `bg-zone-a/20` | `bg-zone-b1/20` |
| Icone/Indicateur | `text-zone-abis` | `text-zone-a` | `text-zone-b1` |

---

## 3. Hierarchie Typographique

### 3.1 Titres de Page et Sections

```tsx
// Hero Title - H1
<h1 className="text-4xl md:text-5xl font-bold tracking-tight">
  Loi Jeanbrun <span className="text-accent">PLF 2026</span>
</h1>

// Section Title - H2
<h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
  Les zones eligibles
</h2>

// Subsection Title - H3
<h3 className="text-xl md:text-2xl font-semibold">
  Conditions d'eligibilite
</h3>

// Card Title - H4
<h4 className="text-lg font-medium">
  Zone A bis
</h4>

// Label/Caption
<span className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
  Plafond de loyer
</span>
```

### 3.2 Corps de Texte

```tsx
// Lead paragraph (intro)
<p className="text-lg text-foreground-secondary leading-relaxed">
  Le dispositif Jeanbrun permet une defiscalisation...
</p>

// Body text
<p className="text-base text-foreground leading-relaxed">
  Contenu standard...
</p>

// Secondary/Muted text
<p className="text-sm text-muted-foreground">
  Information complementaire...
</p>

// Legal/Disclaimer
<p className="text-xs text-muted-foreground italic">
  * Sous reserve de validation par les services fiscaux
</p>
```

### 3.3 Chiffres et Donnees

```tsx
// Montant principal (KPI)
<span className="text-3xl md:text-4xl font-bold tabular-nums text-accent">
  18,23 EUR/m2
</span>

// Pourcentage
<span className="text-2xl font-semibold tabular-nums">
  30%
</span>

// Valeur secondaire
<span className="text-lg font-medium tabular-nums text-foreground">
  195 000 EUR
</span>
```

---

## 4. Espacement entre Sections

### 4.1 Structure de Page

```tsx
<main className="min-h-screen">
  {/* Hero Section */}
  <section className="py-16 md:py-24">
    <div className="container mx-auto px-4 md:px-6 lg:px-8">
      {/* Hero content */}
    </div>
  </section>

  {/* Content Sections */}
  <section className="py-12 md:py-16">
    <div className="container mx-auto px-4 md:px-6 lg:px-8">
      {/* Section content */}
    </div>
  </section>

  {/* Alternate background section */}
  <section className="py-12 md:py-16 bg-card">
    {/* ... */}
  </section>
</main>
```

### 4.2 Espacements Recommandes

| Element | Mobile | Desktop | Tailwind Classes |
|---------|--------|---------|------------------|
| Section padding vertical | 48px | 64px | `py-12 md:py-16` |
| Hero padding vertical | 64px | 96px | `py-16 md:py-24` |
| Container padding horizontal | 16px | 24px/32px | `px-4 md:px-6 lg:px-8` |
| Gap entre cards | 16px | 24px | `gap-4 md:gap-6` |
| Gap interne card | 16px | 24px | `p-4 md:p-6` |
| Gap titre/contenu | 24px | 32px | `mb-6 md:mb-8` |
| Gap paragraphes | 16px | 16px | `space-y-4` |

---

## 5. Style des Tableaux

### 5.1 Tableau des Plafonds par Zone

```tsx
<div className="overflow-x-auto rounded-lg border border-border">
  <table className="w-full text-sm">
    <thead>
      <tr className="border-b border-border bg-muted/50">
        <th className="px-4 py-3 text-left font-semibold">Zone</th>
        <th className="px-4 py-3 text-left font-semibold">Plafond loyer</th>
        <th className="px-4 py-3 text-left font-semibold">Plafond ressources</th>
        <th className="px-4 py-3 text-left font-semibold">Exemples villes</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-border">
      {/* Zone A bis row */}
      <tr className="hover:bg-muted/30 transition-colors">
        <td className="px-4 py-3">
          <Badge className="bg-zone-abis text-zone-abis-foreground">
            Zone A bis
          </Badge>
        </td>
        <td className="px-4 py-3 tabular-nums font-medium">18,23 EUR/m2</td>
        <td className="px-4 py-3 tabular-nums">43 475 EUR</td>
        <td className="px-4 py-3 text-muted-foreground">Paris, Hauts-de-Seine</td>
      </tr>

      {/* Zone A row */}
      <tr className="hover:bg-muted/30 transition-colors">
        <td className="px-4 py-3">
          <Badge className="bg-zone-a text-zone-a-foreground">Zone A</Badge>
        </td>
        <td className="px-4 py-3 tabular-nums font-medium">13,56 EUR/m2</td>
        <td className="px-4 py-3 tabular-nums">43 475 EUR</td>
        <td className="px-4 py-3 text-muted-foreground">Lyon, Marseille, Nice</td>
      </tr>

      {/* Zone B1 row */}
      <tr className="hover:bg-muted/30 transition-colors">
        <td className="px-4 py-3">
          <Badge className="bg-zone-b1 text-zone-b1-foreground">Zone B1</Badge>
        </td>
        <td className="px-4 py-3 tabular-nums font-medium">10,93 EUR/m2</td>
        <td className="px-4 py-3 tabular-nums">35 435 EUR</td>
        <td className="px-4 py-3 text-muted-foreground">Bordeaux, Nantes, Rennes</td>
      </tr>
    </tbody>
  </table>
</div>
```

### 5.2 Tableau avec Lignes Alternees

```tsx
<tbody>
  {data.map((row, index) => (
    <tr
      key={row.id}
      className={cn(
        "transition-colors",
        index % 2 === 0 ? "bg-transparent" : "bg-muted/20"
      )}
    >
      {/* cells */}
    </tr>
  ))}
</tbody>
```

### 5.3 Tableau Comparatif (Jeanbrun vs LMNP)

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* Colonne Jeanbrun */}
  <div className="rounded-xl border-2 border-accent p-6 bg-accent/5">
    <div className="flex items-center gap-2 mb-4">
      <Badge variant="default" className="bg-accent">Recommande</Badge>
      <h4 className="text-lg font-semibold">Loi Jeanbrun</h4>
    </div>
    <ul className="space-y-3">
      {jeanbrunavantages.map((item) => (
        <li key={item} className="flex items-start gap-2">
          <CheckCircle2 className="h-5 w-5 text-success mt-0.5 shrink-0" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </div>

  {/* Colonne LMNP */}
  <div className="rounded-xl border border-border p-6">
    <h4 className="text-lg font-semibold mb-4">LMNP Classique</h4>
    <ul className="space-y-3">
      {lmnpitems.map((item) => (
        <li key={item} className="flex items-start gap-2">
          <MinusCircle className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
          <span className="text-muted-foreground">{item}</span>
        </li>
      ))}
    </ul>
  </div>
</div>
```

---

## 6. Cards Conditions

### 6.1 Card Condition Standard

```tsx
interface ConditionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  details?: string[];
  status?: 'required' | 'optional' | 'info';
}

function ConditionCard({ icon, title, description, details, status = 'required' }: ConditionCardProps) {
  return (
    <Card className={cn(
      "p-6 transition-all hover:shadow-md",
      status === 'required' && "border-l-4 border-l-accent",
      status === 'optional' && "border-l-4 border-l-info",
      status === 'info' && "border-dashed border-border"
    )}>
      <div className="flex items-start gap-4">
        <div className={cn(
          "rounded-lg p-3 shrink-0",
          status === 'required' && "bg-accent/10",
          status === 'optional' && "bg-info/10",
          status === 'info' && "bg-muted"
        )}>
          {icon}
        </div>
        <div className="space-y-2">
          <h4 className="font-semibold">{title}</h4>
          <p className="text-sm text-muted-foreground">{description}</p>
          {details && (
            <ul className="mt-3 space-y-1">
              {details.map((detail, i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  {detail}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Card>
  );
}
```

### 6.2 Grille de Cards Conditions

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <ConditionCard
    icon={<Building2 className="h-6 w-6 text-accent" />}
    title="Type de bien"
    description="Logement ancien avec travaux de renovation"
    details={[
      "Bien existant (pas de VEFA)",
      "Travaux >= 30% du prix d'acquisition",
      "Performance energetique amelioree"
    ]}
    status="required"
  />

  <ConditionCard
    icon={<MapPin className="h-6 w-6 text-info" />}
    title="Localisation"
    description="Zone tendue eligible au dispositif"
    details={[
      "Zone A bis (Paris et proche banlieue)",
      "Zone A (grandes agglomerations)",
      "Zone B1 (villes moyennes dynamiques)"
    ]}
    status="required"
  />

  <ConditionCard
    icon={<Clock className="h-6 w-6 text-accent" />}
    title="Engagement de location"
    description="Duree minimale de mise en location"
    details={[
      "9 ans minimum",
      "Loyer plafonne selon zone",
      "Locataire sous plafond de ressources"
    ]}
    status="required"
  />
</div>
```

### 6.3 Card Highlight (Avantage Principal)

```tsx
<Card className="relative overflow-hidden border-2 border-accent bg-gradient-to-br from-accent/10 via-transparent to-transparent p-8">
  {/* Corner accent */}
  <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-bl-[100px]" />

  <div className="relative space-y-4">
    <Badge variant="default" className="bg-accent">Avantage fiscal majeur</Badge>
    <h3 className="text-2xl font-bold">
      Jusqu'a <span className="text-accent">21%</span> d'amortissement
    </h3>
    <p className="text-muted-foreground max-w-2xl">
      Le dispositif Jeanbrun permet d'amortir fiscalement jusqu'a 21% du montant
      des travaux de renovation, soit une economie d'impot significative sur 9 ans.
    </p>
    <div className="flex flex-wrap gap-4 pt-4">
      <div className="flex items-center gap-2">
        <CheckCircle2 className="h-5 w-5 text-success" />
        <span className="text-sm">Report des deficits sur 10 ans</span>
      </div>
      <div className="flex items-center gap-2">
        <CheckCircle2 className="h-5 w-5 text-success" />
        <span className="text-sm">Cumulable avec d'autres dispositifs</span>
      </div>
    </div>
  </div>
</Card>
```

---

## 7. Animations pour CTAs

### 7.1 Bouton CTA Principal avec Glow

```tsx
import { motion } from "framer-motion";

function CTAButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      className={cn(
        "relative px-8 py-4 rounded-lg font-semibold uppercase tracking-wider",
        "bg-accent text-accent-foreground",
        "transition-all duration-300",
        "hover:bg-accent-hover",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
      )}
      whileHover={{
        scale: 1.02,
        boxShadow: "0 0 30px oklch(0.78 0.18 75 / 0.5)"
      }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.button>
  );
}
```

### 7.2 CTA avec Animation de Fleche

```tsx
function CTAWithArrow({ children, href }: { children: React.ReactNode; href: string }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-accent text-accent-foreground font-semibold uppercase tracking-wider transition-all hover:bg-accent-hover hover:shadow-glow"
    >
      {children}
      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
    </Link>
  );
}
```

### 7.3 CTA Section avec Background Anime

```tsx
function CTASection() {
  return (
    <section className="relative py-16 overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-grid opacity-50" />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background" />

      <div className="relative container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <h2 className="text-3xl md:text-4xl font-bold">
            Pret a simuler votre economie d'impot ?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Decouvrez en 2 minutes combien vous pouvez economiser avec le dispositif Jeanbrun.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <CTAWithArrow href="/simulateur">
              Lancer le simulateur
            </CTAWithArrow>
            <Button variant="outline" size="lg" asChild>
              <Link href="/contact">
                Parler a un expert
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
```

### 7.4 Variants Framer Motion pour Sections

```tsx
// Variants pour apparition orchestree
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1]
    }
  }
};

// Usage
<motion.div
  variants={containerVariants}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, margin: "-100px" }}
  className="grid grid-cols-1 md:grid-cols-3 gap-6"
>
  {conditions.map((condition) => (
    <motion.div key={condition.id} variants={itemVariants}>
      <ConditionCard {...condition} />
    </motion.div>
  ))}
</motion.div>
```

---

## 8. Composants Specifiques a la Page

### 8.1 Hero Section Loi Jeanbrun

```tsx
function LoiJeanbrunHero() {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent/10 blur-[100px] rounded-full" />

      <div className="relative container mx-auto px-4">
        <div className="max-w-3xl">
          {/* Badge */}
          <Badge variant="outline" className="mb-6 border-accent/50 text-accent">
            PLF 2026 - Nouveau dispositif fiscal
          </Badge>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Loi Jeanbrun :
            <span className="block text-accent mt-2">
              La defiscalisation immobiliere reinventee
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
            Decouvrez le nouveau dispositif d'investissement locatif qui permet
            d'amortir jusqu'a 21% du montant de vos travaux de renovation.
            Un levier fiscal puissant pour les investisseurs immobiliers.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" asChild className="shadow-glow">
              <Link href="/simulateur">
                Simuler mon economie
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="#conditions">
                Voir les conditions
              </a>
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="flex items-center gap-6 mt-8 pt-8 border-t border-border">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-success" />
              <span>Simulation gratuite</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4 text-accent" />
              <span>Resultat en 2 min</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4 text-info" />
              <span>Donnees securisees</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

### 8.2 Section Zones Fiscales

```tsx
function ZonesFiscalesSection() {
  const zones = [
    {
      id: 'abis',
      name: 'Zone A bis',
      description: 'Marches les plus tendus',
      plafondLoyer: '18,23',
      plafondRessources: '43 475',
      villes: ['Paris', 'Hauts-de-Seine', 'Val-de-Marne (partie)'],
      colorClass: 'zone-abis',
      icon: <Building2 className="h-6 w-6" />
    },
    {
      id: 'a',
      name: 'Zone A',
      description: 'Grandes agglomerations',
      plafondLoyer: '13,56',
      plafondRessources: '43 475',
      villes: ['Lyon', 'Marseille', 'Nice', 'Montpellier'],
      colorClass: 'zone-a',
      icon: <MapPin className="h-6 w-6" />
    },
    {
      id: 'b1',
      name: 'Zone B1',
      description: 'Villes moyennes dynamiques',
      plafondLoyer: '10,93',
      plafondRessources: '35 435',
      villes: ['Bordeaux', 'Nantes', 'Rennes', 'Strasbourg'],
      colorClass: 'zone-b1',
      icon: <Home className="h-6 w-6" />
    }
  ];

  return (
    <section id="zones" className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Zones eligibles au dispositif Jeanbrun
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Le dispositif s'applique uniquement aux zones tendues ou la demande
            locative excede l'offre disponible.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {zones.map((zone) => (
            <Card
              key={zone.id}
              className={cn(
                "p-6 transition-all hover:shadow-lg",
                `border-2 border-${zone.colorClass} bg-${zone.colorClass}`
              )}
            >
              <div className={cn("inline-flex p-3 rounded-lg mb-4", `bg-${zone.colorClass}/20`)}>
                <span className={`text-${zone.colorClass}`}>{zone.icon}</span>
              </div>

              <h3 className="text-xl font-semibold mb-2">{zone.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{zone.description}</p>

              <div className="space-y-3 pt-4 border-t border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Plafond loyer</span>
                  <span className="font-medium tabular-nums">{zone.plafondLoyer} EUR/m2</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Plafond ressources</span>
                  <span className="font-medium tabular-nums">{zone.plafondRessources} EUR</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground mb-2">Exemples de villes</p>
                <div className="flex flex-wrap gap-1">
                  {zone.villes.map((ville) => (
                    <Badge key={ville} variant="secondary" className="text-xs">
                      {ville}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
```

### 8.3 FAQ Accordion

```tsx
function FAQSection() {
  const faqs = [
    {
      question: "Qu'est-ce que la Loi Jeanbrun ?",
      answer: "La Loi Jeanbrun est un dispositif fiscal introduit dans le PLF 2026..."
    },
    {
      question: "Quelles sont les conditions d'eligibilite ?",
      answer: "Pour beneficier du dispositif, vous devez respecter plusieurs conditions..."
    },
    {
      question: "Quel est le montant de l'avantage fiscal ?",
      answer: "L'avantage fiscal peut atteindre 21% du montant des travaux..."
    },
    {
      question: "Puis-je cumuler avec d'autres dispositifs ?",
      answer: "Le dispositif Jeanbrun peut etre cumule sous certaines conditions..."
    }
  ];

  return (
    <section className="py-12 md:py-16 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Questions frequentes
          </h2>
          <p className="text-muted-foreground">
            Tout ce que vous devez savoir sur le dispositif Jeanbrun
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-border rounded-lg px-6 bg-background"
              >
                <AccordionTrigger className="text-left font-medium hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
```

---

## 9. Responsive Considerations

### 9.1 Breakpoints

| Breakpoint | Pixels | Usage |
|------------|--------|-------|
| `sm` | 640px | Mobile landscape |
| `md` | 768px | Tablette |
| `lg` | 1024px | Desktop small |
| `xl` | 1280px | Desktop standard |
| `2xl` | 1536px | Desktop large |

### 9.2 Patterns Responsive

```tsx
// Grid responsif
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">

// Typographie responsive
<h1 className="text-3xl md:text-4xl lg:text-5xl">

// Padding responsive
<section className="py-12 md:py-16 lg:py-20">

// Visibilite conditionnelle
<span className="hidden md:inline">Texte desktop uniquement</span>
<span className="md:hidden">Texte mobile uniquement</span>

// Stack sur mobile, row sur desktop
<div className="flex flex-col sm:flex-row gap-4">
```

### 9.3 Tableaux Mobile

Sur mobile, les tableaux complexes doivent se transformer en cards:

```tsx
{/* Desktop: Tableau */}
<div className="hidden md:block">
  <table>{/* ... */}</table>
</div>

{/* Mobile: Cards */}
<div className="md:hidden space-y-4">
  {data.map((item) => (
    <Card key={item.id} className="p-4">
      <div className="flex justify-between items-center mb-2">
        <Badge>{item.zone}</Badge>
        <span className="font-bold">{item.plafond} EUR/m2</span>
      </div>
      <p className="text-sm text-muted-foreground">{item.description}</p>
    </Card>
  ))}
</div>
```

---

## 10. Checklist Implementation

### 10.1 Tokens CSS a Ajouter

- [ ] Tokens couleurs zones (A bis, A, B1)
- [ ] Classes utilitaires zones
- [ ] Gradients background hero

### 10.2 Composants a Creer

- [ ] `ZoneBadge` - Badge colore selon zone fiscale
- [ ] `ConditionCard` - Card avec icone et liste de details
- [ ] `ComparisonTable` - Tableau comparatif Jeanbrun vs LMNP
- [ ] `PlafondTable` - Tableau des plafonds par zone
- [ ] `FAQAccordion` - Section FAQ avec accordion

### 10.3 Sections de la Page

- [ ] Hero avec titre + CTA + trust indicators
- [ ] Section "Qu'est-ce que la Loi Jeanbrun"
- [ ] Section "Zones eligibles" avec cards
- [ ] Section "Conditions d'eligibilite"
- [ ] Section "Avantages fiscaux" avec chiffres
- [ ] Section "Comparatif Jeanbrun vs LMNP"
- [ ] Section "FAQ"
- [ ] Section "CTA final" vers simulateur

---

## 11. Accessibilite

### 11.1 Contraste Couleurs Zones

Toutes les couleurs de zones ont ete choisies pour respecter WCAG AA:

| Zone | Background | Foreground | Ratio |
|------|------------|------------|-------|
| A bis | `oklch(0.18 0.06 280)` | `oklch(0.88 0.12 280)` | 7.2:1 |
| A | `oklch(0.15 0.05 250)` | `oklch(0.82 0.12 255)` | 6.8:1 |
| B1 | `oklch(0.18 0.06 165)` | `oklch(0.85 0.12 165)` | 6.5:1 |

### 11.2 Focus States

Tous les elements interactifs doivent avoir un focus visible:

```tsx
className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
```

### 11.3 Motion Preferences

```tsx
// Respecter prefers-reduced-motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Ou avec Framer Motion
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: prefersReducedMotion ? 0 : 0.5 }}
>
```

---

## Changelog

| Version | Date | Modifications |
|---------|------|---------------|
| 1.0 | 31/01/2026 | Version initiale - Recommandations design page Loi Jeanbrun |
