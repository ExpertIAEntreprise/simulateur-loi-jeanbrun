# Plan d'Implémentation: Moteur de Calcul Fiscal

## Vue d'ensemble

| Phase | Description | Fichiers | Effort |
|-------|-------------|----------|--------|
| 1 | Setup + Constantes | constants.ts, types | 0.5j |
| 2 | Module IR + TMI | ir.ts, tmi.ts + tests | 1j |
| 3 | Modules Jeanbrun | jeanbrun-neuf.ts, jeanbrun-ancien.ts + tests | 1.5j |
| 4 | Déficit + Crédit | deficit-foncier.ts, credit.ts + tests | 1.5j |
| 5 | Plus-Value + LMNP | plus-value.ts, lmnp.ts, rendements.ts + tests | 1.5j |
| 6 | Orchestrateur + API | orchestrateur.ts, route API, tests finaux | 1.5j |

**Total estimé:** 7.5 jours

---

## Phase 1: Setup + Constantes (0.5j)

### Objectif
Mettre en place la structure du module et centraliser tous les barèmes fiscaux.

### Tâches

- [x] **1.1** Créer le dossier `src/lib/calculs/`
- [x] **1.2** Créer `constants.ts` avec :
  - Tranches IR 2026 (5 tranches)
  - Plafond quotient familial (1 791€)
  - Taux et plafonds Jeanbrun neuf (3 niveaux)
  - Taux et plafonds Jeanbrun ancien (3 niveaux)
  - Seuil travaux ancien (30%)
  - Déficit foncier bonifié (21 400€)
  - Date fin bonification (31/12/2027)
  - Plafonds loyer par zone (A_bis, A, B1, B2, C)
