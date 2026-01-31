# Feature: Pages Contenu (Loi, Profil, Blog)

**Sprint:** 4 (parallèle aux pages villes)
**Priorité:** HAUTE
**Effort estimé:** 5 jours

---

## Description

Créer les pages de contenu essentielles pour la crédibilité du site : présentation de la loi Jeanbrun, page profil du fondateur, et un blog pour le SEO long-tail.

---

## 1. Page Loi Jeanbrun

### Description

Page complète présentant la loi Jeanbrun (PLF 2026) avec tous les détails fiscaux, conditions d'éligibilité, et comparaisons avec d'autres dispositifs.

### Exigences fonctionnelles

- [ ] FL-1.1: Section "Qu'est-ce que la loi Jeanbrun ?"
- [ ] FL-1.2: Section "Conditions d'éligibilité" (zones, plafonds, durées)
- [ ] FL-1.3: Section "Avantages fiscaux" (calculs, exemples)
- [ ] FL-1.4: Section "Comparaison" (vs Pinel, LMNP, Denormandie)
- [ ] FL-1.5: Section "FAQ" avec accordéon
- [ ] FL-1.6: Section "Timeline" (historique de la loi)
- [ ] FL-1.7: CTA vers simulateur
- [ ] FL-1.8: Breadcrumb et navigation

### Structure de page

```
/loi-jeanbrun/
├── Hero avec illustration
├── Résumé en 3 points clés
├── Qu'est-ce que la loi Jeanbrun ?
├── Conditions d'éligibilité
│   ├── Zones fiscales (A bis, A, B1)
│   ├── Plafonds de loyer
│   ├── Plafonds de ressources locataires
│   └── Types de biens éligibles
├── Avantages fiscaux
│   ├── Tableau des réductions
│   ├── Exemples chiffrés
│   └── Calcul détaillé
├── Comparaison avec autres dispositifs
│   ├── vs Pinel
│   ├── vs LMNP
│   └── vs Denormandie
├── FAQ (10 questions)
├── CTA Simulateur
└── Footer
```

### SEO

```
URL: /loi-jeanbrun
Title: Loi Jeanbrun 2026 : Guide Complet + Simulation | Défiscalisation Immobilière
Description: Découvrez la loi Jeanbrun (PLF 2026) : conditions, avantages fiscaux, zones éligibles. Simulez votre économie d'impôt en 2 minutes.
```

---

## 2. Page Profil / À Propos

### Description

Page présentant le fondateur/expert derrière le simulateur pour créer de la confiance et de la crédibilité.

### Exigences fonctionnelles

- [ ] FP-2.1: Photo professionnelle (format portrait)
- [ ] FP-2.2: Biographie complète
- [ ] FP-2.3: Expertise et certifications
- [ ] FP-2.4: Parcours professionnel (timeline)
- [ ] FP-2.5: Témoignages clients
- [ ] FP-2.6: Liens réseaux sociaux (LinkedIn)
- [ ] FP-2.7: CTA prise de rendez-vous (Calendly)
- [ ] FP-2.8: Section "Pourquoi ce simulateur ?"

### Structure de page

```
/a-propos/
├── Hero avec photo portrait
├── Biographie (~300 mots)
├── Mon parcours
│   ├── Formation
│   └── Expériences clés
├── Mon expertise
│   ├── Défiscalisation
│   ├── Investissement locatif
│   └── Accompagnement investisseurs
├── Pourquoi j'ai créé ce simulateur
├── Ce qu'ils disent de moi (témoignages)
├── Me contacter
│   ├── Calendly embed
│   └── Réseaux sociaux
└── Footer
```

### SEO

```
URL: /a-propos
Title: À Propos | [Nom] - Expert en Défiscalisation Immobilière
Description: Découvrez [Nom], expert en défiscalisation immobilière et créateur du Simulateur Loi Jeanbrun. 15 ans d'expérience en investissement locatif.
```

---

## 3. Blog

### Description

Blog pour SEO long-tail avec articles sur la défiscalisation, l'investissement immobilier, et les actualités fiscales.

### Exigences fonctionnelles

