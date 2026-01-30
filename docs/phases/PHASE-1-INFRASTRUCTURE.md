# Phase 1 - Infrastructure

**Sprint:** 1
**Semaines:** S1-S2 (03-14 Février 2026)
**Objectif:** Environnement de développement fonctionnel avec stack Vercel/Neon

---

## Stack technique (confirmée)

| Composant | Technologie | Statut |
|-----------|-------------|--------|
| Framework | Next.js 16 (App Router) | ✅ Déployé |
| Langage | TypeScript (strict) | ✅ Configuré |
| Styling | Tailwind CSS v4 + shadcn/ui | ✅ Configuré |
| Base de données | Neon PostgreSQL + Drizzle ORM | ✅ Connecté |
| Auth | Better Auth (email/password) | ✅ Fonctionnel |
| Hébergement | Vercel | ✅ Déployé |
| CI/CD | GitHub Actions | ✅ Configuré |
| CRM Sync | EspoCRM API | 🟡 Moltbot scraping en cours |

> **Note:** Cette stack n'utilise PAS Docker, Redis ou nginx. L'application tourne entièrement sur Vercel avec Neon serverless.

---

## Livrables

### Terminés ✅

| Livrable | Description | Validation |
|----------|-------------|------------|
| Projet Next.js | Application Next.js 16 initialisée | `pnpm dev` fonctionne |
| TypeScript strict | Mode strict activé | `pnpm typecheck` passe |
| Design System | Tailwind v4 + 16 composants shadcn/ui | Composants disponibles |
| Better Auth | Email/password + email verification | Login/register fonctionnels |
| Vercel | Déploiement production | https://simulateur-loi-jeanbrun.vercel.app |
| Neon | Base de données PostgreSQL | Connexion OK |
| CI/CD | GitHub Actions | Build automatique sur push |

### À compléter ⬜

| Livrable | Description | Feature |
|----------|-------------|---------|
| Schéma DB complet | Tables villes, programmes, simulations, leads, quotas | `features/infrastructure/` |
| Client EspoCRM | Wrapper API pour sync leads | `features/infrastructure/` |
| Pages légales | Mentions, CGV, Confidentialité | `features/infrastructure/` |
| REGISTRE-RGPD.md | Conformité CNIL | `features/infrastructure/` |

---

## Architecture actuelle

```
┌─────────────────────────────────────────────────────────────┐
│                         VERCEL                              │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Next.js 16 (App Router)                 │   │
│  │                                                      │   │
│  │  ├── /app              (Routes)                     │   │
│  │  ├── /components       (UI)                         │   │
│  │  ├── /lib              (Business logic)             │   │
│  │  └── /api              (API Routes)                 │   │
│  └─────────────────────────────────────────────────────┘   │
│                            │                                │
│                            ▼                                │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Better Auth (Sessions)                  │   │
│  └─────────────────────────────────────────────────────┘   │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                     NEON POSTGRESQL                         │
│                                                             │
│  Tables:                                                    │
│  ├── user, session, account, verification (Better Auth)    │
│  ├── villes, programmes (données marché)                   │
│  ├── simulations (calculs utilisateur)                     │
│  ├── leads (découverte patrimoniale)                       │
│  └── quotas (packs payants)                                │
└─────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                     ESPOCRM (VPS)                           │
│                                                             │
│  Entités Jeanbrun:                                          │
│  ├── CJeanbrunVille (51 villes)                            │
│  ├── CJeanbrunProgramme (0 → scraping Moltbot)             │
│  └── CJeanbrunLead (sync après découverte)                 │
└─────────────────────────────────────────────────────────────┘
```

---

## Variables d'environnement

### Configurées dans Vercel ✅

```bash
POSTGRES_URL=postgresql://...@ep-xxx.neon.tech/neondb?sslmode=require
BETTER_AUTH_SECRET=xxx
BETTER_AUTH_URL=https://simulateur-loi-jeanbrun.vercel.app
NEXT_PUBLIC_APP_URL=https://simulateur-loi-jeanbrun.vercel.app
ESPOCRM_API_KEY=1a97a8b3ca73fd5f1cdfed6c4f5341ec
```

### À ajouter plus tard (Sprint 5)

```bash
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
```

---

## Schéma Drizzle (cible)

```typescript
// src/lib/schema.ts

// Enums
export const zoneFiscaleEnum = pgEnum('zone_fiscale', ['A', 'A_bis', 'B1', 'B2', 'C'])
export const tensionLocativeEnum = pgEnum('tension_locative', ['faible', 'moyenne', 'forte', 'tres_forte'])
export const niveauLoyerEnum = pgEnum('niveau_loyer', ['intermediaire', 'social', 'tres_social'])
export const leadStatutEnum = pgEnum('lead_statut', ['nouveau', 'rdv_pris', 'accompagne', 'converti', 'perdu'])

// Tables métier
export const villes = pgTable('villes', { ... })
export const programmes = pgTable('programmes', { ... })
export const simulations = pgTable('simulations', { ... })
export const leads = pgTable('leads', { ... })
export const quotas = pgTable('quotas', { ... })
```

Voir `docs/planning/PLAN-IMPLEMENTATION.md` section 10 pour le schéma complet.

---

## Plan d'implémentation

Voir **`docs/features/infrastructure/plan.md`** pour les tâches détaillées.

| Phase | Effort | Tâches principales |
|-------|--------|-------------------|
| Phase 1 | 1,5j | Schéma Drizzle complet |
| Phase 2 | 0,5j | Types TypeScript |
| Phase 3 | 1j | Client API EspoCRM |
| Phase 4 | 1j | Pages légales + RGPD |

**Total restant:** 4 jours

---

## Commandes de développement

```bash
# Développement
pnpm dev              # Start dev server (localhost:3000)

# Build
pnpm build:ci         # Build for CI (no migrations)
pnpm check            # Run lint + typecheck together

# Database
pnpm db:push          # Push schema to Neon (dev)
pnpm db:migrate       # Run migrations (production)
pnpm db:studio        # Open Drizzle Studio GUI
pnpm db:generate      # Generate migration files

# Déploiement
git push origin main  # Auto-deploy Vercel
```

---

## Checklist de fin de sprint

### Technique

- [x] `pnpm dev` démarre sans erreur
- [x] `pnpm build:ci` produit un build de production
- [x] `pnpm check` passe
- [x] Déploiement Vercel fonctionnel
- [x] Connexion Neon PostgreSQL OK
- [ ] Schéma Drizzle complet avec 10 tables
- [ ] Client EspoCRM fonctionnel

### Fonctionnel

- [x] Better Auth (login, register, forgot, reset password)
- [ ] API `/api/espocrm/test` répond
- [ ] Pages légales accessibles

### Documentation

- [ ] REGISTRE-RGPD.md créé
- [ ] CHECKLIST.md mis à jour

---

## Ressources

| Ressource | URL |
|-----------|-----|
| Site preview | https://simulateur-loi-jeanbrun.vercel.app |
| GitHub | https://github.com/ExpertIAEntreprise/simulateur-loi-jeanbrun |
| Vercel Dashboard | https://vercel.com/agent-ias-projects/simulateur-loi-jeanbrun |
| Neon Dashboard | https://console.neon.tech |
| EspoCRM | https://espocrm.expert-ia-entreprise.fr |
| Feature plan | `docs/features/infrastructure/plan.md` |

---

*Dernière mise à jour: 30 janvier 2026*
