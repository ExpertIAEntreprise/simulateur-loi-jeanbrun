# Simulateur Wizard - Plan d'implementation

**Feature:** Simulateur Loi Jeanbrun 6 etapes
**Estimation totale:** 21 jours (18,5j + 2,5j corrections)
**Date:** 30 janvier 2026
**Derniere MAJ:** 02 fevrier 2026 (ajout Phase G - Corrections Post-Audit)

---

## Ameliorations apportees (31/01/2026)

### Feature Lead Financement / Courtier

Ajout d'une fonctionnalite de capture de leads pour le financement immobilier.

**Contexte metier:**
- Les banques ont 20% de marge de derogation sur la regle HCSF des 35%
- Un bon reste a vivre peut permettre de passer meme au-dela de 35%
- Un courtier peut identifier les banques avec de la marge pour ces profils

**Fichiers crees:**
- `src/types/lead-financement.ts` - Types pour leads courtier
- `src/lib/calculs/analyse-financement.ts` - Analyse de financabilite
- `src/components/simulateur/resultats/EncartFinancement.tsx` - Encart dans les resultats
- `src/components/simulateur/resultats/LeadCourtierModal.tsx` - Modal capture lead
- `src/components/simulateur/etape-3/AlerteEndettement.tsx` - Alerte dans le wizard
- `src/app/api/leads/financement/route.ts` - API capture lead

**Logique d'analyse:**
- < 30% : Excellent (vert fonce)
- 30-33% : Bon (vert clair)
- 33-35% : Acceptable HCSF (vert pale)
- 35-40% : Derogation possible (jaune) - CTA courtier
- 40-45% : Tendu (orange) - CTA courtier fort
- > 45% : Difficile (rouge)

**Integration:**
- Encart dans la page resultats avec jauge endettement
- Alerte contextuelle dans l'etape 3 si > 35%
- Modal de capture avec formulaire + consentements RGPD

---

## Vue d'ensemble des phases

| Phase | Description | Effort | Dependances | Statut |
|-------|-------------|--------|-------------|--------|
| A | Layout + Navigation | 1,5j | - | ✅ FAIT |
| B | Etapes 1-2 (Profil + Projet) | 4,5j | Phase A | ✅ FAIT |
| C | Etapes 3-4 (Financement + Location) | 4j | Phase B | ✅ FAIT |
| D | Etapes 5-6 (Sortie + Structure) | 3j | Phase C | ✅ FAIT |
| E | Page Resultats | 3,5j | Phase D | ✅ FAIT |
| F | Tests + Polish | 2j | Phase E | ✅ FAIT |
| **G** | **Corrections Post-Audit** | **2,5j** | Phase F | ⏳ A FAIRE |

---

## Phase A - Layout + Navigation (1,5j)

**Objectif:** Structure commune a toutes les etapes du simulateur.

### Taches

- [x] **A.1** Creer `SimulateurLayout.tsx` (0,5j) ✅ FAIT
  - Header sticky avec logo et progress
  - Zone contenu centrale (max-w-2xl)
  - Footer sticky avec navigation
  - Fichier: `src/components/simulateur/SimulateurLayout.tsx`

- [x] **A.2** Creer `ProgressBar.tsx` (0,25j) ✅ FAIT
  - 6 dots avec labels etapes
  - Barre de progression animee
  - Etat actif/complete/pending
  - Fichier: `src/components/simulateur/ProgressBar.tsx`

- [x] **A.3** Creer `StepNavigation.tsx` (0,25j) ✅ FAIT
  - Boutons Retour/Continuer
  - Desactivation selon validation
  - Texte dynamique derniere etape
  - Fichier: `src/components/simulateur/StepNavigation.tsx`

- [x] **A.4** Creer hook `useSimulation.ts` (0,5j) ✅ FAIT
  - State global simulation (React Context)
  - Sauvegarde localStorage automatique
  - Navigation entre etapes
  - Fichier: `src/lib/hooks/useSimulation.ts`
  - Fichier: `src/contexts/SimulationContext.tsx`

### Livrables

- Layout fonctionnel avec navigation 6 etapes
- Progress bar animee
- Persistance localStorage

### Fichiers crees (Phase A) - 02/02/2026

| Fichier | Description |
|---------|-------------|
| `src/contexts/SimulationContext.tsx` | Provider + types WizardStep1-6, persistance localStorage |
| `src/lib/hooks/useSimulation.ts` | Hook + useSimulationNavigation helper |
| `src/components/simulateur/ProgressBar.tsx` | 6 dots, 3 etats, responsive (mobile dots + desktop labels) |
| `src/components/simulateur/StepNavigation.tsx` | Retour/Continuer avec glow, loader, texte dynamique |
| `src/components/simulateur/SimulateurLayout.tsx` | Layout sticky header/footer, max-w-2xl |
| `src/app/simulateur/avance/layout.tsx` | Route layout avec SimulationProvider |
| `src/app/simulateur/avance/page.tsx` | Page placeholder avec StepContent dynamique |

**Route:** `/simulateur/avance` - Testable en local

---

## Phase B - Etapes 1-2 (4,5j)

**Objectif:** Collecte profil investisseur et projet immobilier.

### Taches Etape 1 - Profil (2j)

- [x] **B.1** Creer `ProfilForm.tsx` (0,75j) ✅ FAIT
  - Formulaire react-hook-form + Zod
  - Champs: situation, parts, revenus, objectif
  - Fichier: `src/components/simulateur/etape-1/ProfilForm.tsx`

