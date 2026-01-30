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
| 7 | Corrections Post-Revue | Sécurité, TypeScript, Qualité Code | 1j |

**Total estimé:** 8.5 jours

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

- [x] **5.1** Créer `plus-value.ts` avec :
  - `calculerPlusValue(vente, achat, durée)` → PV nette + impôts
  - `calculerAbattementIR(années)` → % abattement
  - `calculerAbattementPS(années)` → % abattement
  - `calculerSurtaxe(pvImposable)` → surtaxe
- [x] **5.2** Créer `__tests__/plus-value.test.ts` avec :
  - Test abattement IR après 22 ans = 100% ✓
  - Test abattement PS après 30 ans = 100% ✓
  - Test surtaxe > 50k€ ✓
  - 45 tests, 98%+ coverage
- [x] **5.3** Créer `lmnp.ts` avec :
  - `calculerLMNP(input)` → résultat fiscal + cash-flow
  - `calculerLMNPMicroBIC(recettes, type)` → micro-BIC
  - `calculerLMNPReel(input)` → régime réel avec amortissements
  - `comparerJeanbrunLMNP(jeanbrun, lmnp)` → recommandation
  - 39 tests complets
- [x] **5.4** Créer `rendements.ts` avec :
  - `calculerRendements(input)` → brut, net, net-net
  - 23 tests, 100% coverage
- [x] **5.5** Exporter depuis `index.ts`

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

- [x] **6.1** Créer `orchestrateur.ts` avec :
  - `orchestrerSimulation(input)` → SimulationResult complet
  - `calculerLoyerEstime(surface, niveau, zone)` → loyer €/mois
- [x] **6.2** Créer `__tests__/orchestrateur.test.ts` avec :
  - Test simulation complète neuf intermédiaire (66 tests)
  - Test simulation complète ancien avec travaux
  - Test comparatif LMNP activé
- [x] **6.3** Créer `src/app/api/simulation/calcul/route.ts` :
  - POST endpoint
  - Validation Zod des inputs
  - Retour JSON structuré
- [x] **6.4** Créer schéma Zod `src/lib/validations/simulation.ts`
- [x] **6.5** Vérifier coverage >= 90% ✓ (98.51%)
- [x] **6.6** Build final sans erreur ✓

### Validation Phase 6
```bash
pnpm test           # Tous les tests passent
pnpm test:coverage  # Coverage >= 90%
pnpm build:ci       # Build OK
pnpm check          # Lint + typecheck OK
```

---

## Phase 7: Corrections Post-Revue (1j)

### Objectif
Corriger les issues identifiées par la revue multi-agents (code-reviewer, security-reviewer, typescript-pro, tdd-guide, architect).

### Rapport de Revue

| Agent | Verdict | Coverage/Grade |
|-------|---------|----------------|
| Code Reviewer | APPROVE ✅ | 0 CRITICAL, 3 HIGH |
| Security Reviewer | MEDIUM Risk ⚠️ | 0 CRITICAL, 2 HIGH |
| TypeScript Expert | Grade A- ✅ | 0 CRITICAL, 1 HIGH |
| TDD Guide | EXCELLENT ✅ | 97.89% statements, 330 tests |
| Architect | Production-Ready ✅ | Architecture solide |

### Tâches Priorité HAUTE (Must Fix)

- [x] **7.1** [SECURITY] Corriger bypass rate limiting en mode dev
  - **Fichier:** `src/lib/rate-limit.ts:53-63`
  - **Problème:** Si Redis non configuré, le rate limiter devient no-op
  - **Fix:** Ajouter fail-safe en production (rejeter si Redis manquant)
  ```typescript
  if (!redis) {
    if (process.env.NODE_ENV === "production") {
      console.error("CRITICAL: Redis not configured in production");
      return { limit: async () => ({ success: false, limit: 0, reset: Date.now(), remaining: 0 }) };
    }
    console.warn("Rate limiting disabled: Redis not configured");
  }
  ```

- [x] **7.2** [SECURITY] Ajouter vérification CORS/Origin sur API simulation
  - **Fichier:** `src/app/api/simulation/calcul/route.ts`
  - **Problème:** Pas de vérification de l'origine des requêtes
  - **Fix:** Vérifier l'header Origin contre les domaines autorisés
  ```typescript
  const origin = request.headers.get("origin");
  const allowedOrigins = [process.env.NEXT_PUBLIC_APP_URL];
  if (origin && !allowedOrigins.includes(origin)) {
    return NextResponse.json({ success: false, error: "Origin not allowed" }, { status: 403 });
  }
  ```

- [x] **7.3** [TYPESCRIPT] Corriger accès array sans vérification undefined
  - **Fichier:** `src/lib/calculs/tmi.ts:30`
  - **Problème:** `TRANCHES_IR_2026[0]` peut être undefined avec `noUncheckedIndexedAccess`
  - **Fix:**
  ```typescript
  const firstTranche = TRANCHES_IR_2026[0];
  if (!firstTranche) {
    throw new Error("TRANCHES_IR_2026 must not be empty");
  }
  let trancheTrouvee: TrancheIR = { ...firstTranche };
  ```

