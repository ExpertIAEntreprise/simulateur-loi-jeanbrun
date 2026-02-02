# Phase 6 - Deploy & Tests

**Sprint:** 6
**Semaines:** S11-S12 (14-25 Avril 2026)
**Effort estime:** 6 jours
**Objectif:** Site live en production avec monitoring

---

## 1. Decisions techniques

### Infrastructure

| Decision | Choix | Justification |
|----------|-------|---------------|
| Hosting | Vercel | Integration Next.js native, Edge |
| Region | CDG1 (Paris) | Proximite utilisateurs FR |
| SSL | Let's Encrypt auto | Gratuit, auto-renouvele |
| Monitoring erreurs | Sentry | Standard industrie, source maps |
| Analytics | Plausible | RGPD-friendly, pas de cookies |

### Domaine

| Element | Valeur |
|---------|--------|
| Principal | simuler-loi-fiscale-jeanbrun.fr |
| Redirections | www, autres variantes → 301 |
| DNS | A record → Vercel |

### Tests E2E

| Framework | Playwright |
|-----------|------------|
| Navigateurs | Chrome, Firefox, Safari |
| Viewports | Mobile (375px), Desktop (1280px) |
| CI/CD | GitHub Actions |

---

## 2. Parcours E2E critiques

| Parcours | Priorite |
|----------|----------|
| Simulation rapide (page ville) | CRITIQUE |
| Wizard 6 etapes complet | CRITIQUE |
| Paiement Stripe | CRITIQUE |
| Export PDF | HAUTE |
| Navigation generale | MOYENNE |

---

## 3. Cibles performance

| Metrique | Mobile | Desktop |
|----------|--------|---------|
| PageSpeed | >= 90 | >= 95 |
| LCP | < 2.5s | < 2s |
| CLS | < 0.1 | < 0.1 |
| INP | < 200ms | < 150ms |

---

## 4. Headers securite

| Header | Valeur |
|--------|--------|
| HSTS | max-age=31536000 |
| X-Frame-Options | DENY |
| X-Content-Type-Options | nosniff |
| CSP | Restrictive (voir plan) |

Cible: Note A+ sur SecurityHeaders.com

---

## 5. Livrables

### Tests E2E
- [ ] Parcours critiques passes
- [ ] Multi-navigateurs OK
- [ ] CI/CD GitHub Actions

### Production
- [ ] SSL actif
- [ ] DNS configure
- [ ] Sentry actif
- [ ] Analytics actif
- [ ] PageSpeed >= 90

### Go live
- [ ] Site public accessible
- [ ] Stripe mode LIVE
- [ ] Monitoring fonctionnel

---

## 6. Feature details

Implementation detaillee dans:
- `docs/features/tests-e2e/requirements.md`
- `docs/features/tests-e2e/plan.md`
- `docs/features/production-deploy/requirements.md`
- `docs/features/production-deploy/plan.md`

---

**Date:** 02 fevrier 2026