- [x] **B.2** Creer `TMICalculator.tsx` (0,5j) ✅ FAIT
  - Calcul temps reel TMI
  - Badge colore selon tranche
  - Tooltip explicatif
  - Fichier: `src/components/simulateur/etape-1/TMICalculator.tsx`

- [x] **B.3** Creer `ObjectifSelector.tsx` (0,25j) ✅ FAIT
  - 4 cards avec icones
  - Selection unique
  - Fichier: `src/components/simulateur/etape-1/ObjectifSelector.tsx`

- [x] **B.4** Creer page `etape-1` (0,5j) ✅ FAIT
  - Route: `/simulateur/avance`
  - Integration composants
  - Fichier: `src/app/simulateur/avance/page.tsx`

### Taches Etape 2 - Projet (2,5j)

- [x] **B.5** Creer `TypeBienSelector.tsx` (0,5j) ✅ FAIT
  - 2 cards Neuf/Ancien
  - Affichage conditionnel section travaux
  - Fichier: `src/components/simulateur/etape-2/TypeBienSelector.tsx`

- [x] **B.6** Creer `VilleAutocomplete.tsx` (0,75j) ✅ FAIT
  - Combobox avec recherche API
  - Affichage zone fiscale
  - Debounce 300ms
  - Fichier: `src/components/simulateur/etape-2/VilleAutocomplete.tsx`

- [x] **B.7** Creer `TravauxValidator.tsx` (0,5j) ✅ FAIT
  - Progress bar pourcentage travaux
  - Alerte si < 30%
  - Badge eligibilite
  - Fichier: `src/components/simulateur/etape-2/TravauxValidator.tsx`

- [x] **B.8** Creer `RecapProjet.tsx` (0,25j) ✅ FAIT
  - Tableau recapitulatif Neuf vs Ancien
  - Calcul frais notaire
  - Fichier: `src/components/simulateur/etape-2/RecapProjet.tsx`

- [x] **B.9** Creer page `etape-2` (0,5j) ✅ FAIT
  - Route: `/simulateur/avance/etape-2`
  - Integration composants
  - Fichier: `src/app/simulateur/avance/etape-2/page.tsx`

### Livrables

- Etape 1 complete avec TMI auto-calcule
- Etape 2 complete avec validation travaux 30%
- Navigation fonctionnelle entre etapes 1-2

### Fichiers crees (Phase B) - 02/02/2026

| Fichier | Description |
|---------|-------------|
| `src/components/simulateur/etape-1/ProfilForm.tsx` | Formulaire react-hook-form + Zod, sync context, validation |
| `src/components/simulateur/etape-1/TMICalculator.tsx` | Calcul TMI temps reel, badge colore, tooltip bareme IR 2026 |
| `src/components/simulateur/etape-1/ObjectifSelector.tsx` | 4 cards selectionnables avec icones et animations |
| `src/components/simulateur/etape-1/index.ts` | Barrel exports etape-1 |
| `src/components/simulateur/etape-2/TypeBienSelector.tsx` | 2 cards Neuf/Ancien avec radio indicator |
| `src/components/simulateur/etape-2/VilleAutocomplete.tsx` | Combobox debounce 300ms, zones fiscales colorees |
| `src/components/simulateur/etape-2/TravauxValidator.tsx` | Jauge 0-100%, seuils 30%/50%, alerte eligibilite |
| `src/components/simulateur/etape-2/RecapProjet.tsx` | Tableau recap, frais notaire, plafonds zone |
| `src/components/simulateur/etape-2/index.ts` | Barrel exports etape-2 |
| `src/app/simulateur/avance/page.tsx` | Page etape-1 integree avec tous composants |
| `src/app/simulateur/avance/etape-2/page.tsx` | Page etape-2 integree avec validation |

**Routes:**
- `/simulateur/avance` - Etape 1 (Profil investisseur)
- `/simulateur/avance/etape-2` - Etape 2 (Projet immobilier)

---

## Phase C - Etapes 3-4 (4j)

**Objectif:** Configuration financement et strategie locative.

### Taches Etape 3 - Financement (2j)

- [x] **C.1** Creer `FinancementForm.tsx` (0,75j) ✅ FAIT
  - Formulaire: apport, duree, taux, differe
  - Calcul mensualite temps reel
  - Fichier: `src/components/simulateur/etape-3/FinancementForm.tsx`

- [x] **C.2** Creer `JaugeEndettement.tsx` (0,5j) ✅ FAIT
  - Jauge 0-100% avec zones couleurs
  - Marqueurs 33% et 35%
  - Alerte si depassement
  - Fichier: `src/components/simulateur/etape-3/JaugeEndettement.tsx`

- [x] **C.3** Creer `DiffereSelector.tsx` (0,25j) ✅ FAIT
  - Select 0/12/24 mois
  - Info contextuelle VEFA
  - Fichier: `src/components/simulateur/etape-3/DiffereSelector.tsx`

- [x] **C.4** Creer page `etape-3` (0,5j) ✅ FAIT
  - Route: `/simulateur/avance/etape-3`
  - Fichier: `src/app/simulateur/avance/etape-3/page.tsx`

- [x] **C.4bis** Creer `AlerteEndettement.tsx` (FAIT)
  - Alerte contextuelle si endettement > 35%
  - Mention derogation 20% et reste a vivre
  - CTA vers courtier partenaire
  - Fichier: `src/components/simulateur/etape-3/AlerteEndettement.tsx`

### Taches Etape 4 - Location (2j)

- [x] **C.5** Creer `NiveauLoyerCards.tsx` (0,75j) ✅ FAIT
  - 3 cards avec loyer max, taux, description
  - Calcul coefficient surface
  - Fichier: `src/components/simulateur/etape-4/NiveauLoyerCards.tsx`

