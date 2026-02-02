# Production Deploy - Requirements

**Feature:** Deploiement Production + Monitoring
**Version:** 1.0
**Date:** 02 fevrier 2026
**Sprint:** 6 (S11-S12)

---

## 1. Description

La feature Production Deploy couvre la mise en production du simulateur sur Vercel avec configuration DNS, SSL, monitoring Sentry, et analytics. L'objectif est d'avoir un site performant, securise et observable.

### Objectifs

- Site accessible sur domaine personnalise
- HTTPS actif avec certificat valide
- Monitoring erreurs temps reel (Sentry)
- Analytics utilisateurs (Plausible/GA4)
- Performance PageSpeed >= 90

---

## 2. Exigences fonctionnelles

### 2.1 Domaine et DNS

**Domaine principal:** `simuler-loi-fiscale-jeanbrun.fr`

| Type | Nom | Valeur | TTL |
|------|-----|--------|-----|
| A | @ | 76.76.21.21 (Vercel) | 300 |
| CNAME | www | cname.vercel-dns.com | 300 |

**Domaines secondaires (redirect 301):**
- simulateur-loi-fiscale-jeanbrun.fr
- simulation-loi-fiscale-jeanbrun.fr
- simulations-loi-jeanbrun.fr

**Criteres d'acceptation:**
- [ ] DNS propage en < 24h
- [ ] www redirige vers apex
- [ ] Domaines secondaires redirigent vers principal
- [ ] TTL optimal (300s prod, 60s debug)

### 2.2 SSL/HTTPS

