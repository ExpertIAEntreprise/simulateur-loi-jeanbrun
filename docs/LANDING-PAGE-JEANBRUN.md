# Landing Page - Simulateur Loi Jeanbrun

**Version:** 1.3
**Date:** 3 février 2026 (audit responsive mobile + plan corrections)
**URL:** https://simulateur-loi-jeanbrun.vercel.app

## 📝 Dernières modifications (3 février 2026 - session blog)

### ✅ Articles de blog complets
- 3 articles MDX avec contenu professionnel (6780 à 14461 mots)
- 15 tableaux formatés de manière professionnelle
- Auteur : Hervé Voirin avec photo et bio

### 🖼️ Optimisation images blog
- Conversion WebP : réduction de **86-94%** du poids
- loi-jeanbrun-2026.webp : 47Ko (était 790Ko)
- top-10-villes-investir-jeanbrun.webp : 51Ko (était 878Ko)
- calculer-reduction-impot-jeanbrun.webp : 9.3Ko (était 66Ko)

### 📊 Tableaux Markdown professionnels
- Installation de **remark-gfm** pour GitHub Flavored Markdown
- Composants ReactMarkdown personnalisés (table, thead, tbody, tr, th, td)
- Alignements corrects (gauche, centre, droite)
- Style moderne : bordures arrondies, hover effects, fond grisé
- Émojis : 🥇🥈🥉 (podium), ✅❌ (éligibilité), 🚀 (performances)

### 🔧 Corrections techniques
- Better Auth : baseURL configuré
- Environnement dev : URL localhost au lieu de production
- Suppression preload police inexistante
- Résolution erreurs CSP et hydration React

---

## Palette de Couleurs

| Couleur | Hex | OKLCH | Usage |
|---------|-----|-------|-------|
| **Bleu marine** | `#1e3a5f` | `oklch(0.25 0.05 250)` | Primary, titres, textes, icônes tabs actifs |
| **Rouge** | `#c41e3a` | `oklch(0.50 0.20 25)` | Accent, CTAs, boutons d'action |
| **Blanc** | `#FAFAFA` | `oklch(0.99 0 0)` | Background principal |
| **Gris clair** | `#F1F5F9` | `oklch(0.96 0.005 250)` | Muted, fonds tabs, cards |
| **Gris bordure** | `#E2E8F0` | `oklch(0.90 0.01 250)` | Bordures, séparateurs |

### Variables CSS (globals.css)

```css
:root {
  --primary: oklch(0.25 0.05 250);           /* Bleu marine */
  --primary-foreground: oklch(0.99 0 0);     /* Blanc */
  --accent: oklch(0.50 0.20 25);             /* Rouge */
  --accent-foreground: oklch(0.99 0 0);      /* Blanc */
  --background: oklch(0.99 0 0);             /* Blanc */
  --foreground: oklch(0.25 0.05 250);        /* Bleu marine */
  --muted: oklch(0.96 0.005 250);            /* Gris clair */
  --muted-foreground: oklch(0.55 0.02 250);  /* Gris texte */
}
```

---

## Shadcn Studio

### Identifiants

Les identifiants Shadcn Studio sont configurés dans `components.json` :

```json
{
  "registries": {
    "@ss-blocks": {
      "url": "https://shadcnstudio.com/r/blocks/{name}.json",
      "params": {
        "email": "${EMAIL}",
        "license_key": "${LICENSE_KEY}"
      }
    }
  }
}
```

**Variables d'environnement requises :**
- `EMAIL` : Email du compte Shadcn Studio
- `LICENSE_KEY` : Clé de licence Shadcn Studio

### Commande d'installation

```bash
npx shadcn@latest add @ss-blocks/[nom-du-block]
```

### Blocks installés

| Block | Chemin | Usage |
|-------|--------|-------|
| `hero-section-18` | `src/components/shadcn-studio/blocks/hero-section-18/` | Hero avec image de fond |
| `features-section-27` | `src/components/shadcn-studio/blocks/features-section-27/` | Section tabs (3 onglets) |
| `cta-section-02` | `src/components/shadcn-studio/blocks/cta-section-02/` | Call to action (guide) |
| `cta-section-14` | `src/components/shadcn-studio/blocks/cta-section-14/` | Call to action secondaire |
| `cta-section-07` | `src/components/shadcn-studio/blocks/cta-section-07/` | Présentation expert Hervé Voirin |
| `features-section-09` | `src/components/shadcn-studio/blocks/features-section-09/` | Section personas avec tabs horizontaux |
| `pricing-component-14` | `src/components/shadcn-studio/blocks/pricing-component-14/` | Tarifs (2 plans) |
| `faq-component-15` | `src/components/shadcn-studio/blocks/faq-component-15/` | Questions fréquentes |
| `blog-component-06` | `src/components/shadcn-studio/blocks/blog-component-06/` | Section blog/articles |