- [x] **C.6** Creer `PerteGainVisualisation.tsx` (0,5j) ✅ FAIT
  - Balance perte loyer vs economie fiscale
  - Gain net annuel
  - Fichier: `src/components/simulateur/etape-4/PerteGainVisualisation.tsx`

- [x] **C.7** Creer `ChargesForm.tsx` (0,25j) ✅ FAIT
  - Inputs: charges, taxe fonciere, vacance
  - Fichier: `src/components/simulateur/etape-4/ChargesForm.tsx`

- [x] **C.8** Creer page `etape-4` (0,5j) ✅ FAIT
  - Route: `/simulateur/avance/etape-4`
  - Fichier: `src/app/simulateur/avance/etape-4/page.tsx`

### Livrables

- Etape 3 complete avec jauge endettement
- Etape 4 complete avec visualisation gain/perte
- Navigation fonctionnelle etapes 1-4

### Fichiers crees (Phase C) - 02/02/2026

| Fichier | Description |
|---------|-------------|
| `src/components/simulateur/etape-3/FinancementForm.tsx` | Formulaire apport/duree/taux avec calcul mensualite temps reel |
| `src/components/simulateur/etape-3/JaugeEndettement.tsx` | Jauge visuelle 0-50%+ avec seuils 33%/35%, reste a vivre |
| `src/components/simulateur/etape-3/DiffereSelector.tsx` | Select 0/12/24 mois avec info contextuelle VEFA |
| `src/components/simulateur/etape-3/index.ts` | Barrel exports etape-3 |
| `src/components/simulateur/etape-4/NiveauLoyerCards.tsx` | 3 cards avec loyer max par zone, coefficient surface |
| `src/components/simulateur/etape-4/ChargesForm.tsx` | Charges, taxe fonciere, vacance avec recapitulatif |
| `src/components/simulateur/etape-4/PerteGainVisualisation.tsx` | Balance perte loyer vs economie fiscale avec barres comparatives |
| `src/components/simulateur/etape-4/index.ts` | Barrel exports etape-4 |
| `src/app/simulateur/avance/etape-3/page.tsx` | Page etape 3 avec integration composants |
| `src/app/simulateur/avance/etape-4/page.tsx` | Page etape 4 avec integration composants |

**Routes:**
- `/simulateur/avance/etape-3` - Etape 3 (Configuration financement)
- `/simulateur/avance/etape-4` - Etape 4 (Strategie locative)

---

## Phase D - Etapes 5-6 (3j)

**Objectif:** Configuration sortie et structure juridique.

### Taches Etape 5 - Sortie (1,5j)

- [x] **D.1** Creer `DureeSlider.tsx` (0,5j) ✅ FAIT
  - Slider 9-25 ans avec marqueurs
  - Infos abattements PV contextuelles
  - Fichier: `src/components/simulateur/etape-5/DureeSlider.tsx`

- [x] **D.2** Creer `RevalorisationInput.tsx` (0,25j) ✅ FAIT
  - Slider 0-5% avec scenarios predefinits
  - Calcul valeur future estimee
  - Fichier: `src/components/simulateur/etape-5/RevalorisationInput.tsx`

- [x] **D.3** Creer `StrategieSortie.tsx` (0,25j) ✅ FAIT
  - 3 cards: revente, conservation, donation
  - Affichage abattement PV selon duree
  - Fichier: `src/components/simulateur/etape-5/StrategieSortie.tsx`

- [x] **D.4** Creer page `etape-5` (0,5j) ✅ FAIT
  - Route: `/simulateur/avance/etape-5`
  - Fichier: `src/app/simulateur/avance/etape-5/page.tsx`

### Taches Etape 6 - Structure (1,5j)

- [x] **D.5** Creer `StructureCards.tsx` (0,75j) ✅ FAIT
  - 3 cards avec avantages/inconvenients
  - Badge recommande sur Nom Propre
  - Alerte orange si SCI IS (pas de Jeanbrun)
  - Fichier: `src/components/simulateur/etape-6/StructureCards.tsx`

- [x] **D.6** Creer `ComparatifTable.tsx` (0,25j) ✅ FAIT
  - Tableau comparatif 9 criteres
  - Colonne selectionnee mise en surbrillance
  - Legende avec icones
  - Fichier: `src/components/simulateur/etape-6/ComparatifTable.tsx`

- [x] **D.7** Creer page `etape-6` (0,5j) ✅ FAIT
  - Route: `/simulateur/avance/etape-6`
  - isLastStep=true, redirection vers resultats
  - Fichier: `src/app/simulateur/avance/etape-6/page.tsx`

### Livrables

- Etape 5 complete avec slider duree ✅
- Etape 6 complete avec recommandation structure ✅
- Parcours 6 etapes complet fonctionnel ✅

### Fichiers crees (Phase D) - 02/02/2026

| Fichier | Description |
|---------|-------------|
| `src/components/simulateur/etape-5/DureeSlider.tsx` | Slider 9-25 ans, 4 milestones, info abattements PV |
| `src/components/simulateur/etape-5/RevalorisationInput.tsx` | Slider 0-5%, 5 scenarios, calcul valeur future |
| `src/components/simulateur/etape-5/StrategieSortie.tsx` | 3 cards radio, abattement PV dynamique, avantages/inconvenients |
| `src/components/simulateur/etape-5/index.ts` | Barrel exports etape-5 |
| `src/components/simulateur/etape-6/StructureCards.tsx` | 3 cards structure juridique, badge recommande, alerte SCI IS |
| `src/components/simulateur/etape-6/ComparatifTable.tsx` | Tableau 9 criteres, surbrillance colonne, legende |
| `src/components/simulateur/etape-6/index.ts` | Barrel exports etape-6 |
| `src/app/simulateur/avance/etape-5/page.tsx` | Page etape 5 complete avec validation |
| `src/app/simulateur/avance/etape-6/page.tsx` | Page etape 6 avec isLastStep, redirect resultats |