**Certificat:** Automatique via Vercel (Let's Encrypt)

**Criteres d'acceptation:**
- [ ] HTTPS actif sur domaine principal
- [ ] HTTP redirige vers HTTPS (301)
- [ ] Certificat valide (SSL Labs A+)
- [ ] HSTS active (max-age=31536000)

### 2.3 Monitoring Sentry

**Configuration:**
- Organisation: expert-ia-entreprise
- Projet: simulateur-jeanbrun
- Environment: production, preview, development

**Events a capturer:**
- Erreurs JavaScript client
- Erreurs API server
- Erreurs Stripe webhook
- Performance transactions

**Criteres d'acceptation:**
- [ ] Sentry SDK integre (client + server)
- [ ] Source maps uploades
- [ ] Alertes email configurees
- [ ] Release tracking actif
- [ ] Performance tracing (10% sampling)

### 2.4 Analytics

**Option 1: Plausible (RGPD-friendly)**
- Pas de cookies
- Donnees en EU
- Dashboard simple

**Option 2: GA4**
- Integration Vercel Analytics
- Consentement cookie requis

**Metriques a tracker:**
- Pages vues
- Conversion simulation demarree
- Conversion simulation completee
- Conversion paiement
- Bounce rate pages SEO

**Criteres d'acceptation:**
- [ ] Script analytics integre
- [ ] Banniere consentement si cookies (GA4)
- [ ] Events custom configures
- [ ] Dashboard accessible

### 2.5 Headers securite

| Header | Valeur |
|--------|--------|
| Strict-Transport-Security | max-age=31536000; includeSubDomains |
| X-Content-Type-Options | nosniff |
| X-Frame-Options | DENY |
| X-XSS-Protection | 1; mode=block |
| Referrer-Policy | strict-origin-when-cross-origin |
| Content-Security-Policy | (voir ci-dessous) |

**CSP recommandee:**
```
default-src 'self';
script-src 'self' 'unsafe-inline' 'unsafe-eval' js.stripe.com;
style-src 'self' 'unsafe-inline';
img-src 'self' data: blob:;
font-src 'self';
connect-src 'self' api.stripe.com *.sentry.io plausible.io;
frame-src js.stripe.com;
```

**Criteres d'acceptation:**
- [ ] Headers securite dans vercel.json
- [ ] CSP bloque scripts externes non autorises
- [ ] SecurityHeaders.com note A+

### 2.6 Performance

**Cibles PageSpeed:**
| Metrique | Mobile | Desktop |
|----------|--------|---------|
| Performance | >= 90 | >= 95 |
| Accessibility | >= 95 | >= 95 |
| Best Practices | >= 90 | >= 95 |
| SEO | >= 95 | >= 95 |

**Cibles Core Web Vitals:**
| Metrique | Cible |
|----------|-------|
| LCP | < 2.5s |
| FID | < 100ms |
| CLS | < 0.1 |
| INP | < 200ms |

**Criteres d'acceptation:**
- [ ] PageSpeed >= 90 mobile
- [ ] PageSpeed >= 95 desktop
- [ ] LCP < 2.5s
- [ ] CLS < 0.1

---

## 3. Exigences non-fonctionnelles

### 3.1 Disponibilite

- Uptime cible: 99.9%
- Monitoring: Vercel status + Sentry
- Alertes: Email + Slack (optionnel)

### 3.2 Scalabilite

- Vercel auto-scale
- Pas de limite previsible Sprint 6
- Edge functions pour API routes critiques

### 3.3 Backup

- Base Neon: backup automatique 7 jours
- Code: GitHub (source of truth)
- Workflows n8n: backup VPS quotidien

### 3.4 Rollback

- Vercel: rollback 1-click
- Neon: point-in-time recovery
- Feature flags: desactivation rapide

---

## 4. Variables d'environnement production

```env
# App
NEXT_PUBLIC_APP_URL=https://simuler-loi-fiscale-jeanbrun.fr
NODE_ENV=production

# Database
POSTGRES_URL=postgresql://...@ep-xxx.eu-west-1.aws.neon.tech/...?sslmode=require

# Auth
BETTER_AUTH_SECRET=xxx
BETTER_AUTH_URL=https://simuler-loi-fiscale-jeanbrun.fr

# Stripe (LIVE)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Monitoring
NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
SENTRY_AUTH_TOKEN=xxx

# Analytics
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=simuler-loi-fiscale-jeanbrun.fr
# OU
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Email
MAILJET_API_KEY=xxx
MAILJET_SECRET_KEY=xxx
EMAIL_FROM=noreply@simuler-loi-fiscale-jeanbrun.fr
```

---

## 5. Checklist pre-production

### Build
- [ ] `pnpm build` sans erreur
- [ ] `pnpm lint` sans erreur
- [ ] `pnpm typecheck` sans erreur
- [ ] Bundle size acceptable (< 500KB First Load JS)

### Tests
- [ ] Tests unitaires passes
- [ ] Tests E2E passes
- [ ] Tests manuels parcours critiques

### Securite
- [ ] Variables env production definies
- [ ] Stripe mode LIVE configure
- [ ] Secrets non exposes
- [ ] Headers securite actifs

### SEO
- [ ] robots.txt correct
- [ ] sitemap.xml genere
- [ ] Metadata toutes pages
- [ ] Open Graph images

### Performance
- [ ] Images optimisees (next/image)
- [ ] Fonts optimisees (next/font)
- [ ] Code splitting actif
- [ ] Cache headers corrects

---

## 6. Criteres d'acceptation globaux

### Infrastructure
- [ ] Site accessible sur domaine personnalise
- [ ] HTTPS actif, certificat valide
- [ ] DNS configure correctement
- [ ] Redirections 301 fonctionnelles

### Monitoring
- [ ] Sentry capture erreurs
- [ ] Analytics tracke events
- [ ] Alertes configurees

### Performance
- [ ] PageSpeed >= 90 mobile
- [ ] Core Web Vitals dans le vert
- [ ] TTFб < 1s

### Securite
- [ ] Headers securite A+
- [ ] CSP active
- [ ] Pas de secrets exposes

---

## 7. Hors scope

- CDN supplementaire (Vercel Edge suffit)
- Load balancing custom
- Multi-region deployment
- WAF avance (futur)

---

**References:**
- Phase spec: `docs/phases/PHASE-6-DEPLOY.md`
- Vercel docs: https://vercel.com/docs
- Sentry Next.js: https://docs.sentry.io/platforms/javascript/guides/nextjs/
