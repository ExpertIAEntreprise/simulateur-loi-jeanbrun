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
- **PDF:** @react-pdf/renderer
- **Hosting:** Vercel

### Key Directories

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Auth pages (login, register, forgot-password, reset-password)
│   ├── api/               # API routes
│   │   ├── auth/[...all]/ # Better Auth catch-all handler
│   │   ├── chat/          # AI chat endpoint
│   │   └── diagnostics/   # Health check endpoint
│   ├── chat/              # AI chat page
│   ├── dashboard/         # User dashboard
│   └── profile/           # User profile page
├── components/
│   ├── auth/              # Auth components (use Better Auth hooks)
│   └── ui/                # shadcn/ui components
├── hooks/                 # Custom React hooks
└── lib/
    ├── auth.ts            # Better Auth server config
    ├── auth-client.ts     # Better Auth client hooks (signIn, signOut, useSession...)
    ├── db.ts              # Drizzle database connection
    ├── schema.ts          # Drizzle schema (user, session, account, verification)
    ├── session.ts         # Session utilities
    ├── storage.ts         # File storage abstraction (local/Vercel Blob)
    └── env.ts             # Environment variable validation
```

### Authentication Pattern (Better Auth)

**Server-side:** Import from `@/lib/auth`
```typescript
import { auth } from "@/lib/auth"
```

**Client-side:** Import from `@/lib/auth-client`
```typescript
import { useSession, signIn, signOut, signUp, requestPasswordReset, resetPassword } from "@/lib/auth-client"
```

### Database Schema

Better Auth tables use `text` IDs (not UUID). The schema in `src/lib/schema.ts` defines:
- `user` - User accounts
- `session` - Active sessions
- `account` - OAuth/password accounts
- `verification` - Email verification tokens

**Important:** When adding new tables, use UUID for IDs except for Better Auth tables which must use text.

### TypeScript Strictness

This project uses maximum TypeScript strictness (`tsconfig.json`):
- `strictNullChecks`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`
- `noImplicitAny`, `noUnusedLocals`, `noUnusedParameters`

Always handle potential `undefined` values when accessing arrays/objects.

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
STRIPE_SECRET_KEY=...                   # For payments (Sprint 5)
ESPOCRM_API_KEY=...                     # For leads sync (Sprint 4)
```

## Development Workflow

See `docs/WORKFLOW.md` for the complete feature development process:
1. Simplify existing spec
2. Create feature folder with requirements.md + plan.md
3. Implement phase by phase

See `docs/CHECKLIST.md` for sprint progress tracking.

## Claude Code Commands

Available slash commands in `.claude/commands/`:
- `/create-spec` - Create feature specification
- `/publish-to-github` - Publish feature to GitHub Issues/Projects
- `/continue-feature` - Implement next task for a feature
- `/checkpoint` - Create checkpoint commit
- `/review-pr` - Review a pull request

## Project Roadmap

- **Sprint 1:** Infrastructure (done) - Next.js, Better Auth, Drizzle, Vercel
- **Sprint 2:** Tax calculation engine - IR 2026, Jeanbrun amortization, LMNP comparison
- **Sprint 3:** 6-step simulation wizard with Zod validation
- **Sprint 4:** SEO pages for 50 French cities + EspoCRM sync
- **Sprint 5:** Stripe payments, PDF export, Calendly integration
- **Sprint 6:** E2E tests (Playwright), production deployment

**EspoCRM Integration:** Leads sync using separate entities (`cLeadJeanbrun`, `cSimulationJeanbrun`, `cVille`, `cProgramme`).

**Documentation:**
- `docs/planning/PLAN-IMPLEMENTATION.md` - Sprint plans
- `docs/specs/REQUIREMENTS.md` - Functional requirements
- `docs/technical/FORMULES.md` - Tax calculation formulas
- `docs/phases/PHASE-*.md` - Detailed phase specifications
