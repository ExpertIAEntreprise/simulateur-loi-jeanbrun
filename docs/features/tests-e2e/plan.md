# Tests E2E - Plan d'implementation

**Feature:** Tests End-to-End Playwright
**Estimation totale:** 3 jours
**Date:** 02 fevrier 2026
**Sprint:** 6 (S11-S12)

---

## Vue d'ensemble des phases

| Phase | Description | Effort | Dependances | Statut |
|-------|-------------|--------|-------------|--------|
| A | Configuration Playwright | 0,5j | - | A faire |
| B | Page Objects | 0,5j | Phase A | A faire |
| C | Tests parcours critiques | 1,5j | Phase B | A faire |
| D | CI/CD Integration | 0,5j | Phase C | A faire |

---

## Phase A - Configuration Playwright (0,5j)

**Objectif:** Configurer Playwright avec multi-navigateurs et viewports.

### Taches

- [ ] **A.1** Installer Playwright (0,1j)
  ```bash
  pnpm add -D @playwright/test
  pnpm exec playwright install
  ```

- [ ] **A.2** Configurer playwright.config.ts (0,2j)
  - Multi-navigateurs (Chrome, Firefox, Safari)
  - Multi-viewports (mobile, desktop)
  - Timeouts et retries
  - Fichier: `playwright.config.ts`

```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e/tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { open: 'never' }],
    ['json', { outputFile: 'e2e/results.json' }],
  ],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    // Desktop
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    // Mobile
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
})
```

- [ ] **A.3** Creer global-setup.ts (0,1j)
  - Fichier: `e2e/global-setup.ts`

```typescript
import { chromium, FullConfig } from '@playwright/test'

async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch()
  const page = await browser.newPage()

  // Health check
  await page.goto(config.projects[0].use?.baseURL || 'http://localhost:3000')
  await page.waitForLoadState('networkidle')

  await browser.close()
}

export default globalSetup
```

- [ ] **A.4** Creer fixtures test-data.ts (0,1j)
  - Fichier: `e2e/fixtures/test-data.ts`

```typescript
export const testData = {
  simulation: {
    profil: {
      situation: 'marie',
      parts: 2,
      revenuNet: 60000,
      objectif: 'reduire_impots',
    },
    projet: {
      typeBien: 'neuf',
      ville: 'Lyon',
      surface: 45,
      prixAcquisition: 200000,
    },
    financement: {
      apport: 20000,
      dureeCredit: 20,
      tauxInteret: 3.5,
    },
    location: {
      niveauLoyer: 'intermediaire',
      chargesAnnuelles: 1200,
      taxeFonciere: 800,
      vacanceLocative: 1,
    },
    sortie: {
      dureeDetention: 15,
      revalorisationAnnuelle: 2,
      strategieSortie: 'revente',
    },
    structure: 'nom_propre',
  },
  stripe: {
    cardSuccess: '4242424242424242',
    cardDeclined: '4000000000000002',
    expiry: '12/30',
    cvc: '123',
  },
}
```

### Livrables

- Playwright configure
- Config multi-navigateurs/viewports
- Fixtures de test

---

## Phase B - Page Objects (0,5j)

**Objectif:** Creer Page Object Models pour abstraction.

### Taches

- [ ] **B.1** Creer SimulationPage (0,1j)
  - Fichier: `e2e/pages/simulation-page.ts`

```typescript
import { Page, Locator, expect } from '@playwright/test'

export class SimulationPage {
  readonly page: Page
  readonly budgetInput: Locator
  readonly revenusSelect: Locator
  readonly calculateButton: Locator
  readonly resultsSection: Locator

  constructor(page: Page) {
    this.page = page
    this.budgetInput = page.locator('[name="budget"]')
    this.revenusSelect = page.locator('[name="revenus"]')
    this.calculateButton = page.getByRole('button', { name: /calculer/i })
    this.resultsSection = page.locator('.economie-annuelle')
  }

  async goto(ville: string) {
    await this.page.goto(`/villes/${ville}`)
  }

  async fillSimulation(budget: number, revenus: string) {
    await this.budgetInput.fill(budget.toString())
    await this.revenusSelect.selectOption(revenus)
  }

  async calculate() {
    await this.calculateButton.click()
    await expect(this.resultsSection).toBeVisible({ timeout: 10000 })
  }
}
```

