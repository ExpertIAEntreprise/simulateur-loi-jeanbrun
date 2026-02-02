# Simulateur Wizard - Plan d'implementation

**Feature:** Simulateur Loi Jeanbrun 6 etapes
**Estimation totale:** 18,5 jours
**Date:** 30 janvier 2026
**Derniere MAJ:** 02 fevrier 2026

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

| Phase | Description | Effort | Dependances |
|-------|-------------|--------|-------------|
| A | Layout + Navigation | 1,5j | - |
| B | Etapes 1-2 (Profil + Projet) | 4,5j | Phase A |
| C | Etapes 3-4 (Financement + Location) | 4j | Phase B |
| D | Etapes 5-6 (Sortie + Structure) | 3j | Phase C |
| E | Page Resultats | 3,5j | Phase D |
| F | Tests + Polish | 2j | Phase E |

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

- [ ] **F.1** Tests unitaires composants (0,75j)
  - Coverage >= 70%
  - Tests: validation, calculs, navigation
  - Framework: Vitest + Testing Library

- [ ] **F.2** Tests integration (0,5j)
  - Parcours complet 6 etapes
  - Sauvegarde localStorage
  - Soumission API

- [ ] **F.3** Audit accessibilite (0,25j)
  - axe-core automated
  - Navigation clavier
  - Focus visible

- [ ] **F.4** Responsive polish (0,25j)
  - Verification 375px, 768px, 1024px, 1440px
  - Ajustements spacing/typography

- [ ] **F.5** Performance audit (0,25j)
  - Lighthouse >= 90
  - INP < 200ms
  - Bundle size check

### Livrables

- Tests passes
- Accessibilite WCAG 2.1 AA
- Performance optimale

---

## Calendrier suggere

| Semaine | Phases | Jours |
|---------|--------|-------|
| S5 - J1-J2 | Phase A (Layout) | 1,5j |
| S5 - J3-J5 | Phase B (Etapes 1-2) | 4,5j |
| S6 - J1-J4 | Phase C (Etapes 3-4) | 4j |
| S6 - J4-J5 | Phase D (Etapes 5-6) | 3j |
| S6 - J5 + S7 | Phase E (Resultats) | 3,5j |
| S7 | Phase F (Tests) | 2j |

---

## Risques identifies

| Risque | Impact | Mitigation |
|--------|--------|------------|
| API villes lente | UX degradee | Cache agressif + debounce |
| Recharts poids bundle | Performance | Lazy loading + tree shaking |
| Formules calcul complexes | Bugs | Tests unitaires dedies |
| Responsive graphiques | UX mobile | Points reduits + scroll |

---

## Definition of Done

- [ ] Code TypeScript strict sans erreurs
- [ ] Tests unitaires >= 70% coverage
- [ ] Responsive verifie sur 4 breakpoints
- [ ] Accessibilite WCAG 2.1 AA
- [ ] Performance Lighthouse >= 90
- [ ] Review code effectuee
- [ ] Documentation mise a jour

---

**References:**
- Requirements: `docs/features/simulateur-wizard/requirements.md`
- Phase spec: `docs/phases/PHASE-3-INTERFACE.md`
- Design tokens: `docs/design/design-tokens.css`