---

## Structure de la Landing Page

```
src/app/(landing)/page.tsx
│
├── Header (navigation)
├── HeroSection (image de fond + formulaire)
├── FeaturesWrapper (3 tabs: Dispositif, Fonctionnement, Conditions)
├── CTASection14 (call to action secondaire)
├── CTASection (call to action guide)
├── PersonasSection (tabs personas)
├── CTASection07 (présentation expert Hervé Voirin)
├── FAQWrapper (6 questions/réponses)
├── TestimonialsWrapper (témoignages clients)
├── PricingWrapper (2 plans: Gratuit, Premium)
└── BlogWrapper (3 articles de blog)
```

### Fichiers principaux

| Fichier | Description |
|---------|-------------|
| `src/app/(landing)/page.tsx` | Page principale landing |
| `src/app/globals.css` | Thème et variables CSS |
| `src/components/landing/features-wrapper.tsx` | Données des 3 tabs |
| `src/components/shadcn-studio/blocks/hero-section-18/hero-section-18.tsx` | Composant Hero |
| `src/components/shadcn-studio/blocks/features-section-27/features-section-27.tsx` | Composant Tabs |
| `src/components/shadcn-studio/blocks/cta-section-02/cta-section-02.tsx` | Composant CTA |
| `src/components/landing/personas-wrapper.tsx` | Données des 4 tabs personas |
| `src/components/shadcn-studio/blocks/features-section-09/features-section-09.tsx` | Composant Personas Tabs |

---

## Section Hero

### Image de fond

- **Fichier:** `/public/loi-jeanbrun-appartement-neuf-hero.webp`
- **Dimensions:** 1920x1080
- **Poids:** ~181Ko (optimisé)

### Éléments

1. **Titre principal:** "Helping You Find and Grow Your Dream Home"
2. **Sous-titre:** "Jusqu'à 63 000€ de réduction d'impôt"
3. **Description:** Le nouveau dispositif de défiscalisation 2026...
4. **Bouton rond rouge:** Lien vers `/simulateur`
5. **Formulaire:** Test d'éligibilité (situation matrimoniale)
6. **4 tuiles objectifs:** Réduire impôts, Générer revenus, Construire patrimoine, Préparer retraite

### Couleurs Hero

- Fond bouton rond : `#c41e3a` (rouge)
- Texte titres : `#1e3a5f` (bleu marine)
- Bandeau formulaire : `#1e3a5f` (bleu marine)

---

## Section Tabs (Qu'est-ce que la loi Jeanbrun ?)

### Configuration

Fichier : `src/components/landing/features-wrapper.tsx`

### Tab 1 : Le dispositif

- **Titre:** "Disponible pendant les 3 prochaines années"
- **Image:** `/loi-jeanbrun-dispositif-fiscal-salon.webp` (22Ko)
- **Contenu:**
  - Dispositif fiscal Relance logement / Jeanbrun
  - Ouvert à tous les particuliers
  - Logements dans immeubles collectifs
  - Applicable aux logements neufs et anciens (30% travaux)

### Tab 2 : Fonctionnement

- **Titre:** "Comment fonctionne-t-il ?"
- **Image:** `/loi-jeanbrun-fonctionnement-investissement.webp` (30Ko)
- **Contenu:**
  - Déduction des revenus locatifs
  - Partie du prix d'achat
  - Charges : travaux, intérêts, taxe foncière
  - Jusqu'à 12 000€ d'amortissement/an
  - Jusqu'à 10 700€ de déduction autres revenus

### Tab 3 : Conditions

- **Titre:** "Quelles sont les conditions à respecter ?"
- **Image:** `/loi-jeanbrun-conditions-location.webp` (18Ko)
- **Contenu:**
  - Immeuble collectif obligatoire
  - Location résidence principale 9 ans
  - Plafonds de loyers à respecter
  - Cercle familial interdit

### Style des tabs

- Icône active : fond `primary` (bleu marine), texte blanc
- Texte onglet actif : `primary` (bleu marine)
- Fond onglet actif : `muted` (gris clair)

---

## Section Personas (features-section-09)

### Configuration

Fichier : `src/components/landing/personas-wrapper.tsx`

### Contenu actuel (générique - à personnaliser)

**Titre principal:** "Features that you need."
**Description:** "Discover a suite of essential features designed to enhance your experience. Enjoy customizable settings, real-time notifications, and integrated support tools to streamline your workflow and keep you productive."

**Logo central:** Logo Shadcn Studio avec effet ping animé (à remplacer par logo Simulateur Jeanbrun)

### Tabs actuels (4 tabs horizontaux)