- [ ] **B.2** Creer WizardPage (0,15j)
  - Fichier: `e2e/pages/wizard-page.ts`

```typescript
import { Page, Locator, expect } from '@playwright/test'

export class WizardPage {
  readonly page: Page
  readonly continueButton: Locator
  readonly backButton: Locator
  readonly progressBar: Locator

  constructor(page: Page) {
    this.page = page
    this.continueButton = page.getByRole('button', { name: /continuer/i })
    this.backButton = page.getByRole('button', { name: /retour/i })
    this.progressBar = page.locator('[role="progressbar"]')
  }

  async goto() {
    await this.page.goto('/simulateur/avance')
  }

  async fillStep1(data: typeof testData.simulation.profil) {
    await this.page.selectOption('[name="situation"]', data.situation)
    await this.page.fill('[name="parts"]', data.parts.toString())
    await this.page.fill('[name="revenuNet"]', data.revenuNet.toString())
    await this.page.click(`[data-objectif="${data.objectif}"]`)
    await this.continueButton.click()
  }

  // ... fillStep2 - fillStep6

  async verifyStep(step: number) {
    await expect(this.page.locator(`[data-step="${step}"]`)).toBeVisible()
  }
}
```

- [ ] **B.3** Creer ResultsPage (0,1j)
  - Fichier: `e2e/pages/results-page.ts`

```typescript
import { Page, Locator, expect } from '@playwright/test'

export class ResultsPage {
  readonly page: Page
  readonly syntheseCards: Locator
  readonly premiumOverlay: Locator
  readonly unlockButton: Locator
  readonly pdfButton: Locator

  constructor(page: Page) {
    this.page = page
    this.syntheseCards = page.locator('[data-testid="synthese-card"]')
    this.premiumOverlay = page.locator('[data-testid="premium-overlay"]')
    this.unlockButton = page.getByRole('button', { name: /debloquer/i })
    this.pdfButton = page.getByRole('button', { name: /telecharger pdf/i })
  }

  async goto(id: string) {
    await this.page.goto(`/simulateur/resultat/${id}`)
  }

  async verifyKPIs() {
    await expect(this.syntheseCards).toHaveCount(4)
  }

  async clickUnlock() {
    await this.unlockButton.click()
    await this.page.waitForURL(/checkout.stripe.com/)
  }
}
```

- [ ] **B.4** Creer CheckoutPage (0,15j)
  - Fichier: `e2e/pages/checkout-page.ts`

```typescript
import { Page, expect } from '@playwright/test'
import { testData } from '../fixtures/test-data'

export class CheckoutPage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async fillCard() {
    // Stripe Checkout iframe
    const cardFrame = this.page.frameLocator('iframe[name*="stripe"]')
    await cardFrame.locator('[name="cardNumber"]').fill(testData.stripe.cardSuccess)
    await cardFrame.locator('[name="cardExpiry"]').fill(testData.stripe.expiry)
    await cardFrame.locator('[name="cardCvc"]').fill(testData.stripe.cvc)
  }

  async submit() {
    await this.page.getByRole('button', { name: /pay/i }).click()
  }

  async verifySuccess() {
    await this.page.waitForURL(/\/compte\/succes/)
    await expect(this.page.locator('h1')).toContainText(/merci/i)
  }
}
```

### Livrables

- 4 Page Objects
- Methodes abstraction
- Types TypeScript

---

## Phase C - Tests parcours critiques (1,5j)

**Objectif:** Ecrire les tests pour chaque parcours.