- [ ] FB-3.1: Page index blog `/blog` avec liste articles
- [ ] FB-3.2: Page article `/blog/[slug]`
- [ ] FB-3.3: Catégories (Défiscalisation, Investissement, Actualités)
- [ ] FB-3.4: Tags pour filtrage
- [ ] FB-3.5: Pagination (10 articles/page)
- [ ] FB-3.6: Articles Markdown avec MDX
- [ ] FB-3.7: Temps de lecture estimé
- [ ] FB-3.8: Date de publication et mise à jour
- [ ] FB-3.9: Auteur avec lien profil
- [ ] FB-3.10: Articles similaires en fin d'article
- [ ] FB-3.11: CTA simulateur en fin d'article
- [ ] FB-3.12: Partage réseaux sociaux

### Structure

```
/blog/
├── Index avec cards articles
├── Filtres catégories/tags
└── Pagination

/blog/[slug]/
├── Header avec image
├── Métadonnées (auteur, date, temps lecture)
├── Contenu MDX
├── CTA Simulateur
├── Articles similaires
└── Footer
```

### Articles de lancement (10 minimum)

| Titre | Catégorie | Mots | Priorité |
|-------|-----------|------|----------|
| Loi Jeanbrun 2026 : Tout ce qu'il faut savoir | Défiscalisation | 2000 | Haute |
| Loi Jeanbrun vs Pinel : Comparatif détaillé | Défiscalisation | 1500 | Haute |
| Les zones éligibles à la loi Jeanbrun | Défiscalisation | 1200 | Haute |
| Comment calculer sa réduction d'impôt Jeanbrun | Défiscalisation | 1500 | Haute |
| Top 10 des villes pour investir en Jeanbrun | Investissement | 1800 | Moyenne |
| LMNP ou Jeanbrun : Que choisir en 2026 ? | Défiscalisation | 1500 | Moyenne |
| Guide de l'investissement locatif pour débutants | Investissement | 2500 | Moyenne |
| Actualités fiscales 2026 : Ce qui change | Actualités | 1000 | Basse |
| Erreurs à éviter en défiscalisation immobilière | Investissement | 1200 | Basse |
| Témoignage : Mon premier investissement Jeanbrun | Témoignage | 800 | Basse |

### SEO Blog

```
URL: /blog
Title: Blog Investissement Immobilier | Conseils Défiscalisation 2026
Description: Conseils d'experts en investissement immobilier et défiscalisation. Articles sur la loi Jeanbrun, LMNP, Pinel et stratégies patrimoniales.

URL: /blog/[slug]
Title: [Titre Article] | Simulateur Loi Jeanbrun
Description: [Première phrase article ou résumé]
```

---

## Exigences non-fonctionnelles

### NFR-1: Performance

- [ ] Core Web Vitals >= 90
- [ ] Pages statiques (SSG)
- [ ] Images optimisées (WebP, lazy loading)
- [ ] Fonts préchargés

### NFR-2: SEO

- [ ] Meta title/description uniques
- [ ] JSON-LD Article pour blog
- [ ] JSON-LD Person pour profil
- [ ] Open Graph images
- [ ] Canonical URLs

### NFR-3: Accessibilité

- [ ] WCAG 2.1 AA
- [ ] Skip links
- [ ] Alt text images
- [ ] Contraste suffisant

### NFR-4: UX

- [ ] Navigation claire
- [ ] CTA visibles
- [ ] Mobile-first
- [ ] Temps de lecture affiché

---

## Critères d'acceptation

### AC-1: Page Loi ✅

- [x] Toutes les sections présentes
- [x] Contenu juridiquement exact
- [x] CTA simulateur fonctionnel
- [x] Rich snippets FAQ

### AC-2: Page Profil ✅

- [x] Photo professionnelle affichée (placeholder avec fallback)
- [x] Biographie complète (contenu par défaut)
- [x] Calendly embed fonctionnel
- [x] LinkedIn linké

### AC-3: Blog

- [ ] 10 articles minimum au lancement
- [ ] Pagination fonctionnelle
- [ ] Filtres catégories
- [ ] Partage social
- [ ] Articles similaires

---

## Dépendances

| Dépendance | Type | Responsable |
|------------|------|-------------|
| Contenu page loi | Rédaction | À fournir |
| Bio + photo profil | Contenu | À fournir |
| Articles blog | Rédaction | IA + révision |
| Calendly account | Service | À créer |

---

**Auteur:** Claude (Opus 4.5)
**Date:** 31 janvier 2026
**Version:** 1.0