| Tab | Titre | Description | Image | État |
|-----|-------|-------------|-------|------|
| Upload Files | Upload files Easy-peasy | Drag-and-drop interface... | shadcnstudio.com CDN | ⚠️ À personnaliser |
| Email Notifications | Email Notification Super simple! | User-friendly drag-and-drop... | shadcnstudio.com CDN | ⚠️ À personnaliser |
| Field Validations | Validation Alert Please check all fields! | Drag-and-drop feature... | shadcnstudio.com CDN | ⚠️ À personnaliser |
| Auto Responses | Check fields for accuracy! | Fast and secure upload... | shadcnstudio.com CDN | ⚠️ À personnaliser |

### À faire pour ce bloc

- [ ] Remplacer le titre "Features that you need" par un titre Jeanbrun pertinent
- [ ] Adapter la description au contexte de la Loi Jeanbrun
- [ ] Remplacer le logo Shadcn par le logo du simulateur
- [ ] Personnaliser les 4 tabs avec du contenu Jeanbrun :
  - Exemples : Profils investisseurs, Zones éligibles, Simulations types, Avantages fiscaux
- [ ] Remplacer les images CDN par des images locales optimisées
- [ ] Adapter les icônes Lucide aux nouveaux contenus

### Style

- Tabs horizontaux avec icônes
- Image à droite, texte à gauche
- Bouton "See Documentation" pour chaque tab
- Animations : fade, blur, slide

---

## Images Optimisées

| Image | Dimensions | Poids | Usage |
|-------|------------|-------|-------|
| `loi-jeanbrun-appartement-neuf-hero.webp` | 1920x1080 | 181Ko | Hero background |
| `loi-jeanbrun-dispositif-fiscal-salon.webp` | 800x600 | 22Ko | Tab 1 |
| `loi-jeanbrun-fonctionnement-investissement.webp` | 800x600 | 30Ko | Tab 2 |
| `loi-jeanbrun-conditions-location.webp` | 800x600 | 18Ko | Tab 3 |
| **Images Blog (optimisées WebP)** | | | |
| `images/blog/loi-jeanbrun-2026.webp` | 800x | 47Ko | Article principal (était 790Ko JPG) |
| `images/blog/top-10-villes-investir-jeanbrun.webp` | 800x | 51Ko | Article top 10 villes (était 878Ko JPG) |
| `images/blog/calculer-reduction-impot-jeanbrun.webp` | 800x | 9.3Ko | Article calcul (était 66Ko JPG) |

### Optimisation des images

```bash
# Hero (grande taille pour fond plein écran)
convert source.webp -resize 1920x1080 -quality 80 output.webp

# Tabs (taille réduite pour cadre ~500px)
convert source.webp -resize 800x600 -quality 75 output.webp
```

### Nommage SEO

Format : `loi-jeanbrun-[contexte]-[description].webp`

---

## Section Pricing (pricing-component-14)

### Configuration

Fichier : `src/components/landing/pricing-wrapper.tsx`

### Plans tarifaires

| Plan | Prix | Période | Description |
|------|------|---------|-------------|
| **Gratuit** | 0€ | - | Simulation basique, rapport PDF, accès limité |
| **Premium** | 49€ | HT | Analyse personnalisée, accompagnement expert, accès programmes |

### Features incluses

**Gratuit :**
- ✅ Simulation fiscale basique
- ✅ Rapport PDF simple
- ✅ Calcul réduction d'impôt
- ✅ Comparaison LMNP
- ❌ Analyse personnalisée
- ❌ Accompagnement expert
- ❌ Accès aux programmes

**Premium :**
- ✅ Tout du gratuit +
- ✅ Analyse personnalisée détaillée
- ✅ Accompagnement expert (20+ ans)
- ✅ Accès exclusif aux programmes
- ✅ Suivi sur 9 ans
- ✅ Réponse sous 24h
- ✅ Premier rendez-vous inclus

---

## Section Expert (cta-section-07)

### Configuration

Fichier : `src/components/shadcn-studio/blocks/cta-section-07/cta-section-07.tsx`

### Contenu

**Badge :** "Expert certifié" (gradient ambre avec icône ShieldCheck)

**Titre :** "Votre expert en défiscalisation immobilière Loi Jeanbrun"

**Présentation :**
> Avec plus de 20 ans d'expérience dans l'immobilier neuf et un Master en Gestion de Patrimoine, j'ai accompagné plus de 200 investisseurs dans l'optimisation de leur fiscalité.

**Features (8 points) :**
1. 20+ ans d'expertise immobilière
2. 200+ investisseurs accompagnés
3. Master en Gestion de Patrimoine
4. Spécialiste immobilier neuf
5. Simulation gratuite et sans engagement
6. Analyse personnalisée de votre fiscalité
7. Suivi de votre projet sur 9 ans
8. Réponse rapide sous 24h

**Stats bar (gradient bleu) :**
- 20+ Années d'expérience
- 200+ Clients accompagnés
- 75k€ Gain fiscal moyen

**Photo :** `/herve-voirin.avif`
**Nom :** Hervé Voirin
**Titre :** Conseiller en Gestion de Patrimoine

