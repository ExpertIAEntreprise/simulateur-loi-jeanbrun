# Tests d'Integration - Simulateur Loi Jeanbrun

## Vue d'ensemble

Ce document decrit les tests d'integration pour le simulateur avance en 6 etapes.

## Structure des Tests

```
simulateur_loi_Jeanbrun/
├── e2e/                          # Tests E2E Playwright
│   └── simulateur.spec.ts        # 13 tests du parcours wizard
├── src/
│   └── app/
│       └── simulateur/
│           └── __tests__/
│               └── context.test.tsx  # 30 tests du contexte
└── playwright.config.ts          # Configuration Playwright
```

## Tests Vitest (Unit + Integration)

### SimulationContext (30 tests)

Fichier: `src/app/simulateur/__tests__/context.test.tsx`

| Categorie | Tests | Description |
|-----------|-------|-------------|
| Initialisation | 3 | Etat initial vide, hydratation localStorage, JSON invalide |
| Validation isStepValid | 12 | Validation de chaque etape avec donnees valides/invalides |
| Navigation | 4 | nextStep, prevStep, goToStep, limites 1-6 |
| Mise a jour | 3 | updateStep1-6, merge donnees, setTMI |
| Persistance | 2 | Sauvegarde localStorage, reset |
| Hook useSimulation | 2 | Erreur hors Provider, methodes disponibles |
| Edge Cases | 4 | Updates rapides, valeurs limites, changement type bien |

#### Commande:
```bash
pnpm test:run src/app/simulateur/__tests__/context.test.tsx
```

## Tests Playwright (E2E)

### Parcours Simulateur (13 tests)

Fichier: `e2e/simulateur.spec.ts`

| Suite | Tests | Description |
|-------|-------|-------------|
| Parcours Complet | 2 | Parcours 6 etapes, navigation Retour/Continuer |
| Persistance localStorage | 3 | Sauvegarde auto, restauration, reset |
| Validation Formulaires | 3 | Bouton desactive/active, redirection prerequis |
| Edge Cases | 2 | Bien ancien avec travaux, retour depuis resultats |
| API Integration | 1 | Chargement page resultats |
| Accessibilite | 2 | Navigation clavier, labels inputs |

#### Commandes:
```bash
# Lancer tous les tests E2E
pnpm test:e2e

# Mode headed (voir le navigateur)
pnpm test:e2e:headed

# Mode debug (pas a pas)
pnpm test:e2e:debug

# Mode UI interactif
pnpm test:e2e:ui

# Voir le rapport HTML
pnpm test:e2e:report
```

## Donnees de Test

### Parcours Valide (Bien Neuf)

```typescript
const VALID_SIMULATION_DATA = {
  step1: {
    situation: "marie",
    parts: 2,
    revenuNet: 60000,
    objectif: "reduire_impots",
  },
  step2: {
    typeBien: "neuf",
    villeNom: "Lyon",
    villeId: "69123",
    zoneFiscale: "A",
    surface: 50,
    prixAcquisition: 250000,
  },
  step3: {
    apport: 50000,
    dureeCredit: 20,
    tauxCredit: 3.5,
    differe: 0,
  },
  step4: {
    niveauLoyer: "intermediaire",
    chargesAnnuelles: 1800,
    taxeFonciere: 1200,
    vacance: 3,
  },
  step5: {
    dureeDetention: 12,
    revalorisation: 2,
    strategieSortie: "revente",
  },
  step6: {
    structure: "nom_propre",
  },
};
```

### Parcours Valide (Bien Ancien avec Travaux)

```typescript
const ANCIEN_AVEC_TRAVAUX_DATA = {
  ...VALID_SIMULATION_DATA,
  step2: {
    typeBien: "ancien",
    villeNom: "Marseille",
    villeId: "13055",
    zoneFiscale: "B1",
    surface: 60,
    prixAcquisition: 150000,
    montantTravaux: 50000, // 33% > 30% requis
    dpeActuel: "F",
    dpeApres: "B",
  },
};
```

## Validation des Etapes

### Etape 1 - Profil Investisseur
- `situation` obligatoire (celibataire | marie | pacse)
- `parts` >= 1
- `revenuNet` > 0
- `objectif` obligatoire

### Etape 2 - Projet Immobilier
- `typeBien` obligatoire (neuf | ancien)
- `villeId` obligatoire
- `surface` >= 9 (loi Carrez)
- `prixAcquisition` > 0
- Si ancien: `montantTravaux` > 0, `dpeActuel`, `dpeApres` requis

### Etape 3 - Financement
- `apport` >= 0
- `dureeCredit` entre 10 et 25 ans
- `tauxCredit` > 0
- `differe` obligatoire (0 | 12 | 24)

### Etape 4 - Strategie Locative
- `niveauLoyer` obligatoire (intermediaire | social | tres_social)
- `loyerMensuel` > 0
- `chargesAnnuelles` >= 0
- `taxeFonciere` >= 0
- `vacance` >= 0

### Etape 5 - Duree et Sortie
- `dureeDetention` >= 9 ans (engagement Jeanbrun)
- `revalorisation` >= 0
- `strategieSortie` obligatoire (revente | conservation | donation)

### Etape 6 - Structure Juridique
- `structure` obligatoire (nom_propre | sci_ir | sci_is)

## CI/CD

### GitHub Actions

```yaml
- name: Run Unit Tests
  run: pnpm test:run

- name: Install Playwright Browsers
  run: npx playwright install --with-deps chromium

- name: Run E2E Tests
  run: pnpm test:e2e
  env:
    BASE_URL: http://localhost:3000

- name: Upload Playwright Report
  uses: actions/upload-artifact@v3
  if: always()
  with:
    name: playwright-report
    path: playwright-report/
    retention-days: 30
```

## Bonnes Pratiques

1. **Nettoyer localStorage** avant chaque test E2E
2. **Utiliser setWizardState()** pour pre-remplir les donnees
3. **Attendre networkidle** apres chaque navigation
4. **Verifier les URLs** avec `expect(page).toHaveURL()`
5. **Tester les edge cases**: donnees manquantes, limites numeriques
6. **Eviter les timeouts fixes**: utiliser `waitFor()` et `expect().toBeVisible()`

## Couverture

Objectif: **80%+ coverage** sur:
- `src/contexts/SimulationContext.tsx`
- `src/lib/hooks/useSimulation.ts`
- `src/lib/calculs/*.ts`

Commande:
```bash
pnpm test:coverage
```
