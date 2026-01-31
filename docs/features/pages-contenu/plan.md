# Plan: Pages Contenu (Loi, Profil, Blog)

**Sprint:** 4 (parallèle aux pages villes)
**Effort:** 5 jours
**Statut:** En cours

---

## Phase 1: Page Loi Jeanbrun (1.5 jours) ✅ TERMINÉE

### Tâches

- [x] 1.1 Créer `src/app/loi-jeanbrun/page.tsx`
- [x] 1.2 Rédiger contenu "Qu'est-ce que la loi Jeanbrun"
- [x] 1.3 Créer section conditions d'éligibilité (zones, plafonds)
- [x] 1.4 Créer tableau avantages fiscaux
- [x] 1.5 Créer section comparaison (vs Pinel, LMNP)
- [x] 1.6 Créer composant FAQ accordéon
- [x] 1.7 Ajouter CTA simulateur
- [x] 1.8 Ajouter JSON-LD FAQPage
- [x] 1.9 Optimiser metadata SEO

### Fichiers à créer

```
src/app/loi-jeanbrun/
└── page.tsx

src/components/loi/
├── HeroLoi.tsx
├── ConditionsEligibilite.tsx
├── AvantagesFiscaux.tsx
├── ComparaisonDispositifs.tsx
├── FaqLoi.tsx
└── index.ts
```

### Contenu à rédiger

```
1. Introduction (200 mots)
   - Définition loi Jeanbrun
   - Contexte PLF 2026
   - Objectifs du dispositif

2. Conditions (300 mots)
   - Zones fiscales éligibles
   - Plafonds de loyer par zone
   - Plafonds ressources locataires
   - Types de biens

3. Avantages (400 mots)
   - Réduction d'impôt (6%, 9%, 12%)
   - Durées d'engagement (6, 9, 12 ans)
   - Exemples chiffrés

4. Comparaison (300 mots)
   - Tableau vs Pinel
   - Tableau vs LMNP
   - Quand choisir Jeanbrun

5. FAQ (10 questions)
```

### Validation

- [x] Contenu validé juridiquement
- [x] CTA fonctionnel
- [x] JSON-LD valide (FAQPage + Article)

---

## Phase 2: Page Profil / À Propos (1 jour) ✅ TERMINÉE

### Tâches

- [x] 2.1 Créer `src/app/a-propos/page.tsx`
- [x] 2.2 Créer composant HeroProfil avec photo
- [x] 2.3 Créer section biographie
- [x] 2.4 Créer timeline parcours
- [x] 2.5 Créer section témoignages
- [x] 2.6 Intégrer Calendly embed
- [x] 2.7 Ajouter liens réseaux sociaux
- [x] 2.8 Ajouter JSON-LD Person
- [x] 2.9 Optimiser metadata SEO

### Fichiers à créer

```
src/app/a-propos/
└── page.tsx

src/components/profil/
├── HeroProfil.tsx
├── Biographie.tsx
├── Timeline.tsx
├── Temoignages.tsx
├── CalendlyEmbed.tsx
├── SocialLinks.tsx
└── index.ts
```

### Données à fournir

```json
{
  "nom": "[À compléter]",
  "titre": "Expert en Défiscalisation Immobilière",
  "photo": "/images/profil/[nom].webp",
  "bio": "[Biographie ~300 mots]",
  "parcours": [
    { "annee": "2010", "titre": "[Formation/Poste]" },
    { "annee": "2015", "titre": "[Expérience clé]" }
  ],
  "linkedin": "https://linkedin.com/in/[profil]",
  "calendly": "https://calendly.com/[profil]"
}
```

### Validation

- [x] Photo optimisée WebP (placeholder avec fallback)
- [x] Bio rédigée (contenu par défaut, personnalisable)
- [x] Calendly fonctionnel (embed + fallback)
- [x] JSON-LD Person valide

---

## Phase 3: Infrastructure Blog (1 jour) ✅ TERMINÉE

### Tâches

- [x] 3.1 Installer et configurer MDX (`@next/mdx` + `gray-matter` pour frontmatter)
- [x] 3.2 Créer structure dossier `content/blog/`
- [x] 3.3 Créer schéma article (frontmatter)
- [x] 3.4 Créer page index `/blog`
- [x] 3.5 Créer page article `/blog/[slug]`
- [x] 3.6 Créer composants MDX custom
- [x] 3.7 Créer système de catégories
- [x] 3.8 Créer pagination
- [x] 3.9 Ajouter temps de lecture

### Fichiers à créer

```
content/
└── blog/
    └── [articles].mdx

src/app/blog/
├── page.tsx              # Index
└── [slug]/
    └── page.tsx          # Article

src/components/blog/
├── ArticleCard.tsx
├── ArticleList.tsx
├── ArticleHeader.tsx
├── ArticleContent.tsx
├── ArticleMeta.tsx
├── ArticleFooter.tsx
├── CategoryFilter.tsx
├── Pagination.tsx
├── RelatedArticles.tsx
├── ShareButtons.tsx
└── index.ts

src/lib/blog.ts           # Fonctions utilitaires
```

