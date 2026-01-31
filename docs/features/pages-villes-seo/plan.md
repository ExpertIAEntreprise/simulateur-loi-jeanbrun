# Plan: Pages Villes SEO

**Sprint:** 4 (S7-S8)
**Effort:** 20 jours
**Statut:** Phase 1 terminée ✅ (31/01/2026) - En attente Phase 2 (MoltBot pour données)

---

## Architecture pages villes (NOUVEAU)

### Structure hiérarchique

```
/villes/                     # Index toutes villes (filtres, recherche)
├── /villes/lyon/            # Page métropole (51 pages)
│   ├── Données complètes (DVF, INSEE, programmes)
│   ├── Baromètre mensuel
│   └── Section "Zones d'Investissement" → villes périphériques
│
├── /villes/villeurbanne/    # Page périphérique (~250 pages)
│   ├── Mini landing page
│   ├── Breadcrumb: Accueil / Villes / Villeurbanne
│   ├── Sidebar: baromètre compact + arguments + données
│   ├── Simulateur pré-rempli
│   └── Lien retour: "Voir aussi Lyon"
```

### Modèle inspiré de

**Glass Pro 49** - https://glasspro49.fr/villes/

| Élément Glass Pro 49 | Adaptation Jeanbrun |
|---------------------|---------------------|
| "Laveur de vitres à X" | "Loi Jeanbrun à X" |
| Demander un devis | Simuler mon investissement |
| Population | Population + Prix m² + Zone |
| Service personnalisé | Simulation personnalisée |
| Breadcrumb | Accueil / Villes / [Ville] |

---

## Configuration EspoCRM (prérequis)

### Accès API

| Paramètre | Valeur |
|-----------|--------|
| **URL API** | `https://espocrm.expert-ia-entreprise.fr/api/v1` |
| **API Key** | `${ESPOCRM_API_KEY}` (voir .env) |

### Entités disponibles (configurées le 31/01/2026)

| Entité | Status | Champs principaux |
|--------|--------|-------------------|
| `CJeanbrunVille` | ✅ Existe (51 villes) | nom, codePostal, zoneFiscale, photoVille, photoVilleAlt, contenuEditorial, metaTitle, metaDescription, **isMetropole**, **metropoleParent**, **argumentsInvestissement**, **faqItems**, **villesProches** |
| `CJeanbrunProgramme` | ✅ Existe (153 prog.) | name, villeId, promoteur, prixMin, prixMax, imagePrincipale, imageAlt |
| `CJeanbrunBarometre` | ✅ Créée (vide) | villeId, mois, scoreAttractivite, prixM2, evolutionPrixMois, loyerM2, rendementBrut, nbProgrammesActifs, meilleureOpportunite, analyseIA |
| `CJeanbrunRegion` | ✅ Créée (31/01/2026) | name, slug, code |
| `CJeanbrunDepartement` | ✅ Créée (31/01/2026) | name, slug, code, regionId |

### Variable d'environnement

```env
ESPOCRM_API_KEY=1a97a8b3ca73fd5f1cdfed6c4f5341ec
ESPOCRM_API_URL=https://espocrm.expert-ia-entreprise.fr/api/v1
```

---

## Phase 1: Entités EspoCRM (1 jour) ✅ TERMINÉE

### Tâches

- [x] 1.1 Créer entité `CJeanbrunRegion` (13 régions) ✅ Fait 31/01/2026
- [x] 1.2 Créer entité `CJeanbrunDepartement` (101 départements) ✅ Fait 31/01/2026
- [x] 1.3 Ajouter champ `photoVille` (URL) sur `CJeanbrunVille` ✅ Fait 31/01/2026
- [x] 1.4 Ajouter champ `imagePrincipale` + `imageAlt` sur `CJeanbrunProgramme` ✅ Fait 31/01/2026
- [x] 1.5 Créer entité `CJeanbrunBarometre` ✅ Fait 31/01/2026
- [x] 1.6 Ajouter relations entre entités ✅ Fait 31/01/2026

### 🆕 Tâches MoltBot - Champs périphériques