- [x] **7.4** [CODE] Ajouter validation division par zéro dans `calculerTMI`
  - **Fichier:** `src/lib/calculs/tmi.ts:25`
  - **Problème:** `nombreParts <= 0` produit Infinity ou NaN
  - **Fix:** Retourner résultat par défaut si `nombreParts <= 0`

- [x] **7.5** [CODE] Ajouter validation inputs négatifs dans `calculerPlusValue`
  - **Fichier:** `src/lib/calculs/plus-value.ts:183-191`
  - **Problème:** Valeurs négatives pour `prixVente`, `prixAchat`, `dureeDetention`
  - **Fix:** Vérifier `>= 0` et retourner résultat exonéré si invalide

### Tâches Priorité MOYENNE (Should Fix)

- [x] **7.6** [SECURITY] Sanitizer erreurs Zod en production
  - **Fichier:** `src/app/api/simulation/calcul/route.ts:111-119`
  - **Problème:** Détails d'erreur Zod exposés (aide reconnaissance)
  - **Fix:** En prod, retourner message générique sans `fieldErrors`

- [x] **7.7** [SECURITY] Ajouter limite taille body explicite
  - **Fichier:** `src/app/api/simulation/calcul/route.ts:106`
  - **Problème:** Pas de vérification content-length avant parsing JSON
  - **Fix:** Vérifier `content-length < 10KB` avant `request.json()`

- [x] **7.8** [SECURITY] Préférer `x-real-ip` header (Vercel) au lieu de `x-forwarded-for`
  - **Fichier:** `src/lib/rate-limit.ts:139-157`
  - **Problème:** `x-forwarded-for` peut être spoofé
  - **Fix:** Utiliser d'abord `x-real-ip` (header Vercel non-spoofable)

- [x] **7.9** [TYPESCRIPT] Déplacer `LigneReportDeficit` dans types/
  - **Fichier:** `src/lib/calculs/deficit-foncier.ts:23-32`
  - **Problème:** Interface définie dans le fichier d'implémentation
  - **Fix:** Déplacer vers `types/deficit-foncier.ts` et re-exporter

- [x] **7.10** [CODE] Documenter unités (annuel vs mensuel) dans types
  - **Fichier:** `src/lib/calculs/types/simulation.ts`
  - **Problème:** `chargesCopropriete` et `taxeFonciere` pas clairement annuelles
  - **Fix:** Ajouter JSDoc `@example 1200 pour 100€/mois`

- [x] **7.11** [CODE] Déplacer constantes locales de `plus-value.ts` vers `constants.ts`
  - **Fichier:** `src/lib/calculs/plus-value.ts:34-44`
  - **Constantes:** `FORFAIT_FRAIS_ACQUISITION`, `FORFAIT_TRAVAUX`, `SEUIL_DETENTION_FORFAIT_TRAVAUX`
  - **Fix:** Centraliser dans `constants.ts` pour cohérence

- [x] **7.12** [CODE] Factoriser code dupliqué dans LMNP
  - **Fichier:** `src/lib/calculs/lmnp.ts:87-241`
  - **Problème:** Calcul amortissement par composants dupliqué
  - **Fix:** Extraire fonction helper `calculerAmortissementComposant()`

### Tâches Priorité BASSE (Nice to Have)

- [x] **7.13** [ARCHITECTURE] Ajouter type guard pour éligibilité Jeanbrun
  - **Fichier:** `src/lib/calculs/types/jeanbrun.ts`
  - **Fix:** Créé `isJeanbrunEligible()` pour type narrowing
  ```typescript
  export function isJeanbrunEligible(
    result: JeanbrunNeufResult | JeanbrunAncienResult
  ): result is JeanbrunNeufResult | JeanbrunAncienEligible {
    return !('eligible' in result) || result.eligible;
  }
  ```

- [x] **7.14** [ARCHITECTURE] Discriminated union pour `JeanbrunAncienResult`
  - **Fichier:** `src/lib/calculs/types/jeanbrun.ts`
  - **Fix:** Séparé en `JeanbrunAncienEligible | JeanbrunAncienIneligible`
  - Tests mis à jour avec type narrowing

- [x] **7.15** [CODE] Utiliser spread pattern pour propriétés optionnelles conditionnelles
  - **Fichier:** `src/lib/calculs/credit.ts:169-178`
  - **Fix:** `...(assuranceMensuelle !== undefined && { assurance: assuranceMensuelle })`
  - Objet `ligne` créé de manière immutable

- [x] **7.16** [DOC] Ajouter `@source`, `@fiscalYear` et `@lastUpdated` aux constantes fiscales
  - **Fichier:** `src/lib/calculs/constants.ts`
  - **Fix:** Documenté toutes les constantes avec sources officielles (BOFiP, CGI, PLF, HCSF)