**CTAs :**
1. "Prendre rendez-vous" (primary)
2. "Faire une demande" (secondary)

### Personnalisation effectuée

Ce bloc a été adapté depuis le design de Tom (OpenClaw) :
- Intégration du contenu professionnel d'Hervé Voirin
- Badge "Expert certifié" déplacé après le titre principal
- Stats bar positionnée après les features
- Photo avec nom et titre professionnel

---

## Section FAQ (faq-component-15)

### Configuration

Fichier : `src/components/landing/faq-wrapper.tsx`

### Questions incluses (6)

1. **Qu'est-ce que la Loi Jeanbrun ?**
   - Définition du dispositif PLF 2026
   - Avantages fiscaux jusqu'à 50 000€

2. **Quel est le montant de la réduction d'impôt ?**
   - Calcul selon TMI (45% → 50k€, 30% → 33k€)
   - Rôle du simulateur

3. **Quelles sont les conditions d'éligibilité ?**
   - Zones tendues (A, A bis, B1)
   - Engagement 6 ou 9 ans
   - Résidence principale après location

4. **Comment fonctionne le simulateur ?**
   - Process : revenus, TMI, montant, durée
   - Rapport détaillé par email

5. **La simulation est-elle vraiment gratuite ?**
   - Gratuit 100% sans CB
   - Option Premium à 49€ HT

6. **Puis-je être accompagné dans mon projet ?**
   - Accompagnement A à Z
   - Expérience 20+ ans
   - Réponse sous 24h

### Style

- Accordéon avec animations MotionPreset
- Image illustrative à gauche (avec pattern background)
- Questions/réponses à droite
- Premier item ouvert par défaut

---

## Section Blog (blog-component-06)

### Configuration

Fichier : `src/components/landing/blog-wrapper.tsx`

### Articles publiés (3)

1. **Loi Jeanbrun 2026 : Guide Complet pour Investir dans l'Immobilier**
   - Slug : `loi-jeanbrun-2026-guide-complet`
   - Tags : Loi Jeanbrun, PLF 2026, Défiscalisation
   - Date : 15 janvier 2026
   - Image : `/images/blog/loi-jeanbrun-2026.webp` (47Ko)
   - Contenu : Conditions, avantages fiscaux, zones, simulation, comparaison Pinel
   - **Tableaux** : 3 tableaux formatés (types de biens, taux de réduction, comparaison)

2. **Top 10 des Villes où Investir avec la Loi Jeanbrun en 2026**
   - Slug : `top-10-villes-investir-jeanbrun`
   - Tags : Investissement locatif, Villes, Rendement
   - Date : 31 janvier 2026
   - Image : `/images/blog/top-10-villes-investir-jeanbrun.webp` (51Ko)
   - Contenu : Classement 10 villes, méthodologie, quartiers recommandés
   - **Tableaux** : 12 tableaux formatés (méthodologie + quartiers pour chaque ville + récapitulatif)

3. **Comment Calculer sa Réduction d'Impôt avec la Loi Jeanbrun**
   - Slug : `calculer-reduction-impot-jeanbrun`
   - Tags : Calcul, Simulation, RE2020
   - Date : 31 janvier 2026
   - Image : `/images/blog/calculer-reduction-impot-jeanbrun.webp` (9.3Ko)

### Éléments du bloc

- **Titre principal :** "Get daily updates and inspiration from our team!" (à personnaliser)
- **Newsletter card :** Formulaire d'inscription email
- **Grille d'articles :** 3 colonnes responsive
- **Bouton :** "See All Blogs"

### Personnalisation effectuée (3 février 2026)

- ✅ Titre principal → "Votre veille fiscale et immobilière"
- ✅ Description → Analyses et conseils pour investissement locatif
- ✅ 3 articles réels créés avec contenu MDX complet
- ✅ Images optimisées en WebP (réduction 86-94%)
- ✅ Newsletter card avec formulaire d'inscription
- ✅ Auteur : Hervé Voirin (photo + bio)
- ✅ **15 tableaux formatés** dans les articles (voir section détaillée ci-dessous)

### Formatage des tableaux du blog

**Fichiers concernés :**
- `/content/blog/loi-jeanbrun-2026-guide-complet.mdx` (3 tableaux)
- `/content/blog/top-10-villes-investir-jeanbrun.mdx` (12 tableaux)

**Problématique résolue :**
ReactMarkdown ne gérait pas nativement les alignements des tableaux Markdown (`:---:`, `---:`, `:---`)

**Solution technique :**

1. **Installation de remark-gfm** (plugin GitHub Flavored Markdown)
   ```bash
   pnpm add remark-gfm
   ```

2. **Modification de blog/[slug]/page.tsx**
   - Import : `import remarkGfm from 'remark-gfm'`
   - Ajout du plugin : `<ReactMarkdown remarkPlugins={[remarkGfm]}>`
   - Composants personnalisés pour `table`, `thead`, `tbody`, `tr`, `th`, `td`
   - Lecture de `style.textAlign` pour appliquer les classes d'alignement