**Routes:**
- `/simulateur/avance/etape-5` - Etape 5 (Strategie de sortie)
- `/simulateur/avance/etape-6` - Etape 6 (Structure juridique)

---

## Phase E - Page Resultats (3,5j)

**Objectif:** Affichage resultats simulation avec graphiques.

### Taches

- [x] **E.1** Creer `SyntheseCard.tsx` (0,5j) ✅ FAIT
  - 4 KPIs: economie fiscale, cash-flow, rendement, effort
  - Grid 2x2 responsive, animations fade-in
  - Fichier: `src/components/simulateur/resultats/SyntheseCard.tsx`

- [x] **E.2** Creer `GraphiquePatrimoine.tsx` (1j) ✅ FAIT
  - AreaChart Recharts evolution patrimoine
  - 3 series stackees: valeur bien, capital, economies
  - Tooltip et legende custom, responsive mobile
  - Fichier: `src/components/simulateur/resultats/GraphiquePatrimoine.tsx`

- [x] **E.3** Creer `TableauAnnuel.tsx` (0,5j) ✅ FAIT
  - Tableau 8 colonnes annee par annee (Premium)
  - Header sticky, scroll horizontal mobile
  - Blur overlay + CTA si non premium
  - Fichier: `src/components/simulateur/resultats/TableauAnnuel.tsx`

- [x] **E.4** Creer `ComparatifLMNP.tsx` (0,5j) ✅ FAIT
  - Comparaison Jeanbrun vs LMNP (Premium)
  - 6 criteres, meilleure valeur en surbrillance
  - Verdict avec score et badge "Recommande"
  - Fichier: `src/components/simulateur/resultats/ComparatifLMNP.tsx`

- [x] **E.4bis** Creer `EncartFinancement.tsx` (FAIT)
  - Analyse financabilite (taux endettement, reste a vivre)
  - Jauge visuelle avec seuils HCSF + derogation 20%
  - CTA "Etre rappele par un courtier"
  - Fichier: `src/components/simulateur/resultats/EncartFinancement.tsx`

- [x] **E.4ter** Creer `LeadCourtierModal.tsx` (FAIT)
  - Formulaire capture lead courtier
  - Consentements RGPD + courtier
  - Recap donnees simulation
  - Fichier: `src/components/simulateur/resultats/LeadCourtierModal.tsx`

- [x] **E.4quater** Creer API `/api/leads/financement` (FAIT)
  - Validation Zod
  - Stockage lead (TODO: Drizzle)
  - Webhook courtier partenaire (configurable)
  - Fichier: `src/app/api/leads/financement/route.ts`

- [x] **E.5** Creer API `simulation/avancee` (0,5j) ✅ FAIT
  - Route: `/api/simulation/avancee`
  - Validation Zod complete (6 steps)
  - Appel orchestrateur + analyseFinancement
  - Fichier: `src/app/api/simulation/avancee/route.ts`

- [x] **E.6** Creer page resultats (0,5j) ✅ FAIT
  - Route: `/simulateur/resultat/[id]`
  - Sections Free vs Premium avec blur overlay
  - CTA debloquer (9,90 EUR) + conseiller
  - Fichier: `src/app/simulateur/resultat/[id]/page.tsx`

### Livrables

- Page resultats complete ✅
- Graphique patrimoine interactif ✅
- Sections Premium masquees ✅

### Fichiers crees (Phase E) - 02/02/2026

| Fichier | Description |
|---------|-------------|
| `src/components/simulateur/resultats/SyntheseCard.tsx` | 4 KPIs grid 2x2, animations, tendances |
| `src/components/simulateur/resultats/GraphiquePatrimoine.tsx` | Recharts AreaChart 3 series, tooltip custom |
| `src/components/simulateur/resultats/TableauAnnuel.tsx` | Tableau 8 colonnes, Premium blur overlay |
| `src/components/simulateur/resultats/ComparatifLMNP.tsx` | Comparatif 6 criteres, verdict score |
| `src/components/simulateur/resultats/index.ts` | Barrel exports tous composants resultats |
| `src/app/api/simulation/avancee/route.ts` | POST API validation Zod + calculs |
| `src/app/simulateur/resultat/page.tsx` | Redirect vers /resultat/[id] |
| `src/app/simulateur/resultat/[id]/page.tsx` | Page resultats complete avec Premium |

**Routes:**
- `/api/simulation/avancee` - POST API calcul simulation
- `/simulateur/resultat` - Redirect vers resultat avec ID
- `/simulateur/resultat/[id]` - Page resultats dynamique

---

## Phase F - Tests + Polish (2j)

**Objectif:** Qualite, accessibilite, responsive.

### Taches

- [x] **F.1** Tests unitaires composants (0,75j) ✅ FAIT
  - Coverage >= 70% (70.69% atteint)
  - Tests: validation, calculs, navigation
  - Framework: Vitest + Testing Library
  - 158 tests composants crees (637 tests total)

- [x] **F.2** Tests integration (0,5j) ✅ FAIT
  - Parcours complet 6 etapes (Playwright E2E)
  - Sauvegarde localStorage (30 tests Vitest)
  - Soumission API

- [x] **F.3** Audit accessibilite (0,25j) ✅ FAIT
  - axe-core automated (34/34 tests passent)
  - Navigation clavier (Arrow keys sur radiogroups)
  - Focus visible

