# Landing Page - Simulateur Loi Jeanbrun

**Version:** 1.0
**Date:** 2 février 2026
**URL:** https://simulateur-loi-jeanbrun.vercel.app

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
| `cta-section-02` | `src/components/shadcn-studio/blocks/cta-section-02/` | Call to action |

---

## Structure de la Landing Page

```
src/app/(landing)/page.tsx
│
├── Header (navigation)
├── HeroSection (image de fond + formulaire)
├── FeaturesWrapper (3 tabs: Dispositif, Fonctionnement, Conditions)
└── CTASection (call to action)
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

## Images Optimisées

| Image | Dimensions | Poids | Usage |
|-------|------------|-------|-------|
| `loi-jeanbrun-appartement-neuf-hero.webp` | 1920x1080 | 181Ko | Hero background |
| `loi-jeanbrun-dispositif-fiscal-salon.webp` | 800x600 | 22Ko | Tab 1 |
| `loi-jeanbrun-fonctionnement-investissement.webp` | 800x600 | 30Ko | Tab 2 |
| `loi-jeanbrun-conditions-location.webp` | 800x600 | 18Ko | Tab 3 |

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

- [ ] Personnaliser le CTA section 02 avec texte Jeanbrun
- [ ] Ajouter d'autres sections si nécessaire
- [ ] Vérifier le responsive mobile
- [ ] Tester les performances (Lighthouse)