- [x] 1.7 Ajouter champ `isMetropole` (boolean) sur `CJeanbrunVille` ✅ Fait 31/01/2026
- [x] 1.8 Ajouter champ `metropoleParentId` (link → CJeanbrunVille) sur `CJeanbrunVille` ✅ Fait 31/01/2026
- [x] 1.9 Ajouter champ `argumentsInvestissement` (text/JSON) sur `CJeanbrunVille` ✅ Fait 31/01/2026
- [x] 1.10 Ajouter champ `faqItems` (text/JSON) sur `CJeanbrunVille` ✅ Fait 31/01/2026
- [x] 1.11 Créer relation `villesProches` (many-to-many → CJeanbrunVille) ✅ Fait 31/01/2026

### Fichiers à créer/modifier

- EspoCRM Admin → Entity Manager → Nouvelles entités
- `docs/technical/ESPOCRM-SCHEMA.md` → Mettre à jour

### Configuration effectuée (31/01/2026)

**Fichiers EspoCRM modifiés sur le VPS** (Docker container `espocrm`) :

```
/var/www/html/custom/Espo/Custom/Resources/metadata/
├── entityDefs/
│   ├── CJeanbrunVille.json      # +photoVille, +photoVilleAlt, +contenuEditorial, +metaTitle, +metaDescription
│   ├── CJeanbrunProgramme.json  # +imagePrincipale, +imageAlt
│   └── CJeanbrunBarometre.json  # Nouvelle entité (11 champs)
├── scopes/
│   └── CJeanbrunBarometre.json  # Scope avec type: "Base"
└── Controllers/
    └── CJeanbrunBarometre.php   # Controller PHP (extends Base)
```

**Permissions API** : Rôle "API Full Access" → CJeanbrunBarometre = All

### Validation

- [x] Entités accessibles via API ✅ Vérifié
- [x] Relations fonctionnelles ✅ Vérifié 31/01/2026

### Documentation créée

- `/root/docs/features/prospection/ESPOCRM-JEANBRUN-ENTITIES-PHASE1.md` - Documentation technique
- `/root/docs/features/prospection/PHASE1-SUMMARY.md` - Résumé exécutif
- `/root/docs/features/prospection/QUICK-REFERENCE-JEANBRUN.md` - Aide-mémoire
- `/root/scripts/validate-jeanbrun-entities.sh` - Script de validation
- `/root/scripts/phase2-setup-jeanbrun.sh` - Menu interactif Phase 2

---

## Phase 2: Enrichissement données (MoltBot) ⚡

> **Responsable:** MoltBot
> Cette phase est gérée entièrement par MoltBot

### Tâches MoltBot

- [ ] 2.1 Géocodage villes (geo.api.gouv.fr)
- [ ] 2.2 Import données DVF CEREMA (prix m², évolution)
- [ ] 2.3 Import données INSEE (population, revenus)
- [ ] 2.4 Génération baromètre mensuel
- [ ] 2.5 Génération contenu éditorial IA

### 🆕 Tâches MoltBot - Villes périphériques

- [ ] 2.6 **Identifier villes périphériques** (5-8 par métropole, pop > 8000, < 25km)
- [ ] 2.7 **Import ~250 villes périphériques** dans EspoCRM
- [ ] 2.8 **Renseigner `metropoleParentId`** pour chaque périphérique
- [ ] 2.9 **Générer `contenuEditorial`** (300-400 mots IA par ville)
- [ ] 2.10 **Générer `argumentsInvestissement`** (4-6 arguments locaux par ville)
- [ ] 2.11 **Générer `faqItems`** (3-5 questions/réponses par ville)
- [ ] 2.12 **Photos** : réutiliser photo métropole parent avec alt text différent

### Critères villes périphériques

| Critère | Valeur |
|---------|--------|
| Population minimum | > 8 000 habitants |
| Distance métropole | < 25 km |
| Même département | Préféré |
| Zone fiscale | Même ou adjacente |

### Exemple Nancy

```
Métropole: Nancy (isMetropole: true)
Périphériques (metropoleParentId: Nancy):
├── Vandœuvre-lès-Nancy
├── Laxou
├── Villers-lès-Nancy
├── Maxéville
├── Malzéville
├── Saint-Max
└── Essey-lès-Nancy
```

### Validation

