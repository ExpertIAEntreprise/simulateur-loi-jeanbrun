# Simulateur Wizard - Plan d'implementation

**Feature:** Simulateur Loi Jeanbrun 6 etapes
**Estimation totale:** 18,5 jours
**Date:** 30 janvier 2026
**Derniere MAJ:** 31 janvier 2026

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

- [ ] **A.1** Creer `SimulateurLayout.tsx` (0,5j)
  - Header sticky avec logo et progress
  - Zone contenu centrale (max-w-2xl)
  - Footer sticky avec navigation
  - Fichier: `src/components/simulateur/SimulateurLayout.tsx`

- [ ] **A.2** Creer `ProgressBar.tsx` (0,25j)
  - 6 dots avec labels etapes
  - Barre de progression animee
  - Etat actif/complete/pending
  - Fichier: `src/components/simulateur/ProgressBar.tsx`

- [ ] **A.3** Creer `StepNavigation.tsx` (0,25j)
  - Boutons Retour/Continuer
  - Desactivation selon validation
  - Texte dynamique derniere etape
  - Fichier: `src/components/simulateur/StepNavigation.tsx`

- [ ] **A.4** Creer hook `useSimulation.ts` (0,5j)
  - State global simulation (Zustand ou Context)
  - Sauvegarde localStorage automatique
  - Navigation entre etapes
  - Fichier: `src/lib/hooks/useSimulation.ts`

### Livrables

- Layout fonctionnel avec navigation 6 etapes
- Progress bar animee
- Persistance localStorage

---

## Phase B - Etapes 1-2 (4,5j)

**Objectif:** Collecte profil investisseur et projet immobilier.

### Taches Etape 1 - Profil (2j)

- [ ] **B.1** Creer `ProfilForm.tsx` (0,75j)
  - Formulaire react-hook-form + Zod
  - Champs: situation, parts, revenus, objectif
  - Fichier: `src/components/simulateur/etape-1/ProfilForm.tsx`

- [ ] **B.2** Creer `TMICalculator.tsx` (0,5j)
  - Calcul temps reel TMI
  - Badge colore selon tranche
  - Tooltip explicatif
  - Fichier: `src/components/simulateur/etape-1/TMICalculator.tsx`

- [ ] **B.3** Creer `ObjectifSelector.tsx` (0,25j)
  - 4 cards avec icones
  - Selection unique
  - Fichier: `src/components/simulateur/etape-1/ObjectifSelector.tsx`

- [ ] **B.4** Creer page `etape-1` (0,5j)
  - Route: `/simulateur/avance`
  - Integration composants
  - Fichier: `src/app/simulateur/avance/page.tsx`

### Taches Etape 2 - Projet (2,5j)

- [ ] **B.5** Creer `TypeBienSelector.tsx` (0,5j)
  - 2 cards Neuf/Ancien
  - Affichage conditionnel section travaux
  - Fichier: `src/components/simulateur/etape-2/TypeBienSelector.tsx`

- [ ] **B.6** Creer `VilleAutocomplete.tsx` (0,75j)
  - Combobox avec recherche API
  - Affichage zone fiscale
  - Debounce 300ms
  - Fichier: `src/components/simulateur/etape-2/VilleAutocomplete.tsx`

- [ ] **B.7** Creer `TravauxValidator.tsx` (0,5j)
  - Progress bar pourcentage travaux
  - Alerte si < 30%
  - Badge eligibilite
  - Fichier: `src/components/simulateur/etape-2/TravauxValidator.tsx`

- [ ] **B.8** Creer `RecapProjet.tsx` (0,25j)
  - Tableau recapitulatif Neuf vs Ancien
  - Calcul frais notaire
  - Fichier: `src/components/simulateur/etape-2/RecapProjet.tsx`

- [ ] **B.9** Creer page `etape-2` (0,5j)
  - Route: `/simulateur/avance/etape-2`
  - Integration composants
  - Fichier: `src/app/simulateur/avance/etape-2/page.tsx`

### Livrables

- Etape 1 complete avec TMI auto-calcule
- Etape 2 complete avec validation travaux 30%
- Navigation fonctionnelle entre etapes 1-2

---

## Phase C - Etapes 3-4 (4j)

**Objectif:** Configuration financement et strategie locative.

### Taches Etape 3 - Financement (2j)

- [ ] **C.1** Creer `FinancementForm.tsx` (0,75j)
  - Formulaire: apport, duree, taux, differe
  - Calcul mensualite temps reel
  - Fichier: `src/components/simulateur/etape-3/FinancementForm.tsx`

- [ ] **C.2** Creer `JaugeEndettement.tsx` (0,5j)
  - Jauge 0-100% avec zones couleurs
  - Marqueurs 33% et 35%
  - Alerte si depassement
  - Fichier: `src/components/simulateur/etape-3/JaugeEndettement.tsx`

- [ ] **C.3** Creer `DiffereSelector.tsx` (0,25j)
  - Select 0/12/24 mois
  - Info contextuelle VEFA
  - Fichier: `src/components/simulateur/etape-3/DiffereSelector.tsx`

- [ ] **C.4** Creer page `etape-3` (0,5j)
  - Route: `/simulateur/avance/etape-3`
  - Fichier: `src/app/simulateur/avance/etape-3/page.tsx`

