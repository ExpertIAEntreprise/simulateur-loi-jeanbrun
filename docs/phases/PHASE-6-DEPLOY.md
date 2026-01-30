# Phase 6 - Deploy & Tests

**Sprint:** 6
**Semaines:** S11-S12 (14-25 Avril 2026)
**Effort estimé:** 13 jours
**Objectif:** Site live en production avec monitoring

---

## 1. Livrables

| Livrable | Critère validation |
|----------|-------------------|
| Tests E2E | Parcours critiques passent |
| Tests charge | k6 rapport OK |
| Audit a11y | axe-core sans erreur critique |
| Audit sécurité | OWASP vérifié |
| SSL | HTTPS actif |
| DNS | Domaine configuré |
| Monitoring | Sentry + analytics actifs |
| Go live | Site public |

---

## 2. Tests E2E critiques

```typescript
// tests/e2e/simulation-complete.spec.ts
import { test, expect } from '@playwright/test'

test('simulation rapide Lyon', async ({ page }) => {
  await page.goto('/villes/lyon')
  await page.fill('[name="budget"]', '200000')
  await page.selectOption('[name="revenus"]', '50000-80000')
  await page.click('button:text("Calculer")')
  await expect(page.locator('.economie-annuelle')).toBeVisible()
})

test('simulation avancée 6 étapes', async ({ page }) => {
  await page.goto('/simulateur/avance')
  // Étape 1-6...
  await expect(page.locator('.resultats')).toBeVisible()
})

test('paiement Stripe', async ({ page }) => {
  // Mode test Stripe
  await page.goto('/simulateur/resultat/xxx')
  await page.click('button:text("Acheter")')
  await page.fill('[name="cardNumber"]', '4242424242424242')
  // ...
})
```

---

## 3. Configuration production

### 3.1 SSL Let's Encrypt

```bash
certbot --nginx -d simuler-loi-fiscale-jeanbrun.fr \
  -d www.simuler-loi-fiscale-jeanbrun.fr
```

### 3.2 DNS

```
A    simuler-loi-fiscale-jeanbrun.fr    147.93.53.108
CNAME www                               simuler-loi-fiscale-jeanbrun.fr
```

### 3.3 Redirections 301

```nginx
# Domaines secondaires → principal
server {
    server_name simulateur-loi-fiscale-jeanbrun.fr
                simulation-loi-fiscale-jeanbrun.fr
                simulations-loi-jeanbrun.fr;
    return 301 https://simuler-loi-fiscale-jeanbrun.fr$request_uri;
}
```

---

## 4. Monitoring

### 4.1 Sentry

```typescript
// sentry.client.config.ts
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  environment: process.env.NODE_ENV,
})
```

### 4.2 Analytics

```typescript
// src/components/Analytics.tsx
// GA4 + Plausible (RGPD-friendly)
```

---

## 5. Checklist pré-production

- [ ] Tests E2E Chrome/Firefox/Safari OK
- [ ] PageSpeed mobile >= 90
- [ ] PageSpeed desktop >= 95
- [ ] axe-core sans erreur critique
- [ ] Headers sécurité (CSP, HSTS)
- [ ] SSL valide
- [ ] Redirections 301 OK
- [ ] Sentry actif
- [ ] Analytics actif
- [ ] Stripe mode live

---

## 6. Commandes déploiement

```bash
# Build local (test)
cd /root/simulateur_loi_Jeanbrun
pnpm build

# Deploy (Vercel - automatique via git push)
git push origin main

# Vérification
curl -I https://simulateur-loi-jeanbrun.vercel.app
```

---

**Date:** 30 janvier 2026