- [ ] ~250 villes périphériques importées
- [ ] Chaque périphérique lié à sa métropole parent
- [ ] Contenu éditorial unique par ville
- [ ] Arguments personnalisés (pas génériques)
- [ ] FAQ valide pour JSON-LD

---

## Phase 3: API Client EspoCRM (1 jour)

### Tâches

- [ ] 3.1 Créer `src/lib/api/espocrm.ts` avec fonctions typées
- [ ] 3.2 Fonction `getJeanbrunVilles()` avec filtres
- [ ] 3.3 Fonction `getJeanbrunVilleBySlug(slug)`
- [ ] 3.4 Fonction `getJeanbrunProgrammes(villeId)`
- [ ] 3.5 Fonction `getLatestBarometre(villeId)`
- [ ] 3.6 Fonction `getBarometreHistorique(villeId, months)`

### Fichiers à créer/modifier

```
src/lib/api/
├── espocrm.ts         # Client API
├── espocrm.types.ts   # Types TypeScript
└── index.ts           # Exports
```

### Validation

- [ ] Types stricts (no any)
- [ ] Erreurs gérées
- [ ] Caching configurable

---

## Phase 4: Composants UI (4 jours)

### Tâches - Composants existants

- [ ] 4.1 Créer `DonneesMarche` (prix DVF, évolution, graphique)
- [ ] 4.2 Créer `HistoriquePrix` (graphique Recharts)
- [ ] 4.3 Créer `DonneesInsee` (population, revenus)
- [ ] 4.4 Créer `PlafondsJeanbrun` (3 niveaux, tableau)
- [ ] 4.5 Créer `ProgrammesList` (cards programmes avec photos)
- [ ] 4.6 Créer `ProgrammeCard` (card individuelle)
- [ ] 4.7 Créer `SimulateurPreRempli` (mini formulaire)
- [ ] 4.8 Créer `VillesProches` (maillage interne)
- [ ] 4.9 Créer `BarometreResume` (score + indicateurs)
- [ ] 4.10 Créer `ContenuEditorial` (prose formatée)
- [ ] 4.11 Créer `PhotoVille` (image hero avec fallback)

### 🆕 Tâches - Composants pages périphériques

- [ ] 4.12 Créer `BarometreSidebar` (version compacte pour sidebar)
  - Rendement moyen, évolution prix, tension locative, score
- [ ] 4.13 Créer `ArgumentsInvestissement` (checklist dynamique)
  - Affiche les arguments personnalisés de `argumentsInvestissement`
- [ ] 4.14 Créer `FaqVille` (accordéon FAQ + JSON-LD FAQPage)
  - Parse `faqItems` et génère JSON-LD automatiquement
- [ ] 4.15 Créer `CarteVille` (Leaflet/Mapbox avec pin)
  - Pin sur la ville + programmes proches
- [ ] 4.16 Créer `TemoignageLocalise` (pool rotation)
  - 10 témoignages génériques, rotation aléatoire
- [ ] 4.17 Créer `VillePeripheriqueCard` (card pour section "Zones d'Investissement")
  - Nom, zone fiscale, "En savoir plus →"
- [ ] 4.18 Créer `LienMetropoleParent` (lien retour vers métropole)
  - "Voir aussi Lyon et ses X programmes"

### Fichiers à créer

```
src/components/villes/
├── DonneesMarche.tsx
├── HistoriquePrix.tsx
├── DonneesInsee.tsx
├── PlafondsJeanbrun.tsx
├── ProgrammesList.tsx
├── ProgrammeCard.tsx
├── SimulateurPreRempli.tsx
├── VillesProches.tsx
├── BarometreResume.tsx
├── ContenuEditorial.tsx
├── PhotoVille.tsx
├── 🆕 BarometreSidebar.tsx
├── 🆕 ArgumentsInvestissement.tsx
├── 🆕 FaqVille.tsx
├── 🆕 CarteVille.tsx
├── 🆕 TemoignageLocalise.tsx
├── 🆕 VillePeripheriqueCard.tsx
├── 🆕 LienMetropoleParent.tsx
└── index.ts
```

### Validation

- [ ] Composants responsive
- [ ] Fallbacks si données manquantes
- [ ] Accessibilité (ARIA)
- [ ] JSON-LD FAQPage valide (FaqVille)

