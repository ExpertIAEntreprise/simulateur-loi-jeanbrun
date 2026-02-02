# Wireframe - Page Ville SEO

**Version:** 1.0
**Date:** 30 janvier 2026
**Fichiers:**
- `/docs/wireframes/page-ville-wireframe.html` - Source HTML
- `/docs/wireframes/page-ville-wireframe.png` - Export PNG (1440x5177px)

---

## 1. Vue d'ensemble

Page SEO pour les 50+ villes eligibles a la Loi Jeanbrun. Objectif: positionner le simulateur sur des requetes geographiques ("loi jeanbrun lyon", "defiscalisation immobiliere bordeaux").

### Structure de la page

```
+----------------------------------------------------------+
|  HEADER: Logo + Navigation + CTA                          |
+----------------------------------------------------------+
|  BREADCRUMB: Accueil > Villes > [Departement] > [Ville]   |
+----------------------------------------------------------+
|  HERO SECTION                                              |
|  +------------------------+  +---------------+            |
|  | H1: Loi Jeanbrun a X   |  | Score Circle  |            |
|  | Zone + Dept + Region   |  | 78/100        |            |
|  +------------------------+  +---------------+            |
+----------------------------------------------------------+
|  MAIN CONTENT (2/3)           |  SIDEBAR (1/3)            |
|  +-------------------------+  |  +-------------------+    |
|  | Marche immobilier       |  |  | Barometre resume  |    |
|  | - Prix m2               |  |  | - Score global    |    |
|  | - Evolution %           |  |  | - 4 indicateurs   |    |
|  | - Transactions          |  |  +-------------------+    |
|  +-------------------------+  |                           |
|  | Evolution des prix      |  |  +-------------------+    |
|  | [Graphique 12 mois]     |  |  | Simulateur        |    |
|  +-------------------------+  |  | (Sticky)          |    |
|  | Portrait de la ville    |  |  | - Ville pre-remp. |    |
|  | - Population            |  |  | - Type de bien    |    |
|  | - Revenus               |  |  | - Budget          |    |
|  | - Emploi                |  |  | - Revenus         |    |
|  +-------------------------+  |  | [CTA]             |    |
|  | Plafonds de loyer       |  |  +-------------------+    |
|  | [3 cards: Std/Int/Soc]  |  |                           |
|  +-------------------------+  |                           |
|  | Contenu editorial       |  |                           |
|  | [400-600 mots]          |  |                           |
|  +-------------------------+  |                           |
|  | Programmes neufs        |  |                           |
|  | [3 cards promoteurs]    |  |                           |
|  +-------------------------+  |                           |
+----------------------------------------------------------+
|  FOOTER: Villes proches [Chips cliquables]                |
+----------------------------------------------------------+
```

---

## 2. Composants detailles

### 2.1 Header

| Element | Specifications |
|---------|---------------|
| Logo | 32x32px icon + "Loi Jeanbrun" text |
| Navigation | 4 liens: Simulateur, Comment ca marche, Villes eligibles, FAQ |
| CTA | Bouton bleu institutionnel "Simuler mon projet" |
| Position | Sticky top, z-index 100 |

### 2.2 Breadcrumb

```
Accueil > Villes eligibles > [Departement] (XX) > [Ville]
```

