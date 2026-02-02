# Production Deploy - Plan d'implementation

**Feature:** Deploiement Production + Monitoring
**Estimation totale:** 3 jours
**Date:** 02 fevrier 2026
**Sprint:** 6 (S11-S12)

---

## Vue d'ensemble des phases

| Phase | Description | Effort | Dependances | Statut |
|-------|-------------|--------|-------------|--------|
| A | Configuration Vercel | 0,5j | - | A faire |
| B | DNS et SSL | 0,5j | Phase A | A faire |
| C | Monitoring Sentry | 0,5j | Phase B | A faire |
| D | Analytics | 0,25j | Phase B | A faire |
| E | Headers securite | 0,25j | Phase A | A faire |
| F | Audit performance | 0,5j | Toutes | A faire |
| G | Go live checklist | 0,5j | Toutes | A faire |

---

## Phase A - Configuration Vercel (0,5j)

**Objectif:** Configurer projet Vercel pour production.

### Taches

- [ ] **A.1** Configurer domaine Vercel (0,15j)
  - Dashboard Vercel → Project → Domains
  - Ajouter `simuler-loi-fiscale-jeanbrun.fr`
  - Ajouter `www.simuler-loi-fiscale-jeanbrun.fr`

- [ ] **A.2** Configurer variables d'environnement (0,2j)
  - Dashboard Vercel → Project → Settings → Environment Variables
  - Ajouter toutes les variables production
  - Scope: Production only

```
NEXT_PUBLIC_APP_URL=https://simuler-loi-fiscale-jeanbrun.fr
POSTGRES_URL=postgresql://...
BETTER_AUTH_SECRET=xxx
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_SENTRY_DSN=https://...
```

- [ ] **A.3** Configurer vercel.json (0,15j)
  - Fichier: `vercel.json`

```json
{
  "buildCommand": "pnpm build",
  "installCommand": "pnpm install",
  "framework": "nextjs",
  "regions": ["cdg1"],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=31536000; includeSubDomains"
        }
      ]
    }
  ],
  "redirects": [
    {
      "source": "/simulateur",
      "destination": "/simulateur/avance",
      "permanent": false
    }
  ]
}
```

### Livrables

- Projet Vercel configure
- Variables production definies
- Headers securite de base

---

## Phase B - DNS et SSL (0,5j)

**Objectif:** Configurer DNS et certificat SSL.

### Taches

- [ ] **B.1** Commander/transferer domaine (si necessaire) (0,1j)
  - OVH, Gandi, ou autre registrar
  - `simuler-loi-fiscale-jeanbrun.fr`

- [ ] **B.2** Configurer DNS (0,2j)
  - Registrar → Zone DNS

```
# Enregistrements DNS
A     @     76.76.21.21
CNAME www   cname.vercel-dns.com
```

  - Attendre propagation (jusqu'a 24h)
  - Verifier: `dig simuler-loi-fiscale-jeanbrun.fr`

- [ ] **B.3** Verifier SSL (0,1j)
  - Vercel genere certificat automatiquement
  - Verifier: https://simuler-loi-fiscale-jeanbrun.fr
  - Tester: https://www.ssllabs.com/ssltest/

- [ ] **B.4** Configurer redirections domaines secondaires (0,1j)
  - Si autres domaines achetes, ajouter dans Vercel
  - Redirect 301 vers domaine principal

### Livrables

- DNS configure et propage
- SSL actif (Let's Encrypt)
- Redirections www et domaines secondaires

---

## Phase C - Monitoring Sentry (0,5j)

**Objectif:** Integrer Sentry pour monitoring erreurs.

### Taches

- [ ] **C.1** Creer projet Sentry (0,1j)
  - https://sentry.io → Create Project
  - Platform: Next.js
  - Recuperer DSN

- [ ] **C.2** Installer Sentry SDK (0,15j)
  ```bash
  pnpm add @sentry/nextjs
  pnpm exec sentry-wizard -i nextjs
  ```

- [ ] **C.3** Configurer sentry.client.config.ts (0,1j)
  - Fichier: `sentry.client.config.ts`

```typescript
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  integrations: [
    Sentry.replayIntegration(),
  ],
})
```

- [ ] **C.4** Configurer sentry.server.config.ts (0,1j)
  - Fichier: `sentry.server.config.ts`

```typescript
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
})
```

- [ ] **C.5** Configurer source maps upload (0,05j)
  - Fichier: `next.config.ts` (modifier)

```typescript
import { withSentryConfig } from '@sentry/nextjs'

export default withSentryConfig(nextConfig, {
  org: 'expert-ia-entreprise',
  project: 'simulateur-jeanbrun',
  silent: true,
  widenClientFileUpload: true,
  hideSourceMaps: true,
})
```

### Livrables

- Sentry SDK integre
- Source maps uploades
- Performance tracing actif

---

## Phase D - Analytics (0,25j)

**Objectif:** Integrer tracking analytics.

### Taches

- [ ] **D.1** Configurer Plausible (option recommandee) (0,15j)
  - https://plausible.io → Add new site
  - Fichier: `src/app/layout.tsx`

```typescript
// Dans <head>
<script
  defer
  data-domain="simuler-loi-fiscale-jeanbrun.fr"
  src="https://plausible.io/js/script.js"
/>
```

- [ ] **D.2** OU Configurer GA4 + Consent (0,15j)
  - Fichier: `src/components/Analytics.tsx`

```typescript
'use client'

import { useEffect } from 'react'
import Script from 'next/script'

export function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID

  if (!gaId) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `}
      </Script>
    </>
  )
}
```

- [ ] **D.3** Configurer events custom (0,1j)
  - Fichier: `src/lib/analytics.ts`

```typescript
export function trackEvent(name: string, props?: Record<string, unknown>) {
  // Plausible
  if (typeof window !== 'undefined' && window.plausible) {
    window.plausible(name, { props })
  }

  // GA4
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', name, props)
  }
}