---

## Phase 5: Pages Villes (3 jours)

### Tâches - Page Métropole

- [ ] 5.1 Créer `src/app/villes/[slug]/page.tsx`
- [ ] 5.2 Implémenter `generateStaticParams()` pour SSG (51 métropoles + ~250 périphériques)
- [ ] 5.3 Implémenter `generateMetadata()` dynamique
- [ ] 5.4 Layout avec header, main content, sidebar
- [ ] 5.5 Breadcrumb navigation
- [ ] 5.6 Score attractivité badge
- [ ] 5.7 Sections : marché, programmes, simulateur, villes proches

### 🆕 Tâches - Section "Zones d'Investissement" (métropoles)

- [ ] 5.8 Créer section "Nos Zones d'Investissement" sur page métropole
- [ ] 5.9 Grille de `VillePeripheriqueCard` (5-8 villes)
- [ ] 5.10 CTA "Voir toutes nos villes →"

### 🆕 Tâches - Page Périphérique (même route `/villes/[slug]`)

- [ ] 5.11 Détecter si ville est métropole ou périphérique (`isMetropole`)
- [ ] 5.12 **Layout périphérique** différent :
  - Sidebar droite (pas full width)
  - Moins de sections
- [ ] 5.13 **Breadcrumb** : Accueil / Villes / [Ville périphérique]
- [ ] 5.14 **Badge département** : ex. "Rhône (69)"
- [ ] 5.15 **H1** : "Loi Jeanbrun à [Ville]"
- [ ] 5.16 **Description personnalisée** (contenuEditorial)
- [ ] 5.17 **2 CTAs** : "Simuler mon investissement →" + "Voir les programmes"
- [ ] 5.18 **Sidebar droite** :
  - `ArgumentsInvestissement` (checklist)
  - `BarometreSidebar` (données compactes)
  - Données locales (population, prix m², zone)
- [ ] 5.19 **Section simulateur pré-rempli**
- [ ] 5.20 **Section programmes** (si disponibles)
- [ ] 5.21 **Section FAQ** (`FaqVille`)
- [ ] 5.22 **Section villes proches**
- [ ] 5.23 **Lien retour métropole** (`LienMetropoleParent`)

### Fichiers à créer/modifier

```
src/app/villes/
├── page.tsx              # Index villes
├── [slug]/
│   └── page.tsx          # Page ville (métropole OU périphérique)
└── layout.tsx            # Layout partagé

src/components/villes/
├── MetropoleLayout.tsx   # Layout spécifique métropoles
├── PeripheriqueLayout.tsx # Layout spécifique périphériques
└── ZonesInvestissement.tsx # Grille villes périphériques
```

### Validation

- [ ] Build SSG sans erreur (300+ pages)
- [ ] Metadata différentes par page
- [ ] Navigation fonctionnelle
- [ ] Différenciation métropole/périphérique
- [ ] Lien retour métropole fonctionnel

---

## Phase 6: Page Baromètre (1.5 jours)

### Tâches

- [ ] 6.1 Créer `src/app/barometre/[ville]/[mois]/page.tsx`
- [ ] 6.2 Créer composants baromètre (score, indicateurs, analyse)
- [ ] 6.3 Historique avec graphique
- [ ] 6.4 CTA vers simulateur
- [ ] 6.5 Navigation entre mois

### Fichiers à créer

```
src/app/barometre/
├── page.tsx                     # Index baromètres
└── [ville]/
    └── [mois]/
        └── page.tsx             # Baromètre détail

src/components/barometre/
├── ScoreAttractivite.tsx
├── IndicateursMarche.tsx
├── AnalyseIA.tsx
├── MeilleureOpportunite.tsx
├── BarometreHistorique.tsx
└── index.ts
```

### Validation

- [ ] Navigation mois fonctionnelle
- [ ] Score affiché correctement
- [ ] Analyse IA rendue en prose

---

## Phase 7: Index Villes (1 jour)

### Tâches

- [ ] 7.1 Créer page `/villes` avec liste filtrable
- [ ] 7.2 Filtres : région, zone fiscale, fourchette prix
- [ ] 7.3 Tri : score, prix, nb programmes
- [ ] 7.4 Recherche par nom
- [ ] 7.5 Pagination ou infinite scroll
- [ ] 7.6 Cards villes avec miniatures