- [x] **C.4bis** Creer `AlerteEndettement.tsx` (FAIT)
  - Alerte contextuelle si endettement > 35%
  - Mention derogation 20% et reste a vivre
  - CTA vers courtier partenaire
  - Fichier: `src/components/simulateur/etape-3/AlerteEndettement.tsx`

### Taches Etape 4 - Location (2j)

- [ ] **C.5** Creer `NiveauLoyerCards.tsx` (0,75j)
  - 3 cards avec loyer max, taux, description
  - Calcul coefficient surface
  - Fichier: `src/components/simulateur/etape-4/NiveauLoyerCards.tsx`

- [ ] **C.6** Creer `PerteGainVisualisation.tsx` (0,5j)
  - Balance perte loyer vs economie fiscale
  - Gain net annuel
  - Fichier: `src/components/simulateur/etape-4/PerteGainVisualisation.tsx`

- [ ] **C.7** Creer `ChargesForm.tsx` (0,25j)
  - Inputs: charges, taxe fonciere, vacance
  - Fichier: `src/components/simulateur/etape-4/ChargesForm.tsx`

- [ ] **C.8** Creer page `etape-4` (0,5j)
  - Route: `/simulateur/avance/etape-4`
  - Fichier: `src/app/simulateur/avance/etape-4/page.tsx`

### Livrables

- Etape 3 complete avec jauge endettement
- Etape 4 complete avec visualisation gain/perte
- Navigation fonctionnelle etapes 1-4

---

## Phase D - Etapes 5-6 (3j)

**Objectif:** Configuration sortie et structure juridique.

### Taches Etape 5 - Sortie (1,5j)

- [ ] **D.1** Creer `DureeSlider.tsx` (0,5j)
  - Slider 9-30 ans avec marqueurs
  - Infos abattements PV contextuelles
  - Fichier: `src/components/simulateur/etape-5/DureeSlider.tsx`

- [ ] **D.2** Creer `RevalorisationInput.tsx` (0,25j)
  - Input 0-5% avec aide
  - Fichier: `src/components/simulateur/etape-5/RevalorisationInput.tsx`

- [ ] **D.3** Creer `StrategieSortie.tsx` (0,25j)
  - Radio: revente, conservation, donation
  - Fichier: `src/components/simulateur/etape-5/StrategieSortie.tsx`

- [ ] **D.4** Creer page `etape-5` (0,5j)
  - Route: `/simulateur/avance/etape-5`
  - Fichier: `src/app/simulateur/avance/etape-5/page.tsx`

### Taches Etape 6 - Structure (1,5j)

- [ ] **D.5** Creer `StructureCards.tsx` (0,75j)
  - 3 cards avec avantages/inconvenients
  - Badge recommandation
  - Fichier: `src/components/simulateur/etape-6/StructureCards.tsx`

- [ ] **D.6** Creer `ComparatifTable.tsx` (0,25j)
  - Tableau comparatif detaille
  - Fichier: `src/components/simulateur/etape-6/ComparatifTable.tsx`

- [ ] **D.7** Creer page `etape-6` (0,5j)
  - Route: `/simulateur/avance/etape-6`
  - Fichier: `src/app/simulateur/avance/etape-6/page.tsx`

### Livrables

- Etape 5 complete avec slider duree
- Etape 6 complete avec recommandation structure
- Parcours 6 etapes complet fonctionnel

---

## Phase E - Page Resultats (3,5j)

**Objectif:** Affichage resultats simulation avec graphiques.

### Taches

- [ ] **E.1** Creer `SyntheseCard.tsx` (0,5j)
  - 4 KPIs: economie fiscale, cash-flow, rendement, effort
  - Fichier: `src/components/simulateur/resultats/SyntheseCard.tsx`

- [ ] **E.2** Creer `GraphiquePatrimoine.tsx` (1j)
  - AreaChart Recharts evolution patrimoine
  - Legende: valeur bien, capital, economies
  - Responsive mobile (points reduits)
  - Fichier: `src/components/simulateur/resultats/GraphiquePatrimoine.tsx`

- [ ] **E.3** Creer `TableauAnnuel.tsx` (0,5j)
  - Tableau annee par annee (Premium)
  - Scroll horizontal mobile
  - Fichier: `src/components/simulateur/resultats/TableauAnnuel.tsx`

- [ ] **E.4** Creer `ComparatifLMNP.tsx` (0,5j)
  - Comparaison Jeanbrun vs LMNP (Premium)
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

- [ ] **E.5** Creer API `simulation/avancee` (0,5j)
  - Route: `/api/simulation/avancee`
  - Validation Zod input
  - Appel moteur calcul (Sprint 2)
  - Fichier: `src/app/api/simulation/avancee/route.ts`

- [ ] **E.6** Creer page resultats (0,5j)
  - Route: `/simulateur/resultat/[id]`
  - Sections Free vs Premium
  - CTA capture email/paiement
  - Fichier: `src/app/simulateur/resultat/[id]/page.tsx`

### Livrables

- Page resultats complete
- Graphique patrimoine interactif
- Sections Premium masquees

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