- Font size: 13px
- Couleur liens: `--gray-500` (#64748b)
- Couleur actif: `--gray-800` (#1e293b)
- Separateur: `/`

### 2.3 Hero Section

| Element | Specifications |
|---------|---------------|
| Background | Gradient `--blue-institutional` vers `--blue-dark` |
| H1 | 36px, font-weight 700, blanc |
| Zone Badge | Pill avec fond rgba(255,255,255,0.15) |
| Score Circle | 100x100px, conic-gradient avec score en % |

**Score Circle Structure:**
```css
background: conic-gradient(
  var(--amber-500) 0% [score]%,
  rgba(255,255,255,0.2) [score]% 100%
);
```

### 2.4 Section: Marche Immobilier

**Stats Grid (3 colonnes)**

| Card | Valeur | Label | Badge |
|------|--------|-------|-------|
| Prix m2 | "5 420 EUR" | "Prix median / m2" | "+3.2% / 12 mois" (vert) |
| Evolution | "+4.8%" | "Evolution annuelle" | "Tendance haussiere" |
| Transactions | "2 847" | "Transactions / an" | "-12% vs 2024" (rouge) |

### 2.5 Section: Evolution des Prix

**Graphique ligne 12 mois**

| Axe | Specifications |
|-----|---------------|
| Y | 4 000 EUR - 6 000 EUR (par 500 EUR) |
| X | Fev, Mar, Avr, ... Jan (12 mois) |
| Ligne | Gradient bleu vers vert avec area fill |
| Dimensions | ~100% width x 250px height |

### 2.6 Section: Portrait de la Ville

**Grid 2x3 avec donnees INSEE:**

| Metric | Exemple |
|--------|---------|
| Population | 522 969 hab. |
| Densite | 10 835 hab/km2 |
| Revenu median | 25 890 EUR/an |
| Taux chomage | 7.2% |
| Part locataires | 64% |
| Croissance demo. | +0.8%/an |

### 2.7 Section: Plafonds de Loyer

**3 cards niveau loyer:**

| Niveau | Header Color | Loyer/m2 | Amortissement |
|--------|--------------|----------|---------------|
| Standard | Gris | 13.56 EUR | 4% / an |
| Intermediaire | Bleu gradient | 10.85 EUR (-20%) | 6% / an |
| Social | Vert emeraude | 8.14 EUR (-40%) | 8% / an |

### 2.8 Section: Contenu Editorial

- H3 sous-titres: 16px, font-weight 600
- Paragraphes: 14px, line-height 1.7
- Longueur: 400-600 mots
- Optimise SEO avec mots-cles ville + loi jeanbrun

### 2.9 Section: Programmes Neufs

**Grid 3 colonnes avec cards:**

| Element | Specifications |
|---------|---------------|
| Image | 140px height, placeholder gradient |
| Promoteur | 11px, uppercase, gris |
| Nom | 14px, font-weight 600 |
| Prix | 18px, font-weight 700, bleu |
| Details | "T2 au T4 | Lyon 7eme" |
| Badge | Pill vert "Eligible Jeanbrun" |

### 2.10 Sidebar: Barometre

| Section | Specifications |
|---------|---------------|
| Header | Gradient bleu, score 48px amber |
| Rating | 5 etoiles (4 pleines, 1 vide) |
| Metrics | 4 barres de progression |
| Link | "Voir le barometre complet" avec fleche |

**Metrics affichees:**
- Dynamisme economique: 85/100
- Tension locative: 82/100
- Rendement potentiel: 68/100
- Plus-value estimee: 75/100

### 2.11 Sidebar: Simulateur (Sticky)

| Champ | Type | Placeholder |
|-------|------|-------------|
| Ville | Input readonly | "[Ville] (XX)" pre-rempli |
| Type de bien | Select | 3 options |
| Budget | Input text | "Ex: 250 000 EUR" |
| Revenus | Input text | "Ex: 60 000 EUR" |
| CTA | Button amber | "Calculer mon economie d'impot" |

**Position:** `position: sticky; top: 100px;`

### 2.12 Footer: Villes Proches

- Background: `--gray-50`
- Chips: Pills avec border, hover bleu
- 10-15 villes de la meme region

---

## 3. Palette de couleurs

| Token | Valeur | Usage |
|-------|--------|-------|
| `--blue-institutional` | #1e3a5f | Headers, liens, CTAs principaux |
| `--blue-dark` | #0f2942 | Gradients, hover states |
| `--gray-50` | #f8fafc | Backgrounds sections |
| `--gray-500` | #64748b | Texte secondaire |
| `--amber-500` | #f59e0b | Scores, accents, CTA simulateur |
| `--emerald-500` | #10b981 | Indicateurs positifs |
| `--red-500` | #ef4444 | Indicateurs negatifs |

---

## 4. Responsive (a implementer)

### Breakpoints

| Screen | Layout |
|--------|--------|
| Desktop (>1024px) | 2/3 + 1/3 grid |
| Tablet (768-1024px) | Stack vertical, simulateur en bas |
| Mobile (<768px) | Full width, sections empilees |

### Mobile specifics

- Header: Menu hamburger
- Stats grid: 1 colonne
- Plafonds: Carousel horizontal
- Programmes: 1 colonne
- Simulateur: Fixed bottom CTA qui ouvre modal
- Graphique: Simplifie (4 points)

---

## 5. SEO Considerations

### Meta tags

```html
<title>Loi Jeanbrun a [Ville] | Simulateur Defiscalisation 2026</title>
<meta name="description" content="Simulez votre investissement Loi Jeanbrun a [Ville]. Prix m2, plafonds de loyer, programmes neufs eligibles. Estimation gratuite en 2 min.">
<link rel="canonical" href="https://simulateur-loi-jeanbrun.fr/villes/[departement]/[ville]">
```

### Schema.org

- `LocalBusiness` pour les programmes
- `FAQPage` si FAQ integree
- `BreadcrumbList` pour navigation

### Internal linking

- Liens vers le simulateur principal
- Liens vers le barometre complet
- Liens vers villes proches
- Liens vers programmes neufs

---

## 6. Donnees dynamiques

| Source | Endpoint | Frequence MAJ |
|--------|----------|---------------|
| Prix m2 | DVF API | Mensuelle |
| Population | INSEE API | Annuelle |
| Plafonds loyer | Config statique | PLF annuel |
| Programmes | EspoCRM sync | Temps reel |
| Score attractivite | Calcule | Mensuelle |

---

## 7. Performance targets

| Metric | Target |
|--------|--------|
| LCP | < 2.5s |
| FID | < 100ms |
| CLS | < 0.1 |
| TTI | < 3.5s |

### Optimisations

- Images: Next/Image avec lazy loading
- Fonts: `font-display: swap`
- Graphique: Client-side rendering apres hydration
- Simulateur sticky: `will-change: transform`

---

## Changelog

| Version | Date | Modifications |
|---------|------|---------------|
| 1.0 | 30/01/2026 | Version initiale du wireframe |