// Events a tracker
export const EVENTS = {
  SIMULATION_START: 'simulation_start',
  SIMULATION_COMPLETE: 'simulation_complete',
  CHECKOUT_START: 'checkout_start',
  CHECKOUT_COMPLETE: 'checkout_complete',
  PDF_DOWNLOAD: 'pdf_download',
}
```

### Livrables

- Analytics integre
- Events custom configures
- Dashboard accessible

---

## Phase E - Headers securite (0,25j)

**Objectif:** Renforcer securite avec headers HTTP.

### Taches

- [ ] **E.1** Configurer CSP (0,15j)
  - Fichier: `next.config.ts`

```typescript
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval' js.stripe.com plausible.io;
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: blob: https:;
      font-src 'self';
      connect-src 'self' api.stripe.com *.sentry.io plausible.io;
      frame-src js.stripe.com;
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'none';
    `.replace(/\n/g, ' ').trim(),
  },
]

const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
}
```

- [ ] **E.2** Tester headers (0,1j)
  - https://securityheaders.com/?q=simuler-loi-fiscale-jeanbrun.fr
  - Cible: Note A+

### Livrables

- CSP configuree
- Headers securite actifs
- Note A+ SecurityHeaders

---

## Phase F - Audit performance (0,5j)

**Objectif:** Verifier et optimiser performance.

### Taches

- [ ] **F.1** Audit PageSpeed (0,2j)
  - https://pagespeed.web.dev
  - Pages a tester:
    - / (homepage)
    - /villes/lyon
    - /simulateur/avance
    - /simulateur/resultat/xxx

- [ ] **F.2** Corriger issues identifies (0,2j)
  - Images non optimisees → next/image
  - CSS non utilise → purge
  - JavaScript bloquant → dynamic import
  - Fonts → next/font

- [ ] **F.3** Verifier Core Web Vitals (0,1j)
  - Chrome DevTools → Lighthouse
  - Vercel Analytics → Web Vitals
  - Cibles: LCP < 2.5s, CLS < 0.1, INP < 200ms

### Livrables

- PageSpeed >= 90 mobile
- PageSpeed >= 95 desktop
- Core Web Vitals vert

---

## Phase G - Go live checklist (0,5j)

**Objectif:** Verification finale et mise en production.

### Taches

- [ ] **G.1** Checklist technique (0,2j)

**Build:**
- [ ] `pnpm build` OK
- [ ] `pnpm lint` OK
- [ ] `pnpm typecheck` OK

**Tests:**
- [ ] Tests unitaires passes
- [ ] Tests E2E passes
- [ ] Test manuel simulation complete
- [ ] Test manuel paiement Stripe LIVE

**Securite:**
- [ ] Variables env production correctes
- [ ] Stripe mode LIVE active
- [ ] Webhook Stripe configure (URL production)
- [ ] Pas de secrets dans code

- [ ] **G.2** Checklist SEO (0,15j)

- [ ] robots.txt accessible
- [ ] sitemap.xml genere
- [ ] Metadata toutes pages
- [ ] Open Graph images
- [ ] Google Search Console configure

- [ ] **G.3** Checklist monitoring (0,1j)

- [ ] Sentry recoit events
- [ ] Analytics tracke pages
- [ ] Alertes email configurees

- [ ] **G.4** Deploy production (0,05j)

```bash
# Merge to main triggers deploy
git checkout main
git merge develop
git push origin main

# Verify
curl -I https://simuler-loi-fiscale-jeanbrun.fr
```

### Livrables

- Site live en production
- Monitoring actif
- Documentation mise a jour

---

## Calendrier suggere

| Jour | Phases | Description |
|------|--------|-------------|
| J1 | A + B | Config Vercel + DNS |
| J2 | C + D + E | Sentry + Analytics + Headers |
| J3 | F + G | Audit perf + Go live |

---

## Risques identifies

| Risque | Impact | Mitigation |
|--------|--------|------------|
| DNS propagation lente | Retard 24-48h | Commencer tot |
| Secrets exposes | Securite | Review pre-deploy |
| Performance degradee | UX | Audit PageSpeed |
| Stripe webhook echoue | Paiements perdus | Test avant go live |

---

## Definition of Done

- [ ] Site accessible sur domaine production
- [ ] HTTPS actif, certificat valide
- [ ] Sentry capture erreurs
- [ ] Analytics fonctionnel
- [ ] PageSpeed >= 90 mobile
- [ ] Headers securite A+
- [ ] Tests E2E passes
- [ ] Stripe LIVE teste

---

## Post-deploy

### J+1

- [ ] Verifier logs Sentry (pas d'erreurs critiques)
- [ ] Verifier analytics (trafic normal)
- [ ] Verifier Stripe (paiements fonctionnels)

### J+7

- [ ] Review Core Web Vitals (donnees terrain)
- [ ] Ajuster sampling Sentry si necessaire
- [ ] Analyser comportement utilisateurs

---

**References:**
- Requirements: `docs/features/production-deploy/requirements.md`
- Vercel: https://vercel.com/docs/deployments
- Sentry: https://docs.sentry.io/platforms/javascript/guides/nextjs/