- [x] **F.4** Responsive polish (0,25j) ✅ FAIT
  - Verification 375px, 768px, 1024px, 1440px
  - Ajustements spacing/typography
  - 10 composants modifies

- [x] **F.5** Performance audit (0,25j) ✅ FAIT
  - Dynamic imports pour Recharts (GraphiquePatrimoine, ComparatifLMNP)
  - useMemo sur JaugeEndettement
  - Bundle size optimise (~150KB economises)

### Livrables

- Tests passes ✅
- Accessibilite WCAG 2.1 AA ✅
- Performance optimale ✅

### Fichiers crees/modifies (Phase F) - 02/02/2026

| Fichier | Description |
|---------|-------------|
| `vitest.setup.ts` | Configuration Testing Library + mocks |
| `src/components/simulateur/__tests__/TMICalculator.test.tsx` | 21 tests TMI |
| `src/components/simulateur/__tests__/ObjectifSelector.test.tsx` | 20 tests selection |
| `src/components/simulateur/__tests__/TravauxValidator.test.tsx` | 34 tests validation |
| `src/components/simulateur/__tests__/JaugeEndettement.test.tsx` | 29 tests jauge |
| `src/components/simulateur/__tests__/ProgressBar.test.tsx` | 25 tests progression |
| `src/components/simulateur/__tests__/StepNavigation.test.tsx` | 29 tests navigation |
| `src/components/simulateur/__tests__/accessibility.test.tsx` | 34 tests WCAG |
| `src/app/simulateur/__tests__/context.test.tsx` | 30 tests integration |
| `e2e/simulateur.spec.ts` | 13 tests E2E Playwright |
| `playwright.config.ts` | Configuration E2E |
| `docs/testing/INTEGRATION-TESTS.md` | Documentation tests |

**Statistiques finales:**
- 671 tests total (449 calculs + 222 nouveaux)
- Coverage composants: 70.69%
- Accessibilite: 34/34 tests WCAG passent

---

## Calendrier suggere

| Semaine | Phases | Jours | Statut |
|---------|--------|-------|--------|
| S5 - J1-J2 | Phase A (Layout) | 1,5j | ✅ |
| S5 - J3-J5 | Phase B (Etapes 1-2) | 4,5j | ✅ |
| S6 - J1-J4 | Phase C (Etapes 3-4) | 4j | ✅ |
| S6 - J4-J5 | Phase D (Etapes 5-6) | 3j | ✅ |
| S6 - J5 + S7 | Phase E (Resultats) | 3,5j | ✅ |
| S7 | Phase F (Tests) | 2j | ✅ |
| **S8** | **Phase G (Corrections)** | **2,5j** | ⏳ |

---

## Risques identifies

| Risque | Impact | Mitigation |
|--------|--------|------------|
| API villes lente | UX degradee | Cache agressif + debounce |
| Recharts poids bundle | Performance | Lazy loading + tree shaking |
| Formules calcul complexes | Bugs | Tests unitaires dedies |
| Responsive graphiques | UX mobile | Points reduits + scroll |

---

## Definition of Done (Phase F)

- [x] Code TypeScript strict sans erreurs ✅
- [x] Tests unitaires >= 70% coverage (70.69% → 79.12%) ✅
- [x] Responsive verifie sur 4 breakpoints ✅
- [x] Accessibilite WCAG 2.1 AA ✅
- [x] Performance optimisee (dynamic imports) ✅
- [x] Review code effectuee ✅
- [x] Documentation mise a jour ✅

**PHASE F TERMINEE - 02/02/2026**

---

## Definition of Done (Phase G)

- [ ] Tous fichiers loading.tsx/error.tsx crees
- [ ] useTransition implemente pour calculs
- [ ] Couleurs hardcodees remplacees par tokens
- [ ] Validation localStorage avec Zod
- [ ] Securite API renforcee (CORS, rate limiting)
- [ ] Types unifies (pas de duplication)
- [ ] Code DRY (helpers extraits)
- [ ] Tests coverage >= 80%
- [ ] Aucune alerte security-reviewer

**PHASE G A EFFECTUER - Prochaine session**

---

## Phase G - Corrections Post-Audit (2,5j)

**Objectif:** Corriger les problemes identifies par l'audit multi-agents (02/02/2026)
**Date audit:** 02 fevrier 2026
**Agents utilises:** code-reviewer, security-reviewer, ui-expert, architect, frontend-developer, tdd-guide

### Synthese Audit

| Agent | Critique | Haute | Moyenne | Basse |
|-------|----------|-------|---------|-------|
| Code Reviewer | 0 | 3 | 8 | 5 |
| Security Reviewer | 0 | 2 | 5 | 4 |
| UI Expert | 3 | 3 | 4 | 2 |
| Architect | - | 4 | 6 | - |
| Frontend Developer | 2 | 5 | 5 | 1 |

**Coverage tests apres audit:** 79.12% (+5.7%)

---

### G.1 - Corrections Critiques (P0) - 0,5j

#### G.1.1 Ajouter loading.tsx et error.tsx (Next.js Best Practice)

**Issue:** Aucun fichier de chargement/erreur dans `/simulateur/resultat/`
**Impact:** Mauvaise UX pendant navigation, pas de gestion erreurs
**Source:** frontend-developer agent

**Fichiers a creer:**

```
src/app/simulateur/resultat/loading.tsx
src/app/simulateur/resultat/error.tsx
src/app/simulateur/avance/loading.tsx
src/app/simulateur/avance/error.tsx
```

