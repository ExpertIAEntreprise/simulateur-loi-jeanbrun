# Recommandations SEO Front-End - Pages Villes Loi Jeanbrun

**Date:** 31 janvier 2026
**Objectif:** Template SEO optimisé pour les ~350 pages villes (51 métropoles + ~300 périphériques)

---

## META TAGS DYNAMIQUES

### Title (< 60 caractères)

```
Loi Jeanbrun {ville} 2026 : Investir et Défiscaliser
```

### Meta description (< 160 caractères)

```
Investissement locatif à {ville} avec la loi Jeanbrun. Zone {zone}, plafond {plafond}€/m², jusqu'à 14% de réduction d'impôt. Simulateur gratuit.
```

---

## SCHEMA.ORG FAQ

Le champ `faqItems` de chaque ville (EspoCRM) est prêt pour le JSON-LD FAQPage.

### Mapping

| Champ EspoCRM | JSON-LD FAQPage |
|---------------|-----------------|
| `faqItems[].question` | `mainEntity[].name` |
| `faqItems[].answer` | `mainEntity[].acceptedAnswer.text` |

### Exemple JSON-LD

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Villeurbanne est-elle éligible à la loi Jeanbrun ?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Oui, Villeurbanne est située en zone A..."
      }
    }
  ]
}
```

---

## MOTS-CLÉS PAR VOLUME

| Mot-clé | Volume/mois | Placement recommandé |
|---------|-------------|---------------------|
| investissement locatif | 14 800 | H1, 1er paragraphe |
| défiscalisation immobilière | 1 600 | Contenu éditorial |
| lmnp | 40 500 | Articles comparatifs (blog) |
| simulateur défiscalisation | 390 | CTA, footer |
| zone éligible | 210 | FAQ, sidebar |

---

## STRUCTURE H1/H2 RECOMMANDÉE

```
H1: Investissement locatif loi Jeanbrun à {ville}

H2: {ville} : une ville éligible en zone {zone}

H2: Avantages fiscaux de la loi Jeanbrun
    - Réduction 6%, 9%, 12%
    - Plafonds loyers

H2: Questions fréquentes (FAQ)
    - 3-4 questions JSON-LD

H2: Programmes neufs disponibles
    - Liste programmes si disponibles
```

---

## INTERNAL LINKING

### Liens obligatoires

1. **Simulateur** : `/chat` (CTA haut + bas de page)
2. **Métropole parent** : `/villes/{metropole}` (si ville périphérique)
3. **Villes voisines** : 3-5 liens vers villes périphériques de même métropole

### Exemple pour Villeurbanne

```html
<!-- Lien vers métropole parent -->
<a href="/villes/lyon">Voir Lyon, métropole de référence</a>

<!-- Liens vers villes voisines -->
<a href="/villes/venissieux">Vénissieux</a>
<a href="/villes/bron">Bron</a>
<a href="/villes/vaulx-en-velin">Vaulx-en-Velin</a>
```

---

## BREADCRUMB SCHEMA.ORG

### Pour une ville périphérique

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Accueil", "item": "https://..." },
    { "@type": "ListItem", "position": 2, "name": "Villes", "item": "https://.../villes" },
    { "@type": "ListItem", "position": 3, "name": "Lyon", "item": "https://.../villes/lyon" },
    { "@type": "ListItem", "position": 4, "name": "Villeurbanne", "item": "https://.../villes/villeurbanne" }
  ]
}
```

### Pour une métropole

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Accueil", "item": "https://..." },
    { "@type": "ListItem", "position": 2, "name": "Villes", "item": "https://.../villes" },
    { "@type": "ListItem", "position": 3, "name": "Lyon", "item": "https://.../villes/lyon" }
  ]
}
```

---

## CHECKLIST SEO PAR PAGE VILLE

### Obligatoire

- [ ] Title < 60 caractères avec "loi Jeanbrun + {ville}"
- [ ] Meta description < 160 caractères avec CTA
- [ ] H1 unique : "Investissement locatif loi Jeanbrun à {ville}"
- [ ] FAQ Schema.org (3-4 questions depuis `faqItems`)
- [ ] BreadcrumbList Schema.org
- [ ] Lien simulateur `/chat` (haut + bas de page)
- [ ] Alt text image : "Investissement locatif loi Jeanbrun à {ville}"
- [ ] URL canonique : `https://simulateur-loi-jeanbrun.vercel.app/villes/{slug}`

### Recommandé

- [ ] Lien vers métropole parent (si périphérique)
- [ ] 3-5 liens vers villes voisines
- [ ] Mot-clé "investissement locatif" dans le 1er paragraphe
- [ ] Données structurées LocalBusiness (optionnel)

---

## TEMPLATE NEXT.JS

### Fichier : `src/app/villes/[slug]/page.tsx`

```typescript
// Imports
import { getVilleBySlug, getVillesPeripheriques } from '@/lib/villes'

// Metadata dynamique
export async function generateMetadata({ params }) {
  const ville = await getVilleBySlug(params.slug)
  return {
    title: `Loi Jeanbrun ${ville.name} 2026 : Investir et Défiscaliser`,
    description: `Investissement locatif à ${ville.name} avec la loi Jeanbrun. Zone ${ville.zoneFiscale}, plafond ${ville.plafondLoyer}€/m², jusqu'à 14% de réduction d'impôt.`,
    // ... openGraph, twitter
  }
}

// JSON-LD
const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: ville.faqItems.map(item => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer
    }
  }))
}
```

---

## DONNÉES ESPOCRM → FRONT-END

### Champs utilisés

| Champ EspoCRM | Utilisation Front-End |
|---------------|----------------------|
| `name` | H1, title, breadcrumb |
| `slug` | URL `/villes/{slug}` |
| `zoneFiscale` | Meta description, contenu |
| `population` | Contenu éditorial |
| `contenuEditorial` | Corps de page |
| `argumentsInvestissement` | Liste avantages |
| `faqItems` | FAQ + JSON-LD |
| `photoVille` | Image header |
| `photoVilleAlt` | Alt text image |
| `metaTitle` | Fallback title |
| `metaDescription` | Fallback description |
| `isMetropole` | Logique breadcrumb |
| `metropoleParentId` | Lien parent |

---

**Document de référence pour l'implémentation front-end des pages villes.**
**Source données : EspoCRM (CJeanbrunVille)**