- [x] **7.17** [TESTS] Ajouter tests de validation d'erreur
  - **Fichiers:** Tous les `__tests__/*.test.ts` (10 fichiers)
  - **Fix:** 77 nouveaux tests de validation (NaN, Infinity, valeurs négatives)
  - Total: 410 tests passent

### Tâches Long Terme (Maintenance)

- [x] **7.18** [ARCHITECTURE] Implémenter versioning des constantes par année fiscale
  - **Objectif:** Supporter plusieurs années fiscales (2025, 2026, 2027...)
  - **Pattern:** `TAX_CONSTANTS[year].TRANCHES_IR`
  - **Implémenté:** Interface `FiscalYearConstants`, `getConstantsForYear()`, constantes 2025/2026/2027

- [x] **7.19** [ARCHITECTURE] Ajouter feature flags pour réformes fiscales à venir
  - **Objectif:** Activer/désactiver fonctionnalités (ex: réforme PV 17 ans)
  - **Pattern:** `TaxFeatureFlags { plusValue17YearsRule: boolean }`
  - **Implémenté:** 11 flags, runtime config, helpers (`getSeuilExonerationIR`, etc.), 20 tests

- [x] **7.20** [ARCHITECTURE] Créer interface `CalculationModule<TInput, TResult>`
  - **Objectif:** Découpler orchestrateur des modules de calcul
  - **Avantage:** Facilite l'injection de dépendances et les tests
  - **Implémenté:** Interface générique, types spécifiques par module, `ModuleRegistry`, `ModuleFactory`

- [x] **7.21** [PERFORMANCE] Ajouter benchmarks de performance
  - **Objectif:** Détecter régressions de performance
  - **Outil:** Vitest bench ou custom benchmark
  - **Implémenté:** 19 tests benchmark, vérifie ENF-1 (< 50ms), rapport de performance

### Validation Phase 7
```bash
# Après corrections HIGH
pnpm typecheck
pnpm lint
pnpm test
pnpm build:ci

# Tests de sécurité manuels
curl -X POST http://localhost:3000/api/simulation/calcul \
  -H "Content-Type: application/json" \
  -H "Origin: https://malicious-site.com" \
  -d '{}' # Doit retourner 403

# Vérifier rate limiting fonctionne
for i in {1..15}; do curl -s -o /dev/null -w "%{http_code}\n" \
  http://localhost:3000/api/simulation/calcul -X POST; done
# Les dernières requêtes doivent retourner 429
```

### Commits Phase 7
```
fix(security): add production fail-safe for rate limiting (7.1)
fix(security): add CORS origin verification on simulation API (7.2)
fix(typescript): add undefined check for array access in tmi.ts (7.3)
fix(calculs): add input validation for nombreParts and plusValue (7.4, 7.5)
fix(security): sanitize Zod errors in production (7.6)
fix(security): add body size limit and prefer x-real-ip header (7.7, 7.8)
refactor(types): move LigneReportDeficit to types folder (7.9)
docs(types): document annual vs monthly units (7.10)
refactor(calculs): centralize plus-value constants (7.11)
refactor(lmnp): extract amortissement component helper (7.12)
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
| 7 | `code-reviewer` | Valider corrections code |
| 7 | `security-reviewer` | Valider corrections sécurité |
| 7 | `typescript-pro` | Valider corrections TypeScript |

### Agents utilisés pour la Revue Post-Implémentation

| Agent | Fichiers Analysés | Résultat |
|-------|-------------------|----------|
| `code-reviewer` | Tous `src/lib/calculs/*.ts` | 0 CRITICAL, 3 HIGH, 6 MEDIUM |
| `security-reviewer` | `route.ts`, `rate-limit.ts`, `logger.ts` | 0 CRITICAL, 2 HIGH, 4 MEDIUM |
| `typescript-pro` | `types/*.ts`, tous modules | Grade A-, 1 HIGH issue |
| `tdd-guide` | `__tests__/*.test.ts` | 330 tests, 97.89% coverage |
| `architect` | Architecture globale | Production-Ready |

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

*Dernière mise à jour : 30 janvier 2026 (Phase 7 complétée - TOUTES les tâches terminées, incluant Long Terme)*

## Résumé Final

| Phase | Tâches | Statut |
|-------|--------|--------|
| Phase 1 | Setup + Constantes | ✅ Terminée |
| Phase 2 | IR + TMI | ✅ Terminée |
| Phase 3 | Jeanbrun Neuf/Ancien | ✅ Terminée |
| Phase 4 | Déficit Foncier + Crédit | ✅ Terminée |
| Phase 5 | Plus-Value + LMNP + Rendements | ✅ Terminée |
| Phase 6 | Orchestrateur + API | ✅ Terminée |
| Phase 7 | Corrections Post-Revue | ✅ Terminée |
| Long Terme | Versioning + Flags + Module Interface + Benchmarks | ✅ Terminée |

**Total:** 449 tests passent, coverage 98%+, build OK
