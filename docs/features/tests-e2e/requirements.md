# Tests E2E - Requirements

**Feature:** Tests End-to-End Playwright
**Version:** 1.0
**Date:** 02 fevrier 2026
**Sprint:** 6 (S11-S12)

---

## 1. Description

Les tests E2E garantissent que les parcours utilisateurs critiques fonctionnent correctement sur tous les navigateurs cibles. Ils couvrent la simulation rapide, le wizard 6 etapes, le paiement Stripe, et l'export PDF.

### Objectifs

- Detecter les regressions avant mise en production
- Valider les parcours critiques sur Chrome, Firefox, Safari
- Assurer la compatibilite mobile (viewport 375px)
- Fournir des screenshots/videos pour debug

---

## 2. Exigences fonctionnelles

### 2.1 Parcours critiques a tester

| Parcours | Description | Priorite |
|----------|-------------|----------|
| Simulation rapide | Page ville → budget → resultats | CRITIQUE |
| Wizard 6 etapes | Etapes 1-6 → resultats | CRITIQUE |
| Paiement Stripe | Overlay → checkout → success | CRITIQUE |
| Export PDF | Bouton → telechargement | HAUTE |
| Navigation | Header, footer, liens internes | MOYENNE |
| Page ville SEO | Contenu, metadata, structured data | MOYENNE |
| Formulaire contact | Soumission → confirmation | BASSE |

### 2.2 Simulation rapide

**En tant que visiteur**, je veux simuler mon investissement depuis une page ville.

**Etapes:**
1. Naviguer vers `/villes/lyon`
2. Remplir budget (200000 EUR)
3. Selectionner tranche revenus (50000-80000 EUR)
4. Cliquer "Calculer"
5. Verifier affichage resultats (economie annuelle visible)

**Criteres d'acceptation:**
- [ ] Page charge en < 3s
- [ ] Formulaire valide les inputs
- [ ] Resultats affiches sans erreur
- [ ] Mobile responsive (375px)

### 2.3 Wizard 6 etapes

**En tant qu'utilisateur**, je veux completer le simulateur avance.

**Etapes:**
1. Naviguer vers `/simulateur/avance`
2. Etape 1: Remplir profil (situation, revenus, objectif)
3. Etape 2: Definir projet (type bien, ville, prix)
4. Etape 3: Configurer financement (apport, duree, taux)
5. Etape 4: Choisir strategie locative (niveau loyer, charges)
6. Etape 5: Definir sortie (duree, revalorisation)
7. Etape 6: Selectionner structure juridique
8. Verifier page resultats

**Criteres d'acceptation:**
- [ ] Navigation Retour/Continuer fonctionnelle
- [ ] Progress bar mise a jour
- [ ] Validation temps reel
- [ ] Donnees persistees entre etapes
- [ ] Resultats corrects selon inputs

### 2.4 Paiement Stripe

**En tant qu'utilisateur freemium**, je veux debloquer le contenu premium.

**Etapes:**
1. Aller sur page resultats avec sections bloquees
2. Cliquer "Debloquer (9,90 EUR)"
3. Etre redirige vers Stripe Checkout
4. Remplir carte test (4242 4242 4242 4242)
5. Valider paiement
6. Etre redirige vers page succes
7. Verifier sections debloquees

**Criteres d'acceptation:**
- [ ] Overlay premium visible sur sections verrouillees
- [ ] Redirection Stripe Checkout OK
- [ ] Paiement carte test accepte
- [ ] Redirection success OK
- [ ] Sections premium debloquees

### 2.5 Export PDF

**En tant qu'utilisateur premium**, je veux telecharger mon rapport.

**Etapes:**
1. Avoir quota > 0 (premium)
2. Cliquer bouton "Telecharger PDF"
3. Attendre generation (< 5s)
4. Verifier telechargement fichier

**Criteres d'acceptation:**
- [ ] Bouton actif si premium
- [ ] Spinner pendant generation
- [ ] Fichier telecharge
- [ ] PDF lisible et complet

---

## 3. Exigences non-fonctionnelles

### 3.1 Navigateurs cibles

| Navigateur | Version | Priorite |
|------------|---------|----------|
| Chrome | Latest | CRITIQUE |
| Firefox | Latest | HAUTE |
| Safari | Latest | HAUTE |
| Edge | Latest | MOYENNE |
| Chrome Mobile | Latest | HAUTE |
| Safari iOS | Latest | HAUTE |

### 3.2 Viewports

| Device | Largeur | Hauteur |
|--------|---------|---------|
| Mobile | 375px | 667px |
| Tablet | 768px | 1024px |
| Desktop | 1280px | 800px |
| Large | 1920px | 1080px |

### 3.3 Performance

- Chaque test < 60 secondes
- Suite complete < 10 minutes
- Pas de flakiness (tests stables)
- Retry automatique x2 si echec

### 3.4 Artefacts

| Artefact | Quand | Format |
|----------|-------|--------|
| Screenshot | Echec | PNG |
| Video | Toujours | WebM |
| Trace | Echec | ZIP |
| HAR | Optionnel | HAR |

---

## 4. Structure fichiers

```
e2e/
├── fixtures/
│   ├── test-data.ts           # Donnees de test
│   └── auth.setup.ts          # Setup authentification
├── pages/
│   ├── simulation-page.ts     # Page Object Model
│   ├── wizard-page.ts
│   ├── results-page.ts
│   └── checkout-page.ts
├── tests/
│   ├── simulation-rapide.spec.ts
│   ├── wizard-complete.spec.ts
│   ├── paiement-stripe.spec.ts
│   ├── export-pdf.spec.ts
│   ├── navigation.spec.ts
│   └── seo-pages.spec.ts
├── playwright.config.ts
└── global-setup.ts
```

---

## 5. Criteres d'acceptation globaux

### Couverture

- [ ] 5 parcours critiques testes
- [ ] 3 navigateurs (Chrome, Firefox, Safari)
- [ ] 2 viewports (mobile, desktop)
- [ ] 0 test flaky

### CI/CD

- [ ] Tests executent sur GitHub Actions
- [ ] Rapport HTML genere
- [ ] Artefacts uploadees
- [ ] Bloque merge si echec

### Documentation

- [ ] README avec commandes
- [ ] Page Objects documentes
- [ ] Fixtures expliquees

---

## 6. Hors scope

- Tests de charge (k6 - feature separee)
- Tests visuels (Percy - futur)
- Tests API isoles (couverts par unit tests)
- Tests accessibilite (axe-core - deja fait)

---

**References:**
- Playwright docs: https://playwright.dev/docs
- Phase spec: `docs/phases/PHASE-6-DEPLOY.md`
