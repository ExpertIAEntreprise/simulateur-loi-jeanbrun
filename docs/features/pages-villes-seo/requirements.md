# Feature: Pages Villes SEO

**Sprint:** 4 (S7-S8)
**Priorité:** CRITIQUE
**Effort estimé:** 20 jours

---

## Description

Créer 300+ pages de villes optimisées SEO avec une structure hiérarchique :
- **51 métropoles** : pages complètes avec données DVF, INSEE, programmes, baromètre
- **~250 villes périphériques** : mini landing pages avec simulateur pré-rempli et lien vers métropole parent

Chaque page sert de point d'entrée SEO longue traîne ("loi jeanbrun villeurbanne") et convertit vers le simulateur.

**Modèle inspiré de :** [Glass Pro 49](https://glasspro49.fr/villes/) - structure SEO locale exemplaire

---

## Exigences fonctionnelles

### FR-1: Pages Métropoles (51 villes principales)

- [ ] FR-1.1: Générer 51 pages `/villes/[slug]` statiquement au build
- [ ] FR-1.2: Afficher les données marché DVF (prix m², évolution, transactions)
- [ ] FR-1.3: Afficher les données INSEE (population, revenus)
- [ ] FR-1.4: Afficher les plafonds Jeanbrun par zone fiscale (A bis, A, B1)
- [ ] FR-1.5: Lister les programmes neufs éligibles (top 6)
- [ ] FR-1.6: Afficher les villes proches (maillage interne)
- [ ] FR-1.7: Inclure un simulateur pré-rempli avec la ville
- [ ] FR-1.8: **Section "Zones d'Investissement"** avec grille de villes périphériques
- [ ] FR-1.9: Chaque card périphérique : nom, zone fiscale, "En savoir plus →"

### FR-1bis: Pages Villes Périphériques (~250 villes)

**Structure inspirée de Glass Pro 49** - Mini landing pages SEO

- [ ] FR-1bis.1: Générer ~250 pages `/villes/[slug]` pour villes périphériques
- [ ] FR-1bis.2: **Breadcrumb** : Accueil / Villes / [Ville périphérique]
- [ ] FR-1bis.3: **Badge département** : ex. "Rhône (69)"
- [ ] FR-1bis.4: **H1 dynamique** : "Loi Jeanbrun à [Ville]"
- [ ] FR-1bis.5: **Description personnalisée** (300-400 mots) générée par IA
- [ ] FR-1bis.6: **2 CTAs** : "Simuler mon investissement →" + "Voir les programmes"
- [ ] FR-1bis.7: **Sidebar droite** avec :
  - "Pourquoi investir à [Ville] ?" (checklist dynamique)
  - Population
  - Prix m²
  - Zone fiscale
  - Plafond loyer
- [ ] FR-1bis.8: **Section simulateur pré-rempli** avec ville
- [ ] FR-1bis.9: **Section programmes neufs** (si disponibles)
- [ ] FR-1bis.10: **Section villes proches** (maillage interne)
- [ ] FR-1bis.11: **Lien retour métropole** : "Voir aussi Lyon et ses X programmes"

### FR-1ter: Section Homepage "Nos Zones d'Investissement"

- [ ] FR-1ter.1: Grille de cards simples (sans photos)
- [ ] FR-1ter.2: Ville principale en premier (ex: Lyon)
- [ ] FR-1ter.3: Villes périphériques majeures (5-8 par métropole)
- [ ] FR-1ter.4: Badge zone fiscale sur chaque card
- [ ] FR-1ter.5: CTA "Voir toutes nos villes →"

### FR-2: Baromètre Jeanbrun Mensuel

- [ ] FR-2.1: Générer automatiquement un baromètre par ville chaque 1er du mois
- [ ] FR-2.2: Calculer un score d'attractivité (0-100) basé sur prix, évolution, rendement
- [ ] FR-2.3: Générer une analyse IA (~300 mots) par ville
- [ ] FR-2.4: Afficher la meilleure opportunité du mois
- [ ] FR-2.5: Pages accessibles via `/barometre/[ville]/[mois]`
- [ ] FR-2.6: Historique des baromètres accessible

### FR-2bis: Baromètre Sidebar (pages périphériques)

**Affichage compact du baromètre dans la sidebar des pages villes**

- [ ] FR-2bis.1: **Rendement moyen** : ex. "4.2%"
- [ ] FR-2bis.2: **Évolution prix** : ex. "+3.2% /an"
- [ ] FR-2bis.3: **Tension locative** : étoiles (⭐⭐⭐⭐⭐)
- [ ] FR-2bis.4: **Score investissement** : ex. "82/100"
- [ ] FR-2bis.5: Mise à jour automatique via CJeanbrunBarometre

### FR-3: Contenu SEO Unique

- [ ] FR-3.1: Générer du contenu éditorial unique par ville (400-600 mots métropoles, 300-400 mots périphériques)
- [ ] FR-3.2: Inclure des informations sur les quartiers
- [ ] FR-3.3: Metadata dynamiques (title, description, OG)
- [ ] FR-3.4: JSON-LD enrichi (Place, LocalBusiness)
- [ ] FR-3.5: Sitemap.xml dynamique incluant villes et baromètres

### FR-3bis: FAQ Schema.org par Ville (SEO Featured Snippets)

**Génération automatique de FAQ pour rich snippets Google**

- [ ] FR-3bis.1: **3-5 questions par ville** générées automatiquement
- [ ] FR-3bis.2: Questions types :
  - "Quel est le plafond de loyer Jeanbrun à [Ville] ?"
  - "[Ville] est-elle éligible à la loi Jeanbrun ?"
  - "Quel rendement espérer à [Ville] ?"
  - "Quels programmes neufs à [Ville] ?"
- [ ] FR-3bis.3: **JSON-LD FAQPage** valide
- [ ] FR-3bis.4: Réponses personnalisées avec données locales
- [ ] FR-3bis.5: Stockage dans champ `faqItems` (JSON) dans EspoCRM

### FR-3ter: Arguments d'Investissement Personnalisés

**Pas juste "Zone A + transports" - des vrais arguments locaux**

- [ ] FR-3ter.1: **Arguments personnalisés par ville** (4-6 points)
- [ ] FR-3ter.2: Exemples :
  - Villeurbanne : "Campus La Doua = 40 000 étudiants"
  - Nancy : "Technopôle = emplois qualifiés"
  - Bordeaux : "LGV Paris 2h = attractivité"
- [ ] FR-3ter.3: Stockage dans champ `argumentsInvestissement` (JSON array)
- [ ] FR-3ter.4: Génération IA avec données locales (MoltBot)
- [ ] FR-3ter.5: Affichage en checklist dans sidebar

### FR-4: Visuels et Photos (Optimisées SEO)

- [ ] FR-4.1: Afficher les photos des programmes immobiliers
- [ ] FR-4.2: Afficher une photo représentative de la ville (monument/lieu emblématique)
- [ ] FR-4.3: Photo ville dans un cercle dans le bandeau header
- [ ] FR-4.4: Cartes interactives avec localisation des programmes
- [ ] FR-4.5: Graphiques d'évolution des prix (Recharts)

### FR-4bis: Optimisation SEO des Images (MoltBot)

**Toutes les images doivent être optimisées pour le SEO :**

- [ ] FR-4bis.1: **Renommage SEO** - Noms de fichiers descriptifs avec mots-clés
  - Photos villes : `loi-jeanbrun-{ville}.webp` (ex: `loi-jeanbrun-lyon.webp`)
  - Photos programmes : `programme-{nom}-{promoteur}-{ville}-{index}.webp`
- [ ] FR-4bis.2: **Compression** - Taille max 100Ko (programmes) / 80Ko (villes)
- [ ] FR-4bis.3: **Format WebP** - Conversion automatique en WebP
- [ ] FR-4bis.4: **Dimensions optimales** :
  - Villes (cercle) : 800x800px carré
  - Programmes : 1200x800px
- [ ] FR-4bis.5: **Alt text SEO** automatique :
  - Villes : "Investir avec la loi Jeanbrun à {Ville}"
  - Programmes : "Programme immobilier neuf {Nom} par {Promoteur} à {Ville}"
- [ ] FR-4bis.6: **Lazy loading** sur toutes les images
- [ ] FR-4bis.7: **srcset** pour images responsives

### FR-5: Index et Navigation

- [ ] FR-5.1: Page index `/villes` avec filtres (région, zone, prix)
- [ ] FR-5.2: Filtres par zone fiscale
- [ ] FR-5.3: Recherche par nom de ville
- [ ] FR-5.4: Tri par score d'attractivité, prix, nb programmes

---

## Exigences non-fonctionnelles

### NFR-1: Performance

- [ ] Core Web Vitals >= 90 mobile (Lighthouse)
- [ ] TTFB < 200ms pour pages SSG
- [ ] Build production < 5 minutes (50 pages)
- [ ] Images optimisées (WebP, lazy loading)

### NFR-2: SEO

- [ ] Pages indexables par Google
- [ ] Rich snippets via JSON-LD
- [ ] Sitemap.xml valide
- [ ] Canonical URLs
- [ ] hreflang si multi-langue futur

### NFR-3: Données

- [ ] Refresh DVF hebdomadaire
- [ ] Refresh INSEE mensuel
- [ ] Scraping programmes quotidien
- [ ] Génération baromètre mensuelle automatique

### NFR-4: UX

- [ ] Responsive (mobile-first)
- [ ] Accessibilité WCAG 2.1 AA
- [ ] Navigation fluide entre villes
- [ ] CTA simulateur visible

---

## Sources de données

| Source | API | Données | Fréquence |
|--------|-----|---------|-----------|
| DVF CEREMA | api-datafoncier.cerema.fr | Prix m², historique 5 ans | Hebdo |
| INSEE | geo.api.gouv.fr | Population, revenus | Mensuel |
| geo.api.gouv.fr | geo.api.gouv.fr | Géocodage, communes | Une fois |
| MoltBot (Scraping) | Via EspoCRM | Programmes neufs, photos | Quotidien |
| OpenRouter (IA) | openrouter.ai | Contenu éditorial, analyse | Mensuel |

---

## Entités EspoCRM

**URL API:** `https://espocrm.expert-ia-entreprise.fr/api/v1`
**Status:** Configuré le 31/01/2026

### CJeanbrunVille (enrichie) ✅

```
Existants: name, slug, zoneFiscale, population
Nouveaux géo: latitude, longitude, codeInsee, departementId, regionId
Nouveaux DVF: prixM2Moyen, prixM2Median, evolutionPrix1An, nbTransactions12Mois
Nouveaux INSEE: populationCommune, revenuMedian
Nouveaux visuels: photoVille (URL photo représentative), photoVilleAlt
Contenu: description, contenuEditorial, metaTitle, metaDescription

🆕 Champs périphériques (à créer par MoltBot):
├── isMetropole (boolean) - true pour les 51 métropoles principales
├── metropoleParentId (link → CJeanbrunVille, nullable) - référence vers métropole parent
├── argumentsInvestissement (text/JSON) - ["Campus 40k étudiants", "Métro ligne A", ...]
├── faqItems (text/JSON) - [{"q": "Plafond loyer ?", "a": "14.03€/m²"}, ...]
└── villesProches (link-multiple → CJeanbrunVille) - relation many-to-many
```

### CJeanbrunProgramme (enrichie) ✅

```
Existants: name, slug, promoteur, villeId, urlExterne
Nouveaux: adresseComplete, latitude, longitude
Prix: prixMin, prixMax, prixM2Moyen
Lots: nbLotsTotal, nbLotsDisponibles, typesLots[]
Images: imagePrincipale (URL), imageAlt (text alt SEO)
Dates: dateLivraison, dateScrap
```

### CJeanbrunBarometre (créée 31/01/2026) ✅

```
villeId, mois (YYYY-MM-01)
scoreAttractivite (0-100)
prixM2, evolutionPrixMois
loyerM2, rendementBrut
nbProgrammesActifs
meilleureOpportuniteId (link programme)
analyseIA (text ~300 mots)
```

### CJeanbrunRegion / CJeanbrunDepartement (nouveau)

```
Region: id, name, slug, code (13 régions)
Departement: id, name, slug, code, regionId (101 départements)
```

---

## Critères d'acceptation

### AC-1: Pages Métropoles (51)

- [ ] 51 pages métropoles générées au build sans erreur
- [ ] Chaque page affiche prix m², évolution, programmes
- [ ] Section "Zones d'Investissement" avec villes périphériques
- [ ] Core Web Vitals >= 90 mobile
- [ ] JSON-LD valide (Rich Results Test)

### AC-1bis: Pages Périphériques (~250)

- [ ] ~250 pages périphériques générées au build sans erreur
- [ ] Breadcrumb correct (Accueil / Villes / [Ville])
- [ ] Sidebar avec baromètre, arguments, données locales
- [ ] Simulateur pré-rempli fonctionnel
- [ ] Lien retour vers métropole parent
- [ ] FAQ Schema.org valide (FAQPage JSON-LD)

### AC-2: Baromètre

- [ ] 51 baromètres générés mensuellement
- [ ] Score d'attractivité calculé correctement
- [ ] Analyse IA cohérente et unique par ville
- [ ] Navigation entre mois fonctionnelle

### AC-3: SEO

- [ ] Sitemap.xml contient toutes les URLs
- [ ] Meta description unique par page
- [ ] Canonical correct
- [ ] Pages indexées dans Google (30j après launch)

### AC-4: Données

- [ ] DVF mis à jour hebdomadairement (cron)
- [ ] Programmes scrapés quotidiennement (MoltBot)
- [ ] Photos programmes affichées
- [ ] Photo ville affichée

---

## Dépendances

| Dépendance | Type | Responsable |
|------------|------|-------------|
| Entités EspoCRM | Prérequis | VPS CardImmo |
| 51 métropoles importées | Prérequis | Fait (Phase 1) |
| **~250 villes périphériques** | Parallèle | **MoltBot** |
| **Champs périphériques EspoCRM** | Parallèle | **MoltBot** |
| **Contenu éditorial IA** | Parallèle | **MoltBot** |
| **Arguments investissement** | Parallèle | **MoltBot** |
| **FAQ par ville** | Parallèle | **MoltBot** |
| Scraping programmes | Parallèle | MoltBot |
| Photos villes (métropole parent) | Parallèle | MoltBot |
| API DVF | Externe | CEREMA (gratuit) |
| API INSEE | Externe | geo.api.gouv.fr (gratuit) |

---

## Répartition des responsabilités

### MoltBot (Scraping & Enrichissement données)

| Tâche | Description |
|-------|-------------|
| Import villes périphériques | Identifier et importer ~250 villes (5-8 par métropole) |
| Champs EspoCRM | Créer isMetropole, metropoleParentId, argumentsInvestissement, faqItems |
| Contenu éditorial IA | Générer 300-400 mots par ville périphérique |
| Arguments personnalisés | Générer 4-6 arguments locaux par ville |
| FAQ | Générer 3-5 questions/réponses par ville |
| Photos | Photo métropole parent réutilisée + alt text différent |
| Données DVF/INSEE | Enrichir avec données locales |

### Claude (UI & Intégration)

| Tâche | Description |
|-------|-------------|
| API Client EspoCRM | Fonctions TypeScript typées |
| Composants UI | BarometreSidebar, FaqVille, ArgumentsChecklist, etc. |
| Pages Next.js | `/villes/[slug]` pour métropoles et périphériques |
| JSON-LD SEO | Place, FAQPage, LocalBusiness |
| Tests | E2E Playwright, couverture 80% |

---

**Auteur:** Claude (Opus 4.5)
**Date:** 31 janvier 2026
**Version:** 2.0

### Historique des modifications

| Version | Date | Modifications |
|---------|------|---------------|
| 1.0 | 31/01/2026 | Création initiale |
| 1.1 | 31/01/2026 | Ajout URL CRM, statut entités configurées |
| 2.0 | 31/01/2026 | **Ajout structure pages villes périphériques** (inspiré Glass Pro 49), nouveaux champs EspoCRM, FAQ Schema.org, arguments personnalisés, répartition MoltBot/Claude |