### Fichiers à créer

```
src/app/villes/page.tsx
src/components/villes/VilleCard.tsx
src/components/villes/VilleFilters.tsx
src/components/villes/VilleSearch.tsx
```

### Validation

- [ ] Filtres fonctionnels
- [ ] URL reflète les filtres (?zone=A)
- [ ] Performance avec 50+ villes

---

## Phase 8: JSON-LD et SEO (1 jour)

### Tâches

- [ ] 8.1 Créer `JsonLdVille` component (Place, LocalBusiness)
- [ ] 8.2 Créer `JsonLdProgramme` (RealEstateAgent)
- [ ] 8.3 Créer sitemap.xml dynamique
- [ ] 8.4 Créer robots.txt
- [ ] 8.5 Valider avec Rich Results Test

### Fichiers à créer

```
src/components/common/
├── JsonLd.tsx
└── JsonLdVille.tsx

src/app/
├── sitemap.ts          # Sitemap dynamique
└── robots.ts           # robots.txt
```

### Validation

- [ ] Rich Results Test OK
- [ ] Sitemap valide (XML)
- [ ] Toutes URLs listées

---

## Phase 9: Maillage Interne (0.5 jour)

### Tâches

- [ ] 9.1 Composant villes proches (même région)
- [ ] 9.2 Liens vers baromètre depuis page ville
- [ ] 9.3 Liens vers programmes depuis page ville
- [ ] 9.4 Footer avec top villes par zone

### Validation

- [ ] Aucun lien cassé
- [ ] Crawl complet possible

---

## Phase 10: Crons et Automatisation (0.5 jour)

### Tâches

- [ ] 10.1 Configurer cron DVF (hebdo dimanche 3h)
- [ ] 10.2 Configurer cron INSEE (mensuel 1er 2h)
- [ ] 10.3 Configurer cron baromètre (mensuel 1er 8h)
- [ ] 10.4 Script health_check.py pour alertes
- [ ] 10.5 Logs centralisés

### Fichiers à créer/modifier

```bash
# Ajouter dans crontab VPS CardImmo
0 2 * * 0 python3 /root/scripts/jeanbrun/enrich_villes_geo.py
0 3 * * 0 python3 /root/scripts/jeanbrun/import_dvf_historique.py
0 2 1 * * python3 /root/scripts/jeanbrun/import_insee_data.py
0 8 1 * * python3 /root/scripts/jeanbrun/generate_barometre.py
```

### Validation

- [ ] Crons fonctionnent
- [ ] Logs accessibles
- [ ] Alertes si échec

---

## Phase 11: Tests et Validation (2 jours)

### Tâches

- [ ] 11.1 Tests unitaires composants villes
- [ ] 11.2 Tests API EspoCRM client
- [ ] 11.3 Tests E2E Playwright (parcours /villes → /villes/lyon)
- [ ] 11.4 Audit Lighthouse (perf, SEO, a11y)
- [ ] 11.5 Vérification mobile
- [ ] 11.6 Validation JSON-LD

### Validation

- [ ] Coverage > 80%
- [ ] Lighthouse >= 90 mobile
- [ ] E2E verts

---

## Récapitulatif des phases

| Phase | Durée | Responsable | Dépendances |
|-------|-------|-------------|-------------|
| 1. Entités EspoCRM | 1j | MoltBot | - |
| 2. Enrichissement données | 3j | **MoltBot** | Phase 1 |
| 3. API Client | 1j | Claude | Phase 1 |
| 4. Composants UI | 4j | Claude | Phase 3 |
| 5. Pages Villes | 3j | Claude | Phase 4 |
| 6. Page Baromètre | 1.5j | Claude | Phase 4, 5 |
| 7. Index Villes | 1j | Claude | Phase 5 |
| 8. JSON-LD et SEO | 1j | Claude | Phase 5, 6 |
| 9. Maillage | 0.5j | Claude | Phase 7 |
| 10. Crons | 0.5j | MoltBot | Phase 2 |
| 11. Tests | 2j | Claude | Toutes |

**Total:** 18.5 jours (buffer: 1.5j)

### Répartition MoltBot / Claude