3. **Style moderne des tableaux**
   - Bordure arrondie autour du tableau
   - Header avec fond grisé (`bg-muted/50`)
   - Lignes séparées (`divide-y divide-border`)
   - Effet hover sur les lignes (`hover:bg-muted/30`)
   - Meilleurs espacements (`px-4 py-3`)

**Résultat visuel :**
- ✅ Prix/m² alignés à droite (meilleure lisibilité des chiffres)
- ✅ Rendements centrés et en gras
- ✅ Quartiers/critères alignés à gauche
- ✅ Médailles 🥇🥈🥉 dans le tableau récapitulatif
- ✅ Émojis ✅/❌ pour éligibilité
- ✅ Design professionnel et moderne

---

## Modifications effectuées

### globals.css

1. Passage du dark mode au light mode par défaut
2. Primary : or/jaune → bleu marine `#1e3a5f`
3. Accent : or/jaune → rouge `#c41e3a`
4. Background : noir → blanc
5. Mise à jour de toutes les couleurs sémantiques

### features-section-27.tsx

1. Suppression de l'auto-rotation des tabs (useEffect avec setInterval)
2. Titre : "See how we drives success..." → "Qu'est-ce que la loi Jeanbrun ?"
3. Suppression du bouton "Learn more"
4. Ajout de `whitespace-pre-line` pour les retours à la ligne

### hero-section-18.tsx

1. Ajout de l'image de fond avec next/image
2. Overlay gradient pour lisibilité du texte

### Modifications 3 février 2026

1. **Installation pricing-component-14**
   - Création de `pricing-wrapper.tsx`
   - 2 plans : Gratuit (0€) et Premium (49€ HT)
   - Features list complète pour chaque plan

2. **Installation cta-section-07**
   - Adaptation du design de Tom (OpenClaw)
   - Badge "Expert certifié" après le titre
   - 8 features + stats bar (20+, 200+, 75k€)
   - Photo Hervé Voirin avec nom et titre
   - 2 CTAs : Rendez-vous et Demande

3. **Installation faq-component-15**
   - Création de `faq-wrapper.tsx`
   - 6 questions/réponses sur la Loi Jeanbrun
   - Accordéon avec animations

4. **Installation blog-component-06**
   - Création de `blog-wrapper.tsx`
   - 3 articles de blog
   - Newsletter card intégrée

5. **Suppression composant TomExpertSection**
   - Retiré le composant avec styled-jsx (erreur Server Component)
   - Contenu intégré dans cta-section-07

### Modifications 3 février 2026 (suite - session blog)

1. **Optimisation des images blog en WebP**
   - `loi-jeanbrun-2026.jpg` (790Ko) → `loi-jeanbrun-2026.webp` (47Ko) - **94% de réduction**
   - `top-10-villes-investir-jeanbrun.jpg` (878Ko) → `.webp` (51Ko) - **94% de réduction**
   - `calculer-reduction-impot-jeanbrun.jpg` (66Ko) → `.webp` (9.3Ko) - **86% de réduction**
   - Commande : `convert input.jpg -resize 800x -quality 85 output.webp`

2. **Mise à jour des fichiers MDX**
   - Modification des 3 fichiers dans `/content/blog/`
   - Changement de l'attribut `image:` de `.jpg` vers `.webp`
   - Images utilisées à la fois sur page d'accueil ET dans les articles

3. **Formatage professionnel de 15 tableaux Markdown**

   **Article "Guide complet" (3 tableaux) :**
   - Tableau types de biens éligibles (avec ✅/❌)
   - Tableau taux de réduction (6, 9, 12 ans)
   - Tableau comparaison Pinel vs Jeanbrun (avec 🚀)

   **Article "Top 10 villes" (12 tableaux) :**
   - Tableau méthodologie (5 critères pondérés)
   - 10 tableaux quartiers (Lyon, Bordeaux, Nantes, Toulouse, Montpellier, Lille, Rennes, Strasbourg, Nice, Marseille)
   - Tableau récapitulatif final (avec médailles 🥇🥈🥉)

   **Améliorations appliquées :**
   - Alignements corrects : gauche (`:---`), centre (`:---:`), droite (`---:`)
   - Symboles € au lieu de EUR
   - Accents français corrigés (é, è, à, ô, etc.)
   - Rendements et valeurs importantes en **gras**
   - Émojis pour meilleure lisibilité (✅, ❌, 🥇, 🚀)
   - Chiffres supérieurs (7ᵉ, 5ᵉ, 8ᵉ arrondissement)

4. **Installation et configuration de remark-gfm**
   - Plugin nécessaire pour GitHub Flavored Markdown (tableaux)
   - `pnpm add remark-gfm`
   - Import dans `blog/[slug]/page.tsx`
   - Ajout du plugin à ReactMarkdown : `remarkPlugins={[remarkGfm]}`

