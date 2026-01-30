# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Simulateur Loi Jeanbrun - A fiscal simulation platform for the "Loi Jeanbrun" (PLF 2026) French tax law. Users can simulate tax benefits for real estate investments with a freemium model (free basic simulation, paid advanced features).

**Live:** https://simulateur-loi-jeanbrun.vercel.app
**Repo:** https://github.com/ExpertIAEntreprise/simulateur-loi-jeanbrun

## Commands

```bash
# Development
pnpm dev              # Start dev server with Turbopack (localhost:3000)
pnpm build:ci         # Build for CI (no migrations)
pnpm check            # Run lint + typecheck together

# Database (Drizzle + Neon PostgreSQL)
pnpm db:push          # Push schema to database (dev)
pnpm db:migrate       # Run migrations (production)
pnpm db:studio        # Open Drizzle Studio GUI
pnpm db:generate      # Generate migration files
pnpm db:reset         # Drop all tables and recreate

# Quality
pnpm lint             # ESLint
pnpm typecheck        # TypeScript check
pnpm format           # Prettier format all files
```

## Architecture

### Stack
- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **Database:** Neon PostgreSQL (serverless) + Drizzle ORM
- **Auth:** Better Auth (email/password, email verification)
- **Payments:** Stripe Checkout
- **AI Chat:** Vercel AI SDK + OpenRouter
- **Hosting:** Vercel

### Key Directories

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Auth pages (login, register, forgot-password)
│   ├── api/               # API routes
│   │   ├── auth/[...all]/ # Better Auth catch-all handler
│   │   └── chat/          # AI chat endpoint
│   ├── chat/              # AI chat page
│   └── dashboard/         # User dashboard
├── components/
│   ├── auth/              # Auth components (use Better Auth hooks)
│   └── ui/                # shadcn/ui components
└── lib/
    ├── auth.ts            # Better Auth server config
    ├── auth-client.ts     # Better Auth client hooks
    ├── db.ts              # Drizzle database connection
    ├── schema.ts          # Drizzle schema (user, session, account, verification)
    └── storage.ts         # File storage abstraction (local/Vercel Blob)
```

### Authentication Pattern (Better Auth)

**Server-side:** Import from `@/lib/auth`
```typescript
import { auth } from "@/lib/auth"
```

**Client-side:** Import from `@/lib/auth-client`
```typescript
import { useSession, signIn, signOut } from "@/lib/auth-client"
```

### Database Schema

Better Auth tables use `text` IDs (not UUID). The schema in `src/lib/schema.ts` defines:
- `user` - User accounts
- `session` - Active sessions
- `account` - OAuth/password accounts
- `verification` - Email verification tokens

## Environment Variables

Required in `.env.local`:
```
POSTGRES_URL=postgresql://...           # Neon connection string
BETTER_AUTH_SECRET=...                  # 32+ char secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Optional:
```
OPENROUTER_API_KEY=...                  # For AI chat
OPENROUTER_MODEL=openai/gpt-5-mini
BLOB_READ_WRITE_TOKEN=...               # Vercel Blob (empty = local storage)
```

## Claude Code Commands

Available slash commands in `.claude/commands/`:
- `/create-spec` - Create feature specification
- `/publish-to-github` - Publish feature to GitHub Issues/Projects
- `/continue-feature` - Implement next task for a feature
- `/checkpoint` - Create checkpoint commit

## Agents Spécialisés (PRIORITAIRE)

**Toujours utiliser les agents spécialisés** via le Task tool pour les audits et le développement :

| Agent | Usage |
|-------|-------|
| `code-reviewer` | **Obligatoire** après écriture/modification de code |
| `security-reviewer` | Avant commits touchant auth, API, données sensibles |
| `better-auth-expert` | Toute modification liée à l'authentification |
| `drizzle-neon-expert` | Schéma DB, migrations, requêtes Drizzle |
| `stripe-payments-expert` | Intégration Stripe, checkout, webhooks |
| `tdd-guide` | Nouvelles features (écrire tests d'abord) |
| `ui-expert` | Composants UI, Tailwind, shadcn |
| `build-error-resolver` | Quand le build échoue |

**Workflow recommandé :**
1. Feature complexe → `planner` agent d'abord
2. Écriture code → `tdd-guide` (tests first)
3. Code terminé → `code-reviewer` (obligatoire)
4. Avant commit → `security-reviewer` si données sensibles

## Project-Specific Context

This project is a fiscal simulator that will include:
- **Sprint 2:** Tax calculation engine (IR, Jeanbrun amortization, LMNP comparison)
- **Sprint 3:** 6-step simulation wizard
- **Sprint 4:** SEO pages for 50 French cities
- **Sprint 5:** Stripe payments, PDF export, Calendly integration
- **Sprint 6:** E2E tests, production deployment

**EspoCRM Integration:** Leads sync to EspoCRM using separate entities (`cLeadJeanbrun`, `cSimulationJeanbrun`) to avoid mixing with other projects.

**Documentation:** See `docs/planning/PLAN-IMPLEMENTATION.md` for detailed sprint plans and `docs/specs/REQUIREMENTS.md` for functional requirements.