### Taches

- [ ] **C.1** Test simulation rapide (0,25j)
  - Fichier: `e2e/tests/simulation-rapide.spec.ts`

```typescript
import { test, expect } from '@playwright/test'
import { SimulationPage } from '../pages/simulation-page'

test.describe('Simulation rapide', () => {
  test('complete simulation from Lyon page', async ({ page }) => {
    const simulation = new SimulationPage(page)

    await simulation.goto('lyon')
    await simulation.fillSimulation(200000, '50000-80000')
    await simulation.calculate()

    await expect(page.locator('.economie-annuelle')).toBeVisible()
    await expect(page.locator('.economie-annuelle')).toContainText('EUR')
  })

  test('validates required fields', async ({ page }) => {
    const simulation = new SimulationPage(page)

    await simulation.goto('lyon')
    await simulation.calculateButton.click()

    await expect(page.locator('.error-message')).toBeVisible()
  })

  test('responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    const simulation = new SimulationPage(page)

    await simulation.goto('lyon')
    await simulation.fillSimulation(200000, '50000-80000')
    await simulation.calculate()

    await expect(page.locator('.economie-annuelle')).toBeVisible()
  })
})
```

- [ ] **C.2** Test wizard 6 etapes (0,5j)
  - Fichier: `e2e/tests/wizard-complete.spec.ts`

```typescript
import { test, expect } from '@playwright/test'
import { WizardPage } from '../pages/wizard-page'
import { testData } from '../fixtures/test-data'

test.describe('Wizard 6 etapes', () => {
  test('completes full wizard flow', async ({ page }) => {
    const wizard = new WizardPage(page)

    await wizard.goto()

    // Etape 1
    await wizard.fillStep1(testData.simulation.profil)
    await wizard.verifyStep(2)

    // Etape 2
    await wizard.fillStep2(testData.simulation.projet)
    await wizard.verifyStep(3)

    // ... Etapes 3-6

    // Resultats
    await expect(page).toHaveURL(/\/simulateur\/resultat\//)
    await expect(page.locator('[data-testid="synthese-card"]')).toHaveCount(4)
  })

  test('persists data on back navigation', async ({ page }) => {
    const wizard = new WizardPage(page)

    await wizard.goto()
    await wizard.fillStep1(testData.simulation.profil)
    await wizard.backButton.click()

    // Verify data still present
    await expect(page.locator('[name="revenuNet"]')).toHaveValue('60000')
  })

  test('validates each step before continue', async ({ page }) => {
    const wizard = new WizardPage(page)

    await wizard.goto()
    await wizard.continueButton.click()

    await expect(page.locator('.error')).toBeVisible()
  })
})
```

- [ ] **C.3** Test paiement Stripe (0,5j)
  - Fichier: `e2e/tests/paiement-stripe.spec.ts`

```typescript
import { test, expect } from '@playwright/test'
import { ResultsPage } from '../pages/results-page'
import { CheckoutPage } from '../pages/checkout-page'

test.describe('Paiement Stripe', () => {
  test.skip(process.env.SKIP_STRIPE === 'true', 'Stripe tests disabled')

  test('completes checkout flow', async ({ page }) => {
    const results = new ResultsPage(page)
    const checkout = new CheckoutPage(page)

    // Setup: complete wizard first or use seeded data
    await results.goto('test-simulation-id')

    // Verify premium overlay visible
    await expect(results.premiumOverlay).toBeVisible()

    // Start checkout
    await results.clickUnlock()

    // Fill payment
    await checkout.fillCard()
    await checkout.submit()

    // Verify success
    await checkout.verifySuccess()

    // Verify premium unlocked
    await results.goto('test-simulation-id')
    await expect(results.premiumOverlay).not.toBeVisible()
    await expect(results.pdfButton).toBeEnabled()
  })

  test('handles declined card', async ({ page }) => {
    // Similar flow with declined card
  })
})
```