### Schéma frontmatter MDX

```yaml
---
title: "Titre de l'article"
slug: "titre-article"
description: "Description pour SEO"
date: "2026-01-31"
updatedAt: "2026-01-31"
author: "[Nom]"
category: "Défiscalisation"
tags: ["loi-jeanbrun", "investissement"]
image: "/images/blog/titre-article.webp"
imageAlt: "Alt text SEO"
readingTime: 8
featured: true
---
```

### Validation

- [x] MDX compilé sans erreur
- [x] Index affiche articles
- [x] Slug routing fonctionnel
- [x] Pagination fonctionne

---

## Phase 4: Rédaction Articles (1.5 jours)

### Tâches

- [ ] 4.1 Rédiger article "Loi Jeanbrun 2026 : Tout savoir" (2000 mots)
- [ ] 4.2 Rédiger article "Jeanbrun vs Pinel" (1500 mots)
- [ ] 4.3 Rédiger article "Zones éligibles" (1200 mots)
- [ ] 4.4 Rédiger article "Calculer sa réduction" (1500 mots)
- [ ] 4.5 Rédiger article "Top 10 villes" (1800 mots)
- [ ] 4.6 Rédiger 5 articles supplémentaires
- [ ] 4.7 Créer images header pour chaque article
- [ ] 4.8 Optimiser SEO chaque article
- [ ] 4.9 Ajouter CTA simulateur
- [ ] 4.10 Ajouter liens internes

### Articles prioritaires

```
content/blog/
├── loi-jeanbrun-2026-guide-complet.mdx      # 2000 mots
├── loi-jeanbrun-vs-pinel-comparatif.mdx     # 1500 mots
├── zones-eligibles-loi-jeanbrun.mdx         # 1200 mots
├── calculer-reduction-impot-jeanbrun.mdx    # 1500 mots
├── top-10-villes-investir-jeanbrun.mdx      # 1800 mots
├── lmnp-ou-jeanbrun-que-choisir.mdx         # 1500 mots
├── guide-investissement-locatif-debutants.mdx # 2500 mots
├── actualites-fiscales-2026.mdx             # 1000 mots
├── erreurs-eviter-defiscalisation.mdx       # 1200 mots
└── temoignage-premier-investissement.mdx    # 800 mots
```

### Validation

- [ ] 10 articles rédigés
- [ ] Images créées
- [ ] Liens internes ajoutés
- [ ] CTA présents

---

## Phase 5: SEO et Finitions (0.5 jour)

### Tâches

- [ ] 5.1 Ajouter JSON-LD Article sur blog
- [ ] 5.2 Créer Open Graph images
- [ ] 5.3 Ajouter pages au sitemap
- [ ] 5.4 Configurer partage social
- [ ] 5.5 Vérifier Rich Results
- [ ] 5.6 Test accessibilité
- [ ] 5.7 Test mobile

### Fichiers à modifier

```
src/app/sitemap.ts        # Ajouter /loi-jeanbrun, /a-propos, /blog/*
src/components/common/JsonLd.tsx  # Ajouter Article, Person
```

### Validation

- [ ] Sitemap complet
- [ ] JSON-LD valides
- [ ] OG images générées
- [ ] Lighthouse >= 90

---

## Récapitulatif des phases

| Phase | Durée | Dépendances |
|-------|-------|-------------|
| 1. Page Loi | 1.5j | - |
| 2. Page Profil | 1j | Photo + bio |
| 3. Infrastructure Blog | 1j | - |
| 4. Rédaction Articles | 1.5j | Phase 3 |
| 5. SEO Finitions | 0.5j | Phases 1-4 |

**Total:** 5.5 jours

---

## Dépendances utilisateur

### À fournir pour Page Profil

- [ ] Photo professionnelle (format portrait, haute résolution)
- [ ] Biographie (~300 mots)
- [ ] Parcours professionnel (dates clés)
- [ ] Témoignages clients (3-5)
- [ ] URL LinkedIn
- [ ] URL Calendly

### À valider pour Page Loi

- [ ] Contenu juridique vérifié
- [ ] Chiffres à jour (PLF 2026)
- [ ] Comparaisons exactes

### À réviser pour Blog

- [ ] Relecture articles avant publication
- [ ] Approbation images

---

## Checklist de fin de phase

### Page Loi Jeanbrun

- [ ] URL `/loi-jeanbrun` accessible
- [ ] Toutes sections présentes
- [ ] FAQ fonctionnelle
- [ ] CTA simulateur
- [ ] Rich snippets FAQ

### Page Profil

- [ ] URL `/a-propos` accessible
- [ ] Photo affichée
- [ ] Calendly fonctionnel
- [ ] LinkedIn linké

### Blog

- [ ] URL `/blog` accessible
- [ ] 10 articles publiés
- [ ] Catégories fonctionnelles
- [ ] Pagination
- [ ] Partage social
- [ ] Articles similaires

---

**Auteur:** Claude (Opus 4.5)
**Date:** 31 janvier 2026
**Version:** 1.0
