# Feature: Infrastructure (Sprint 1 - Complétion)

## Description

Compléter l'infrastructure de base du simulateur : schéma DB complet avec Drizzle/Neon, client API EspoCRM pour sync des leads, et pages légales RGPD.

**Stack confirmée:** Next.js 16 + Vercel + Neon PostgreSQL + Drizzle ORM (PAS de Docker, Redis ou nginx)

## État actuel (30 janvier 2026)

| Composant | État |
|-----------|------|
| Next.js 16 + TypeScript | ✅ Terminé |
| Tailwind v4 + shadcn/ui | ✅ Terminé |
| Better Auth | ✅ Terminé |
| Vercel déployé | ✅ Terminé |
| Neon connecté | ✅ Terminé |
| Tables Better Auth | ✅ Terminé |
| Tables métier (villes, programmes, simulations, leads, quotas) | ✅ Terminé |
| Client EspoCRM | ✅ Terminé |
| Pages légales | ✅ Terminé |

## Exigences fonctionnelles

### Schéma base de données

- [x] FR-1: Tables Better Auth (user, session, account, verification)
- [x] FR-2: Table `villes` avec données marché (prix, loyers, zone fiscale)
- [x] FR-3: Table `programmes` avec relation vers villes
- [x] FR-4: Table `simulations` avec inputData et resultats (JSONB)
- [x] FR-5: Table `leads` avec données découverte patrimoniale et consentements RGPD
- [x] FR-6: Table `quotas` pour gestion des packs payants

### Client API EspoCRM

- [x] FR-7: Wrapper API EspoCRM avec authentification X-Api-Key ✓
- [x] FR-8: Méthodes CRUD pour CJeanbrunVille ✓
- [x] FR-9: Méthodes CRUD pour CJeanbrunProgramme ✓
- [x] FR-10: Sync leads vers EspoCRM après soumission formulaire découverte ✓

### Pages légales

- [x] FR-11: Page Mentions légales `/mentions-legales` ✓
- [x] FR-12: Page CGV `/cgv` ✓
- [x] FR-13: Page Politique de confidentialité `/politique-confidentialite` ✓
- [x] FR-14: Registre RGPD (doc interne) `docs/legal/REGISTRE-RGPD.md` ✓

## Exigences non-fonctionnelles

- [x] NFR-1: Schéma Drizzle avec types TypeScript stricts ✓
- [ ] NFR-2: Migrations versionnées dans `/drizzle/` (CRITICAL - tables métier manquantes)
- [x] NFR-3: Client EspoCRM avec gestion d'erreurs et retry (3 tentatives, exponential backoff) ✓
- [x] NFR-4: Variables d'environnement validées avec Zod (`src/lib/env.ts`) ✓

### Nouvelles exigences (Post-Revue 30/01/2026)

**Sécurité (CRITICAL/HIGH):**
- [ ] NFR-5: Pas de secrets/URLs sensibles dans les logs
- [ ] NFR-6: BETTER_AUTH_SECRET >= 32 caractères aléatoires
- [ ] NFR-7: Rate limiting sur toutes les API publiques
- [ ] NFR-8: Headers CSP et HSTS configurés
- [ ] NFR-9: Endpoints de test protégés ou désactivés en prod

**Type Safety (CRITICAL):**
- [ ] NFR-10: Types Drizzle inférés (InferSelectModel) comme source unique
- [ ] NFR-11: Pas de `z.any()` dans les schémas Zod

**Performance (HIGH):**
- [ ] NFR-12: Driver `@neondatabase/serverless` pour scale-to-zero
- [ ] NFR-13: Index composites sur requêtes fréquentes

**Best Practices Next.js 16 (HIGH):**
- [ ] NFR-14: AuthProvider global avec onSessionChange
- [ ] NFR-15: Pages protégées en Server Components avec requireAuth()
- [ ] NFR-16: Proxy matcher avec wildcard pour sous-routes

**Better Auth (MEDIUM):**
- [ ] NFR-17: autoSignInAfterVerification activé
- [ ] NFR-18: Configuration session explicite (expiresIn, updateAge)
- [ ] NFR-19: Intégration email réelle (Mailjet)

## Critères d'acceptation

- [ ] AC-1: `pnpm db:push` applique le schéma sans erreur
- [ ] AC-2: `pnpm db:studio` affiche 9 tables (4 auth + 5 métier)
- [ ] AC-3: API EspoCRM répond en < 500ms (cache local)
- [ ] AC-4: Pages légales accessibles et indexables
- [ ] AC-5: `pnpm check` (lint + typecheck) passe

### Nouveaux critères (Post-Revue)

- [ ] AC-6: Aucun console.log avec URL ou secret dans le code
- [ ] AC-7: Rate limit retourne 429 après dépassement
- [ ] AC-8: `/api/diagnostics` retourne 404 en production
- [ ] AC-9: Login → navigation protégée fonctionne sans refresh manuel
- [ ] AC-10: Accès route protégée sans auth redirige immédiatement

## Dépendances

- Entités EspoCRM déjà créées: CJeanbrunVille (51), CJeanbrunProgramme (0)
- API Key: `ESPOCRM_API_KEY` configurée dans Vercel

## Hors scope

- Import des 266 communes (Sprint 4 avec données DVF)
- Scraping programmes (Moltbot)
- Cache Redis (non nécessaire avec Vercel Edge Cache)