```
MoltBot (données) ──────────────────────────────────────────────▶
├── Phase 1: Champs EspoCRM périphériques
├── Phase 2: Import 250 villes + contenu IA + arguments + FAQ
└── Phase 10: Crons enrichissement

Claude (UI/intégration) ────────────────────────────────────────▶
├── Phases 3-9: API, composants, pages, SEO
└── Phase 11: Tests E2E
```

---

## Coordination avec MoltBot

### Données attendues de MoltBot

| Donnée | Champ EspoCRM | Obligatoire |
|--------|---------------|-------------|
| Programmes neufs | CJeanbrunProgramme.* | Oui |
| Photos programmes | CJeanbrunProgramme.images[] | Oui |
| Photo ville | CJeanbrunVille.photoVille | Oui |
| Coordonnées programmes | latitude, longitude | Oui |
| Constructions en cours | nbLotsDisponibles, dateLivraison | Oui |

### 🆕 Données périphériques attendues de MoltBot

| Donnée | Champ EspoCRM | Obligatoire |
|--------|---------------|-------------|
| ~250 villes périphériques | CJeanbrunVille (nouvelles entrées) | Oui |
| Lien métropole parent | metropoleParentId | Oui |
| Flag métropole | isMetropole | Oui |
| Contenu éditorial IA | contenuEditorial (300-400 mots) | Oui |
| Arguments personnalisés | argumentsInvestissement (JSON array) | Oui |
| FAQ par ville | faqItems (JSON array) | Oui |
| Photo (réutilisée) | photoVille (= photo métropole parent) | Oui |
| Alt text différent | photoVilleAlt | Oui |

### Critères de sélection villes périphériques

```
Pour chaque métropole, sélectionner 5-8 villes :
├── Population > 8 000 habitants
├── Distance < 25 km de la métropole
├── Même département (préféré)
├── Zone fiscale : même ou adjacente
└── Potentiel investissement (programmes neufs, demande locative)
```

### Timeline parallèle

```
Semaine 7:
  - MoltBot:
    ├── Créer champs EspoCRM (isMetropole, metropoleParentId, etc.)
    ├── Importer 250 villes périphériques
    ├── Générer contenu IA + arguments + FAQ
    └── Photos : réutiliser métropole parent
  - Claude: Phases 3-4 (API, composants)

Semaine 8:
  - MoltBot:
    ├── Scraping complet programmes
    └── Validation données périphériques
  - Claude: Phases 5-11 (pages, tests)
```

---

## Checklist de fin de sprint

### Données

- [ ] 51 métropoles géocodées (lat, lon, codeInsee)
- [ ] **~250 villes périphériques importées**
- [ ] **Chaque périphérique lié à sa métropole parent**
- [ ] Historique DVF 12 mois importé
- [ ] Données INSEE (population, revenus)
- [ ] 200+ programmes multi-promoteurs avec photos
- [ ] 51 baromètres mensuels générés
- [ ] Photos représentatives de chaque métropole

### SEO

- [ ] 51 pages métropoles générées statiquement
- [ ] **~250 pages périphériques générées statiquement**
- [ ] Pages baromètre générées
- [ ] Contenu éditorial unique par ville (métropole + périphérique)
- [ ] **Arguments personnalisés par ville**
- [ ] **FAQ Schema.org par ville (FAQPage JSON-LD)**
- [ ] JSON-LD Place/LocalBusiness valide
- [ ] Sitemap.xml complet (300+ URLs)
- [ ] Maillage interne automatique (métropole ↔ périphériques)

### Performance

- [ ] Core Web Vitals >= 90 mobile
- [ ] TTFB < 200ms (SSG)
- [ ] Build < 10 minutes (300+ pages)
- [ ] Images optimisées

---

**Auteur:** Claude (Opus 4.5)
**Date:** 31 janvier 2026
**Version:** 2.0

### Historique des modifications

| Version | Date | Modifications |
|---------|------|---------------|
| 1.0 | 31/01/2026 | Création initiale |
| 2.0 | 31/01/2026 | **Ajout structure pages villes périphériques**, nouveaux composants UI (BarometreSidebar, FaqVille, ArgumentsInvestissement, etc.), répartition claire MoltBot/Claude |