5. **Composants ReactMarkdown personnalisés pour tableaux**

   **Nouveaux composants ajoutés :**
   ```tsx
   table: Wrapper avec bordure arrondie et overflow
   thead: Header avec fond grisé
   tbody: Corps avec séparation des lignes
   tr: Lignes avec effet hover
   th: Headers avec alignement dynamique (lecture de style.textAlign)
   td: Cellules avec alignement dynamique
   ```

   **Classes CSS appliquées :**
   - Bordure arrondie : `rounded-lg border border-border`
   - Header : `bg-muted/50`
   - Séparation lignes : `divide-y divide-border`
   - Hover : `hover:bg-muted/30 transition-colors`
   - Alignements : `text-left`, `text-center`, `text-right`

6. **Corrections techniques environnement dev**
   - Better Auth : Ajout de `baseURL: process.env.NEXT_PUBLIC_APP_URL`
   - `.env.local` : Changement de `https://simuler-loi-fiscale-jeanbrun.fr` vers `http://147.93.53.108:3001`
   - `next.config.ts` : Suppression du preload de la police `DMSerifDisplay-Regular.woff2` inexistante
   - Résolution des erreurs : CSP violation, hydration error, 404 police

---

## Commandes utiles

```bash
# Développement
cd /root/simulateur_loi_Jeanbrun
PORT=3001 pnpm dev

# Build
pnpm build

# Lint + TypeCheck
pnpm check

# Ajouter un block Shadcn Studio
npx shadcn@latest add @ss-blocks/[nom-du-block]

# Optimiser une image
convert input.webp -resize 800x600 -quality 75 output.webp
```

---

## À faire

### Priorité HAUTE

- [x] **Personnaliser le bloc Blog (blog-component-06)** ✅ *Terminé 3 février 2026*
  - ✅ Remplacer titre et description
  - ✅ Créer vraies pages d'articles (3 articles MDX complets)
  - ✅ Remplacer images par images locales optimisées WebP
  - ✅ Formater 15 tableaux Markdown de manière professionnelle
  - ✅ Installer remark-gfm et personnaliser composants ReactMarkdown
  - ✅ Ajouter auteur Hervé Voirin avec photo et bio

- [x] **Ajouter photo Hervé Voirin** ✅ *Terminé 3 février 2026*
  - ✅ Photo ajoutée : `/herve-voirin.avif`
  - ✅ Utilisée dans cta-section-07 et blog-component-06

- [ ] **Personnaliser le bloc Personas (features-section-09)**
  - Contenu 100% générique actuellement
  - Remplacer le logo Shadcn par logo Simulateur Jeanbrun
  - Créer 4 nouveaux tabs pertinents (ex: Profils investisseurs)
  - Créer 4 nouvelles images optimisées

### Priorité MOYENNE

- [ ] Personnaliser le CTA section 02 avec texte Jeanbrun
- [x] **Créer vraies pages de blog avec contenu détaillé** ✅ *Terminé 3 février 2026*
  - ✅ Article 1 : Guide complet Loi Jeanbrun (6780 mots, 3 tableaux)
  - ✅ Article 2 : Top 10 villes (14461 mots, 12 tableaux)
  - ✅ Article 3 : Calcul réduction impôt (10129 mots)
- [ ] Fonctionnaliser la newsletter (intégration Mailjet)
- [ ] Ajouter liens fonctionnels aux CTAs (Calendly, formulaire contact)

### Priorité CRITIQUE - Responsive Mobile

- [ ] **Corriger le responsive mobile** (audit du 3 fevrier 2026 - voir section ci-dessous)
- [ ] Tester les performances (Lighthouse)
- [x] **Optimiser les images du blog** ✅ *Terminé 3 février 2026*
  - ✅ Conversion WebP avec réduction 86-94%
  - ✅ Taille optimale 800px largeur
- [ ] Ajouter meta descriptions SEO pour chaque section

### Priorité BASSE

- [ ] Tester les performances (Lighthouse)
- [ ] Ajouter meta descriptions SEO pour chaque section

---

## Audit Responsive Mobile (3 fevrier 2026)

**Device emule :** iPhone 14 (390x844)
**Verdict :** La page est inutilisable en mobile. Problemes critiques sur la majorite des sections.

### Problemes identifies

#### 1. Header (CRITIQUE)
- Le logo affiche toujours **"shadcn/studio"** au lieu du nom du projet
- Le header sticky recouvre du contenu en scrollant (z-index trop haut)
- La barre de navigation masque les premiers pixels de chaque section