- [ ] **C.4** Test export PDF (0,25j)
  - Fichier: `e2e/tests/export-pdf.spec.ts`

```typescript
import { test, expect } from '@playwright/test'
import { ResultsPage } from '../pages/results-page'

test.describe('Export PDF', () => {
  test('downloads PDF when premium', async ({ page }) => {
    const results = new ResultsPage(page)

    // Setup premium user
    await page.route('/api/quota*', (route) =>
      route.fulfill({ body: JSON.stringify({ quota: 3 }) })
    )

    await results.goto('test-id')

    // Start download
    const downloadPromise = page.waitForEvent('download')
    await results.pdfButton.click()
    const download = await downloadPromise

    // Verify
    expect(download.suggestedFilename()).toMatch(/simulation-jeanbrun.*\.pdf/)
  })

  test('shows disabled when free user', async ({ page }) => {
    const results = new ResultsPage(page)

    await page.route('/api/quota*', (route) =>
      route.fulfill({ body: JSON.stringify({ quota: 0 }) })
    )

    await results.goto('test-id')

    await expect(results.pdfButton).toBeDisabled()
  })
})
```

### Livrables

- 4 fichiers de tests
- Couverture parcours critiques
- Mocks pour tests isoles

---

## Phase D - CI/CD Integration (0,5j)

**Objectif:** Integrer tests E2E dans GitHub Actions.

### Taches

- [ ] **D.1** Creer workflow GitHub Actions (0,25j)
  - Fichier: `.github/workflows/e2e.yml`

```yaml
name: E2E Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  e2e:
    runs-on: ubuntu-latest
    timeout-minutes: 15

    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 9

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install

      - name: Install Playwright browsers
        run: pnpm exec playwright install --with-deps

      - name: Build app
        run: pnpm build
        env:
          POSTGRES_URL: ${{ secrets.POSTGRES_URL }}
          BETTER_AUTH_SECRET: ${{ secrets.BETTER_AUTH_SECRET }}

      - name: Run E2E tests
        run: pnpm test:e2e
        env:
          PLAYWRIGHT_BASE_URL: http://localhost:3000
          SKIP_STRIPE: true

      - name: Upload artifacts
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 7

      - name: Upload traces
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-traces
          path: e2e/test-results/
          retention-days: 7
```

- [ ] **D.2** Ajouter scripts package.json (0,1j)
  - Fichier: `package.json`

```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug",
    "test:e2e:report": "playwright show-report"
  }
}
```

- [ ] **D.3** Documenter (0,15j)
  - Fichier: `e2e/README.md`

```markdown
# Tests E2E

## Commandes

```bash
# Run all tests
pnpm test:e2e

# Run with UI
pnpm test:e2e:ui

# Run specific file
pnpm test:e2e e2e/tests/wizard-complete.spec.ts

# Debug mode
pnpm test:e2e:debug
```

## Structure

- `fixtures/` - Donnees de test
- `pages/` - Page Object Models
- `tests/` - Fichiers de test

## CI/CD

Les tests s'executent sur chaque PR et push main.
Artefacts disponibles dans Actions si echec.
```

### Livrables

- Workflow GitHub Actions
- Scripts npm
- Documentation

---

## Calendrier suggere

| Jour | Phases | Description |
|------|--------|-------------|
| J1 | A + B | Config Playwright + Page Objects |
| J2 | C.1-C.3 | Tests simulation, wizard, Stripe |
| J3 | C.4 + D | Test PDF + CI/CD |

---

## Definition of Done

- [ ] Playwright configure multi-navigateurs
- [ ] 4 parcours critiques testes
- [ ] Page Objects documentes
- [ ] CI/CD GitHub Actions
- [ ] 0 test flaky sur 3 runs
- [ ] Artefacts uploades

---

**References:**
- Requirements: `docs/features/tests-e2e/requirements.md`
- Playwright: https://playwright.dev