**Implementation loading.tsx:**
```typescript
import { Skeleton } from "@/components/ui/skeleton"

export default function ResultatLoading() {
  return (
    <div className="container max-w-5xl mx-auto px-4 py-8 space-y-8">
      <Skeleton className="h-8 w-64" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
      <Skeleton className="h-[400px] w-full" />
    </div>
  )
}
```

**Implementation error.tsx:**
```typescript
"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

export default function ResultatError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Resultat error:", error)
  }, [error])

  return (
    <div className="container max-w-5xl mx-auto px-4 py-8">
      <div className="text-center space-y-4">
        <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
        <h2 className="text-2xl font-bold">Une erreur est survenue</h2>
        <p className="text-muted-foreground">{error.message}</p>
        <Button onClick={reset}>Reessayer</Button>
      </div>
    </div>
  )
}
```

---

#### G.1.2 Ajouter useTransition pour calculs lourds (React 19)

**Issue:** Calculs bloquent le thread principal dans `resultat/[id]/page.tsx:412-428`
**Impact:** UI freeze pendant calcul (~700ms)
**Source:** frontend-developer agent

**Fichier:** `src/app/simulateur/resultat/[id]/page.tsx`

**Avant:**
```typescript
useEffect(() => {
  requestAnimationFrame(() => {
    const calculatedResults = calculateResults(state);
    setResults(calculatedResults);
  });
}, []);
```

**Apres:**
```typescript
import { useTransition } from "react"

const [isPending, startTransition] = useTransition()

useEffect(() => {
  const state = loadWizardState()
  setWizardState(state)

  if (isValidWizardState(state)) {
    startTransition(() => {
      const calculatedResults = calculateResults(state)
      setResults(calculatedResults)
    })
  }
  setIsLoading(false)
}, [])

// Utiliser isPending pour afficher skeleton
if (isLoading || isPending) {
  return <ResultatLoadingSkeleton />
}
```

---

#### G.1.3 Remplacer couleurs OKLCH hardcodees par tokens (UI)

**Issue:** Couleurs OKLCH hardcodees dans composants resultats
**Impact:** Themes impossibles, dark mode fragile
**Source:** ui-expert agent

**Fichiers concernes:**
- `src/components/simulateur/resultats/SyntheseCard.tsx` (lignes 148-175)
- `src/components/simulateur/resultats/GraphiquePatrimoine.tsx` (lignes 68-81, 108-128)
- `src/components/simulateur/resultats/EncartFinancement.tsx` (lignes 47-54, 73, 149)

**Remplacements a effectuer:**

| Avant (hardcode) | Apres (token) |
|------------------|---------------|
| `bg-[oklch(0.20_0.08_145)]` | `bg-success/20` |
| `text-[oklch(0.72_0.20_145)]` | `text-success` |
| `bg-[oklch(0.20_0.10_25)]` | `bg-destructive/20` |
| `text-[oklch(0.63_0.24_25)]` | `text-destructive` |
| `bg-green-500` | `bg-gauge-safe` |
| `bg-amber-500` | `bg-gauge-warning` |
| `bg-red-500` | `bg-gauge-danger` |
| `bg-amber-600 hover:bg-amber-700` | `bg-primary hover:bg-primary/90` |

**Ajouter dans globals.css @theme inline:**
```css
@theme inline {
  --color-gauge-safe: var(--gauge-safe);
  --color-gauge-warning: var(--gauge-warning);
  --color-gauge-danger: var(--gauge-danger);
}

:root {
  --gauge-safe: oklch(0.72 0.20 145);
  --gauge-warning: oklch(0.75 0.18 75);
  --gauge-danger: oklch(0.63 0.24 25);
}
```

---

### G.2 - Corrections Haute Priorite (P1) - 1j

#### G.2.1 Validation localStorage avec Zod (Security)

**Issue:** Donnees localStorage cast sans validation profonde
**Impact:** Donnees manipulees peuvent bypass validation metier
**Source:** security-reviewer agent

**Fichier:** `src/contexts/SimulationContext.tsx` (lignes 310-335)

**Implementation:**
```typescript
import { z } from "zod"

const wizardStep1Schema = z.object({
  situation: z.enum(["celibataire", "marie", "pacse"]).optional(),
  parts: z.number().min(1).max(10).optional(),
  revenuNet: z.number().min(0).max(10_000_000).optional(),
  revenusFonciers: z.number().min(0).optional(),
  objectif: z.enum(["reduire_impots", "revenus", "patrimoine", "retraite"]).optional(),
})

// Schemas similaires pour steps 2-6...

const storedStateSchema = z.object({
  currentStep: z.number().min(1).max(6),
  step1: wizardStep1Schema,
  step2: wizardStep2Schema,
  step3: wizardStep3Schema,
  step4: wizardStep4Schema,
  step5: wizardStep5Schema,
  step6: wizardStep6Schema,
  tmiCalcule: z.number().optional(),
})

// Dans hydratation:
const parsed = storedStateSchema.safeParse(JSON.parse(saved))
if (parsed.success) {
  dispatch({ type: "HYDRATE", state: parsed.data })
} else {
  localStorage.removeItem(STORAGE_KEY) // Donnees invalides
}
```

---

#### G.2.2 Ajouter CORS a /api/simulation/avancee (Security)

**Issue:** Endpoint manque validation origin (presente dans /calcul)
**Impact:** Requetes cross-site possibles
**Source:** security-reviewer agent

**Fichier:** `src/app/api/simulation/avancee/route.ts`