#### 2. Hero Section (CRITIQUE)
- **Le hero est completement casse en mobile** : le titre "La revolution fiscale", le sous-titre, le bouton CTA rouge et le formulaire d'eligibilite sont invisibles ou empiles de maniere incoherente
- Le formulaire "Test d'eligibilite" est tronque en haut, seul le bandeau bleu est partiellement visible
- Les 4 tuiles "objectifs" prennent tout l'ecran, empilees verticalement sans optimisation d'espacement
- L'image de fond hero n'est plus visible, remplacee par un fond blanc

#### 3. Section Tabs "Qu'est-ce que la loi Jeanbrun ?" (MOYEN)
- Le contenu texte s'affiche correctement
- Les tabs ne sont pas visibles (probablement caches ou hors ecran)
- L'image associee au tab n'est pas visible

#### 4. Section Expert Herve Voirin (OK)
- La section s'affiche relativement bien en mobile
- Les badges, features, stats bar et photo sont lisibles
- Les CTAs "Prendre rendez-vous" et "Faire une demande" sont bien empiles

#### 5. Section Personas / features-section-09 (CRITIQUE)
- **Contenu 100% en anglais** : "Features that you need.", "Upload Files", "Email Notifications", "Field Validations", "Auto Responses"
- Bouton "See Documentation" en anglais
- Images venant du CDN shadcnstudio.com (contenu placeholder)
- Maquette de paiement "$5,550/Year" avec "Platinum" et numeros de carte bancaire fictifs affiches

#### 6. Section Testimonials (OK)
- Les avis Google s'affichent correctement (Christophe P.)
- Etoiles et contenu lisibles

#### 7. Section Pricing (BON)
- Les 2 plans (Gratuit / Premium 99 TTC) s'affichent bien empiles
- Features lisibles avec checkmarks
- Badge "Integralement rembourse" visible sur le plan Premium
- CTAs fonctionnels

#### 8. Section FAQ (BON)
- Accordeon fonctionnel
- Questions/reponses lisibles
- CTA "Prendre rendez-vous" visible

#### 9. Section CTA "Avantage Exceptionnel" (MOYEN)
- Le bouton CTA est coupe sur le bord droit : "Simulez gratuitement votre avantage" tronque
- L'image couple est bien affichee

#### 10. Section Blog (BON)
- Articles empiles verticalement, lisibles
- Images, tags, auteur et dates affichees correctement
- Newsletter "Restez informe" avec formulaire email fonctionne

#### 11. Footer (CRITIQUE)
- **Contenu 100% template shadcn/studio** non personnalise
- Logo et description : "An open-source collection of copy-and-paste shadcn components..."
- Liens en anglais : "About", "Features", "Works", "Career", "Customer Support", "Delivery Details", "Terms & Conditions", "Privacy Policy"
- Copyright : "2026 shadcn/studio, Made with for better web."
- Logos marques : bestofjs, Product Hunt, reddit, Medium, Y Combinator (non pertinents)
- Newsletter dupliquee (deja presente dans la section blog)

### Console et Performance

- **Aucune erreur JavaScript** dans la console
- **6 warnings** de preload d'images non utilisees (images dark mode du CDN shadcnstudio)
- **Toutes les requetes reseau en 200** (aucun 404)
- Fast Refresh : ~10 secondes (normal en dev avec Turbopack)

### Plan de corrections responsive

#### Phase 1 : Corrections rapides (branding + footer)

**1.1 Remplacer le footer template par le footer custom**
- Fichier : `src/app/(landing)/page.tsx`
- Ligne 13 : Changer import `footer-component-02` → `site-footer`
- Ligne 102 : `<Footer />` → `<SiteFooter />`
- Le fichier `src/components/site-footer.tsx` existe deja avec contenu FR, liens legaux, copyright correct

**1.2 Corriger le logo "shadcn/studio"**
- Fichier : `src/components/shadcn-studio/logo.tsx`
- Ligne 10 : `shadcn/studio` → `Loi Jeanbrun`
- Ajouter responsive : `text-base sm:text-xl`

**1.3 Traduire "Login" en "Connexion"**
- Fichier : `src/components/shadcn-studio/blocks/hero-section-18/header.tsx`
- Lignes 35 et 41 : `Login` → `Connexion`

#### Phase 2 : Hero Section - refonte responsive (effort principal)

**Fichier :** `src/components/shadcn-studio/blocks/hero-section-18/hero-section-18.tsx`

**Cause racine :** Positionnement absolu avec valeurs hardcodees (`bottom-[320px]`, `bottom-[185px]`), bouton CTA de 224px de diametre, texte trop gros pour mobile.