- [x] **1.3** Créer `src/lib/calculs/types.ts` avec :
  - `SimulationCalculInput` (tous les paramètres d'entrée)
  - `SimulationCalculResult` (tous les résultats)
  - Types énumérés (NiveauLoyerJeanbrun, ZoneFiscale, TypeBien)
- [x] **1.4** Créer `index.ts` avec exports publics

### Validation Phase 1
```bash
pnpm typecheck  # Pas d'erreur sur les types
```

---

## Phase 2: Module IR + TMI (1j)

### Objectif
Implémenter le calcul de l'impôt sur le revenu et de la TMI.

### Tâches

- [x] **2.1** Créer `ir.ts` avec :
  - `calculerIR(revenu, parts)` → impôt brut, net, TMI, taux moyen
  - `calculerImpotSansQF(revenu)` (helper interne)
  - `determinerTMI(revenu, parts)` → taux TMI
- [x] **2.2** Créer `tmi.ts` avec :
  - `calculerTMI(revenu, parts)` → TMI + infos tranche
  - `calculerEconomieImpot(deduction, tmi)` → économie fiscale
- [x] **2.3** Créer `__tests__/ir.test.ts` avec :
  - Test célibataire 30k€ → TMI 11%
  - Test couple 2 parts 60k€ → TMI 11%
  - Test 50k€ → TMI 30%
  - Test 200k€ → TMI 45%
  - Test plafonnement QF
- [x] **2.4** Exporter depuis `index.ts`

### Validation Phase 2
```bash
pnpm test -- ir.test.ts  # Tests passent
pnpm typecheck
```

---

## Phase 3: Modules Jeanbrun (1.5j)

### Objectif
Implémenter les calculs d'amortissement Jeanbrun neuf et ancien.

### Tâches

- [x] **3.1** Créer `jeanbrun-neuf.ts` avec :
  - `calculerJeanbrunNeuf(prix, niveau)` → amortissement plafonné
  - `tableauAmortissementNeuf(input)` → tableau 9 ans
- [x] **3.2** Créer `__tests__/jeanbrun-neuf.test.ts` avec :
  - Test 200k€ intermédiaire → 5 600€
  - Test 300k€ intermédiaire → plafonné 8 000€
  - Test 200k€ social → 7 200€
  - Test 200k€ très social → 8 800€
- [x] **3.3** Créer `jeanbrun-ancien.ts` avec :
  - `calculerJeanbrunAncien(prix, travaux, niveau)` → amortissement
  - `calculerTravauxMinimum(prix)` → seuil 30%
  - `verifierEligibiliteTravaux(prix, travaux)` → éligible + manquant
- [x] **3.4** Créer `__tests__/jeanbrun-ancien.test.ts` avec :
  - Test travaux 25% → inéligible
  - Test travaux 30% → éligible
  - Test 150k€ + 50k€ → amortissement correct
- [x] **3.5** Exporter depuis `index.ts`

### Validation Phase 3
```bash
pnpm test -- jeanbrun  # Tests passent
pnpm typecheck
```

---

## Phase 4: Déficit Foncier + Crédit (1.5j)

### Objectif
Implémenter le déficit foncier bonifié et le calcul de crédit immobilier.

### Tâches

- [x] **4.1** Créer `deficit-foncier.ts` avec :
  - `calculerDeficitFoncier(input)` → déficit imputable + reportable
  - `tableauReportDeficit(deficit, revenus[])` → report 10 ans
- [x] **4.2** Créer `credit.ts` avec :
  - `calculerCredit(montant, taux, durée, assurance)` → mensualité + tableau
  - `calculerCapaciteEmprunt(revenu, charges, taux, durée)` → capacité max
  - `calculerTauxEndettement(revenu, mensualité)` → taux %
- [x] **4.3** Créer `__tests__/credit.test.ts` et `__tests__/deficit-foncier.test.ts` avec :
  - Test mensualité 200k€ à 3.5% sur 20 ans ✓
  - Test tableau amortissement (somme capital = montant) ✓
  - Test capacité d'emprunt ✓
  - Test taux endettement 35% ✓
  - Test déficit < plafond standard ✓
  - Test plafond bonifié (travaux énergétiques) ✓
  - Test tableau report sur 10 ans ✓
- [x] **4.4** Exporter depuis `index.ts`

### Validation Phase 4
```bash
pnpm test -- credit  # Tests passent
pnpm test -- deficit  # Tests passent
pnpm typecheck
```

---

## Phase 5: Plus-Value + LMNP + Rendements (1.5j)

### Objectif
Implémenter les calculs de plus-value, comparatif LMNP et rendements.

### Tâches

- [ ] **5.1** Créer `plus-value.ts` avec :
  - `calculerPlusValue(vente, achat, durée)` → PV nette + impôts
  - `calculerAbattementIR(années)` → % abattement
  - `calculerAbattementPS(années)` → % abattement
  - `calculerSurtaxe(pvImposable)` → surtaxe
- [ ] **5.2** Créer `__tests__/plus-value.test.ts` avec :
  - Test abattement IR après 22 ans = 100%
  - Test abattement PS après 30 ans = 100%
  - Test surtaxe > 50k€
- [ ] **5.3** Créer `lmnp.ts` avec :
  - `calculerLMNP(input)` → résultat fiscal + cash-flow
  - `comparerJeanbrunLMNP(jeanbrun, lmnp)` → recommandation
- [ ] **5.4** Créer `rendements.ts` avec :
  - `calculerRendements(input)` → brut, net, net-net
- [ ] **5.5** Exporter depuis `index.ts`

### Validation Phase 5
```bash
pnpm test -- plus-value  # Tests passent
pnpm test -- lmnp
pnpm test -- rendements
pnpm typecheck
```

---

## Phase 6: Orchestrateur + API (1.5j)

### Objectif
Créer l'orchestrateur qui coordonne tous les calculs et exposer via API.

### Tâches

- [ ] **6.1** Créer `orchestrateur.ts` avec :
  - `orchestrerSimulation(input)` → SimulationResult complet
  - `calculerLoyerEstime(surface, niveau, zone)` → loyer €/mois
- [ ] **6.2** Créer `__tests__/orchestrateur.test.ts` avec :
  - Test simulation complète neuf intermédiaire
  - Test simulation complète ancien avec travaux
  - Test comparatif LMNP activé
- [ ] **6.3** Créer `src/app/api/simulation/calcul/route.ts` :
  - POST endpoint
  - Validation Zod des inputs
  - Retour JSON structuré
- [ ] **6.4** Créer schéma Zod `src/lib/validations/simulation.ts`
- [ ] **6.5** Vérifier coverage >= 90%
- [ ] **6.6** Build final sans erreur

### Validation Phase 6
```bash
pnpm test           # Tous les tests passent
pnpm test:coverage  # Coverage >= 90%
pnpm build:ci       # Build OK
pnpm check          # Lint + typecheck OK
```

---

## Cas de Test de Référence

| Scénario | Entrées | Résultat attendu |
|----------|---------|------------------|
| Neuf intermédiaire 200k€, TMI 30% | prix=200000, niveau=intermediaire | Économie 1 680€/an |
| Neuf social 200k€, TMI 30% | prix=200000, niveau=social | Économie 2 160€/an |
| Neuf très social 200k€, TMI 30% | prix=200000, niveau=tres_social | Économie 2 640€/an |
| Ancien 150k€ + 50k€ travaux, TMI 30% | prix=150000, travaux=50000, niveau=intermediaire | Économie 1 440€/an |
| Ancien travaux insuffisants | prix=150000, travaux=30000 | Inéligible (20% < 30%) |

---

## Agents à Utiliser

| Phase | Agent | Raison |
|-------|-------|--------|
| Toutes | `tdd-guide` | Écrire tests AVANT le code |
| 2-5 | `code-reviewer` | Valider chaque module |
| 6 | `security-reviewer` | Valider l'API |

---

## Commandes de Validation

```bash
# Après chaque phase
pnpm typecheck
pnpm lint
pnpm test

# Fin de feature
pnpm test:coverage
pnpm build:ci
```

---

## Commit par Phase

```
feat(calculs): add constants and types (Phase 1)
feat(calculs): add IR and TMI calculation (Phase 2)
feat(calculs): add Jeanbrun neuf/ancien modules (Phase 3)
feat(calculs): add deficit foncier and credit modules (Phase 4)
feat(calculs): add plus-value, LMNP, rendements (Phase 5)
feat(calculs): add orchestrator and API endpoint (Phase 6)
```

---

*Dernière mise à jour : 30 janvier 2026*