**Ajouter au debut du handler:**
```typescript
// CORS: Verify request origin
const origin = request.headers.get("origin")
const allowedOrigins = [process.env.NEXT_PUBLIC_APP_URL]
if (origin && !allowedOrigins.includes(origin)) {
  return NextResponse.json(
    { success: false, error: "Origin not allowed" },
    { status: 403 }
  )
}

// Content-Length check for DoS prevention
const contentLength = request.headers.get("content-length")
const MAX_BODY_SIZE = 10 * 1024 // 10KB
if (contentLength && parseInt(contentLength, 10) > MAX_BODY_SIZE) {
  return NextResponse.json(
    { success: false, error: "Request body too large" },
    { status: 413 }
  )
}
```

---

#### G.2.3 Unifier type WizardState (Code Quality)

**Issue:** Type WizardState duplique entre page resultats et context
**Impact:** Risque de drift, moins strict dans page
**Source:** code-reviewer agent

**Fichier:** `src/app/simulateur/resultat/[id]/page.tsx` (lignes 59-100)

**Fix:** Supprimer la definition locale et importer:
```typescript
import type {
  SimulationWizardState,
  WizardStep1,
  WizardStep2,
  WizardStep3,
  WizardStep4,
  WizardStep5,
  WizardStep6,
} from "@/contexts/SimulationContext"

// Supprimer l'interface WizardState locale (lignes 59-100)
// Utiliser SimulationWizardState a la place
```

---

#### G.2.4 Convertir redirect en Server Component (Next.js)

**Issue:** Redirect client-side avec useEffect anti-pattern
**Impact:** Flash de contenu, mauvais SEO
**Source:** frontend-developer agent

**Fichier:** `src/app/simulateur/resultat/page.tsx`

**Avant (client-side):**
```typescript
"use client"
export default function ResultatRedirectPage() {
  useEffect(() => {
    const uuid = "xxx".replace(/[xy]/g, ...);
    router.replace(`/simulateur/resultat/${uuid}`);
  }, []);
}
```

**Apres (server-side):**
```typescript
import { redirect } from "next/navigation"

export default function ResultatRedirectPage() {
  const uuid = crypto.randomUUID()
  redirect(`/simulateur/resultat/${uuid}`)
}
```

---

#### G.2.5 Ajouter rate limiting a /api/leads/financement (Security)

**Issue:** Endpoint sans rate limiting (spam possible)
**Impact:** Abus formulaire, spam leads
**Source:** security-reviewer agent

**Fichier:** `src/app/api/leads/financement/route.ts`

**Ajouter:**
```typescript
import { simulationRateLimiter, checkRateLimit, getClientIP } from "@/lib/rate-limit"

export async function POST(request: NextRequest) {
  // Rate limiting: 5 requests per minute per IP
  const ip = getClientIP(request)
  const rateLimitResponse = await checkRateLimit(simulationRateLimiter, ip)
  if (rateLimitResponse) return rateLimitResponse

  // ... reste du handler
}
```

---

#### G.2.6 Extraire helper prixTotal (Code Quality)

**Issue:** Calcul prixTotal duplique 3 fois dans calculateResults
**Impact:** Code duplication, maintenance difficile
**Source:** code-reviewer agent

**Fichier:** `src/app/simulateur/resultat/[id]/page.tsx` (lignes 204, 228, 244)

**Fix:** Extraire fonction:
```typescript
function calculatePrixTotal(step2: WizardState['step2']): number {
  return step2.typeBien === "ancien" && step2.montantTravaux
    ? step2.prixAcquisition! + step2.montantTravaux
    : step2.prixAcquisition!
}

// Utiliser partout:
const prixTotal = calculatePrixTotal(step2)
```

---

### G.3 - Corrections Moyenne Priorite (P2) - 0,75j

#### G.3.1 Remplacer alert() par toast (UX)

**Issue:** Native alert() bloque UI et UX mediocre
**Source:** code-reviewer agent

**Fichiers:**
- `src/app/simulateur/resultat/[id]/page.tsx` (lignes 442, 461, 466)

**Fix:**
```typescript
import { toast } from "sonner"

// Au lieu de:
alert("Fonctionnalite premium...")

// Utiliser:
toast.info("Fonctionnalite premium", {
  description: "Paiement Stripe a venir (9,90 EUR)"
})
```

---

#### G.3.2 Extraire constantes magic numbers (Code Quality)

**Issue:** Nombres magiques sans constantes nommees
**Source:** code-reviewer agent

**Fichier:** `src/app/simulateur/resultat/[id]/page.tsx`

**Ajouter en haut du fichier:**
```typescript
const JEANBRUN_ENGAGEMENT_YEARS = 9
const LMNP_MICRO_BIC_ABATTEMENT = 0.5
const SEUIL_EXONERATION_TOTALE_IR = 22
const ABATTEMENT_ANNUEL_PLUS_VALUE = 6
```

---

#### G.3.3 Corriger setTimeout memory leak (Code Quality)

**Issue:** setTimeout non clear si component unmount
**Source:** code-reviewer agent

**Fichier:** `src/components/simulateur/resultats/LeadCourtierModal.tsx` (lignes 114-118)

**Fix:**
```typescript
useEffect(() => {
  if (!submitSuccess) return

  const timer = setTimeout(() => {
    setSubmitSuccess(false)
    onOpenChange(false)
  }, 3000)

  return () => clearTimeout(timer)
}, [submitSuccess, onOpenChange])
```

---

#### G.3.4 Utiliser crypto.randomUUID() (Security)

**Issue:** UUID genere avec Math.random() (previsible)
**Source:** security-reviewer agent

**Fichiers:**
- `src/app/simulateur/resultat/page.tsx`
- `src/app/api/simulation/avancee/route.ts`