| Element | Ligne | Actuel | Cible |
|---------|-------|--------|-------|
| Section wrapper | 9 | `relative flex flex-1 justify-end` | `relative flex flex-col overflow-hidden min-h-[100svh] lg:flex-row lg:flex-1 lg:justify-end lg:min-h-0` |
| Carte blanche | 22 | `absolute bottom-[320px]` | `relative z-10 mt-auto w-full px-4 sm:px-6 lg:absolute lg:bottom-[320px] lg:left-1/2 lg:max-w-7xl lg:-translate-x-1/2 lg:px-8` |
| Barre tuiles | 92 | `absolute bottom-[185px]` | `relative z-10 mt-4 w-full px-4 sm:px-6 lg:absolute lg:bottom-[185px] lg:left-1/2 lg:max-w-7xl lg:-translate-x-1/2 lg:px-8` |
| Bouton CTA rouge | 45 | `size-56 lg:size-64` | `size-28 sm:size-40 lg:size-56` |
| Titre h1 | 28 | `text-3xl lg:text-4xl` | `text-xl sm:text-2xl md:text-3xl lg:text-4xl` |
| Titre h2 | 31 | `text-2xl lg:text-3xl` | `text-lg sm:text-xl md:text-2xl lg:text-3xl` |
| Espacement | 34,37 | `mt-6` | `mt-3 sm:mt-4 lg:mt-6` |
| Flex parent | 23 | `flex w-full gap-0 max-md:flex-col` | `flex w-full gap-0 max-md:flex-col max-md:gap-4` |
| Padding carte | 25 | `p-8` | `p-4 sm:p-6 lg:p-8` |

Texte dans le bouton rouge : `text-xs sm:text-sm` pour labels, `text-sm sm:text-base font-bold` pour texte principal.

#### Phase 3 : Corrections sections secondaires

**3.1 CTA "Avantage Exceptionnel" - bouton tronque**
- Fichier : `src/components/shadcn-studio/blocks/cta-section-14/cta-section-14.tsx`
- Ligne 39-42 : Texte trop long pour mobile → texte court sur mobile, texte complet sur desktop
- Ligne 51 : Image `max-lg:max-w-100` → `max-lg:max-w-full max-lg:px-4`

**3.2 Expert Herve Voirin - stats bar + image**
- Fichier : `src/components/shadcn-studio/blocks/cta-section-07/cta-section-07.tsx`
- Ligne 49 stats bar : Ajouter `flex-col sm:flex-row gap-4 sm:gap-0 p-4 sm:p-6`
- Lignes 53, 58 dividers : Ajouter `hidden sm:block`
- Ligne 82 image : `h-[28rem]` → `h-[16rem] sm:h-[20rem] lg:h-[28rem]`
- Ligne 22 gap : `gap-16` → `gap-8 sm:gap-12 lg:gap-16`

**3.3 Blog - espacement header**
- Fichier : `src/components/shadcn-studio/blocks/blog-component-06/blog-component-06.tsx`
- Ligne 23 : `gap-16` → `gap-8 sm:gap-12 lg:gap-16`, `mb-12` → `mb-8`

**3.4 Carousel temoignages - fleches hors ecran**
- Fichier : `src/components/landing/testimonials-google.tsx`
- Ligne 132 : `-left-12` → `left-2 sm:-left-12`
- Ligne 133 : `-right-12` → `right-2 sm:-right-12`

**3.5 Personas images overflow**
- Fichier : `src/components/shadcn-studio/blocks/features-section-09/features-section-09.tsx`
- Lignes 99-104 : Ajouter `max-w-full` aux images pour eviter overflow sur 390px

**3.6 Blog - images au format 16:9**
- Fichier : `src/components/shadcn-studio/blocks/blog-component-06/blog-component-06.tsx`
- Les images d'articles doivent etre plus larges, au format 16:9
- Remplacer `max-h-60 w-full` par `w-full aspect-video object-cover` sur les images des cartes blog
- Ceci s'applique aussi a la page article individuelle (`src/app/blog/[slug]/page.tsx`)

#### Hors scope (differe)

- Contenu personas en anglais : Remplacement complet du contenu template → Tache de contenu separee
- Images placeholder CDN : Remplacement par images Jeanbrun locales → Tache design
- Preload warnings console : Images dark mode preloadees inutilement → Optimisation future

#### Verification post-implementation

Tester avec Chrome DevTools aux resolutions :
- 390x844 (iPhone 14), 375x667 (iPhone SE), 768x1024 (iPad), 1440x900 (Desktop)

Checklist :
- [ ] Pas de scrollbar horizontal
- [ ] Tout le texte lisible (pas de troncature, pas de chevauchement)
- [ ] Boutons cliquables (min 44px zone tactile)
- [ ] Contenu en francais (plus de "shadcn/studio", "Login")
- [ ] Hero : titre + formulaire + CTA visibles sur mobile
- [ ] Footer : liens legaux FR, copyright correct

---

### Nouvelles tâches techniques

- [x] **Corriger environnement dev** ✅ *Terminé 3 février 2026*
  - ✅ Better Auth baseURL configuré
  - ✅ NEXT_PUBLIC_APP_URL en localhost
  - ✅ Suppression preload police inexistante
  - ✅ Résolution erreurs CSP et hydration