**Fix:** Remplacer:
```typescript
// Avant
const uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, ...)

// Apres
const uuid = crypto.randomUUID()
```

---

#### G.3.5 Ajouter route segment config (Next.js)

**Issue:** Pas de config cache/revalidation pour page resultats
**Source:** frontend-developer agent

**Fichier:** `src/app/simulateur/resultat/[id]/page.tsx`

**Ajouter en haut:**
```typescript
export const dynamic = "force-dynamic"
export const revalidate = 0
```

---

#### G.3.6 Proteger JSON-LD contre XSS (Security)

**Issue:** dangerouslySetInnerHTML avec JSON.stringify sans escape
**Source:** security-reviewer agent

**Fichiers:**
- `src/components/villes/FaqVille.tsx`
- `src/components/villes/Breadcrumb.tsx`

**Fix:**
```typescript
function safeJsonLd(data: object): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
}

<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLdData) }}
/>
```

---

### G.4 - Refactoring Architecture (P3) - 0,25j

#### G.4.1 Extraire storage adapter (Testabilite)

**Issue:** localStorage accede directement dans context
**Impact:** Impossible de tester sans mock global
**Source:** architect agent

**Creer:** `src/lib/storage/wizard-storage.ts`
```typescript
export interface WizardStorage {
  load(): SimulationWizardState | null
  save(state: SimulationWizardState): void
  clear(): void
}

export const localWizardStorage: WizardStorage = {
  load() {
    if (typeof window === "undefined") return null
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : null
    } catch { return null }
  },
  save(state) {
    if (typeof window === "undefined") return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  },
  clear() {
    if (typeof window === "undefined") return
    localStorage.removeItem(STORAGE_KEY)
  }
}

// Modifier SimulationProvider pour accepter storage en prop
interface SimulationProviderProps {
  children: ReactNode
  storage?: WizardStorage
}
```

---

#### G.4.2 Diviser page resultats (Maintenabilite)

**Issue:** Page resultats fait 695 lignes (proche limite 800)
**Source:** code-reviewer, architect agents

**Refactoring suggere:**
```
src/app/simulateur/resultat/[id]/
├── page.tsx                    # Server Component wrapper (~50 lignes)
├── resultat-client.tsx         # Client Component principal (~200 lignes)
├── loading-skeleton.tsx        # Skeleton (~30 lignes)
├── helpers/
│   ├── load-wizard-state.ts   # Chargement localStorage
│   ├── validate-state.ts      # Validation state
│   └── calculate-results.ts   # Transformation resultats
└── types.ts                    # Types locaux
```

---

### G.5 - Tests supplementaires (P3)

**Fichiers de tests a creer:**
- `src/lib/calculs/__tests__/analyse-financement.test.ts` ✅ FAIT (37 tests)
- `src/components/simulateur/__tests__/AlerteEndettement.test.tsx` ✅ FAIT (26 tests)
- `src/components/simulateur/__tests__/SimulateurLayout.test.tsx` ✅ FAIT (25 tests)

**Fichiers de tests manquants (a creer):**
- `src/components/simulateur/etape-1/__tests__/ProfilForm.test.tsx` (coverage 0%)
- `src/components/simulateur/etape-2/__tests__/VilleAutocomplete.test.tsx` (coverage 30%)
- `src/app/api/simulation/__tests__/avancee.test.ts` (API route non testee)

---

### Checklist Phase G

- [ ] **G.1.1** Creer loading.tsx et error.tsx
- [ ] **G.1.2** Ajouter useTransition aux calculs
- [ ] **G.1.3** Remplacer couleurs OKLCH par tokens
- [ ] **G.2.1** Validation localStorage avec Zod
- [ ] **G.2.2** Ajouter CORS a /api/simulation/avancee
- [ ] **G.2.3** Unifier type WizardState
- [ ] **G.2.4** Convertir redirect en Server Component
- [ ] **G.2.5** Ajouter rate limiting leads
- [ ] **G.2.6** Extraire helper prixTotal
- [ ] **G.3.1** Remplacer alert() par toast
- [ ] **G.3.2** Extraire constantes magic numbers
- [ ] **G.3.3** Corriger setTimeout memory leak
- [ ] **G.3.4** Utiliser crypto.randomUUID()
- [ ] **G.3.5** Ajouter route segment config
- [ ] **G.3.6** Proteger JSON-LD XSS
- [ ] **G.4.1** Extraire storage adapter
- [ ] **G.4.2** Diviser page resultats

---

### Livrables Phase G

- Fichiers loading.tsx et error.tsx pour toutes routes simulateur
- Calculs non-bloquants avec useTransition
- Tokens semantiques pour toutes couleurs
- Securite renforcee (validation, CORS, rate limiting)
- Code DRY (types unifies, helpers extraits)
- Architecture testable (storage adapter)

---

### Sources Documentation Consultees (Audit)

- [Next.js Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)
- [Next.js 15 App Router Guide](https://medium.com/@livenapps/next-js-15-app-router-a-complete-senior-level-guide-0554a2b820f7)
- [React 19 Best Practices](https://dev.to/jay_sarvaiya_reactjs/react-19-best-practices-write-clean-modern-and-efficient-react-code-1beb)
- [React 19 New Hooks](https://www.freecodecamp.org/news/react-19-new-hooks-explained-with-examples/)
- [React Stack Patterns 2026](https://www.patterns.dev/react/react-2026/)

---

**References:**
- Requirements: `docs/features/simulateur-wizard/requirements.md`
- Phase spec: `docs/phases/PHASE-3-INTERFACE.md`
- Design tokens: `docs/design/design-tokens.css`
