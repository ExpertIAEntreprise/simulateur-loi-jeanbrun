# Simulateur Loi Jeanbrun

Plateforme de simulation fiscale pour la Loi Jeanbrun (PLF 2026) avec accompagnement personnalisé.

**Version:** 2.0
**Stack:** Next.js 16 + React 19 + Vercel + Neon PostgreSQL + Drizzle ORM
**Domaine:** https://simuler-loi-fiscale-jeanbrun.fr

---

## Déploiement

| Environnement | URL |
|---------------|-----|
| Production | https://simuler-loi-fiscale-jeanbrun.fr |
| Preview | https://simulateur-loi-jeanbrun.vercel.app |
| Repo | https://github.com/ExpertIAEntreprise/simulateur-loi-jeanbrun |

---

## Structure du projet

```
simulateur-loi-jeanbrun/
├── README.md
├── app/                    # Application Next.js 16
│   ├── src/
│   │   ├── app/            # Routes (App Router)
│   │   ├── components/     # Composants React
│   │   └── lib/            # Utilitaires (db, auth, etc.)
│   ├── drizzle/            # Migrations SQL
│   ├── package.json
│   └── vercel.json
├── docs/
│   ├── specs/              # Spécifications
│   │   ├── REQUIREMENTS.md
│   │   ├── PRD.md
│   │   └── WIREFRAMES.md
│   ├── phases/             # Planning sprints
│   ├── planning/
│   │   └── PLAN-IMPLEMENTATION.md
│   ├── legal/
│   │   └── REGISTRE-RGPD.md
│   └── technical/
│       ├── FORMULES.md
│       ├── ESPOCRM-SCHEMA.md
│       └── SCRAPING-PIPELINE.md
├── config/                 # Configuration n8n
├── data/                   # Données statiques (communes, loyers)
├── scripts/                # Scripts d'import
└── assets/mockups/         # Maquettes visuelles
```

---

## Stack technique

| Composant | Technologie |
|-----------|-------------|
| Framework | Next.js 16 + React 19 + TypeScript |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Base de données | Neon PostgreSQL + Drizzle ORM |
| Auth | Better Auth |
| CRM (leads) | EspoCRM (sync API) |
| Paiement | Stripe Checkout |
| RDV | Calendly |
| PDF | @react-pdf/renderer |
| Charts | Recharts |
| Hébergement | Vercel |
| Analytics | Plausible (RGPD-friendly) |

---

## Modèle économique

```
1. FREEMIUM
   - Pack 3 simulations : 9,90€
   - Pack Duo 30 jours : 14,90€

2. ACCOMPAGNEMENT GRATUIT
   - Commission promoteur (pas le client)
   - Découverte patrimoniale → Qualification → RDV

3. REVENTE LEADS (avec consentement RGPD)
   - CGP partenaires locaux
```

---

## Planning (12 semaines)

| Sprint | Semaines | Focus |
|--------|----------|-------|
| 1 | S1-S2 | Infrastructure (Vercel, Neon, Drizzle) |
| 2 | S3-S4 | Moteur de calcul fiscal |
| 3 | S5-S6 | Interface simulateur 6 étapes |
| 4 | S7-S8 | Pages SEO (50 villes) |
| 5 | S9-S10 | Monétisation + Accompagnement |
| 6 | S11-S12 | Tests E2E + Production |

---

## Documentation

| Document | Description |
|----------|-------------|
| [REQUIREMENTS.md](./docs/specs/REQUIREMENTS.md) | Spécifications fonctionnelles et techniques v2.0 |
| [PRD.md](./docs/specs/PRD.md) | Product Requirements Document complet |
| [PLAN-IMPLEMENTATION.md](./docs/planning/PLAN-IMPLEMENTATION.md) | Plan d'implémentation 6 sprints |
| [REGISTRE-RGPD.md](./docs/legal/REGISTRE-RGPD.md) | Registre des traitements CNIL |
| [FORMULES.md](./docs/technical/FORMULES.md) | Formules de calcul Loi Jeanbrun |

---

## Quick Start

```bash
# Cloner le repo
git clone https://github.com/ExpertIAEntreprise/simulateur-loi-jeanbrun.git
cd simulateur-loi-jeanbrun/app

# Installer les dépendances
pnpm install

# Configurer l'environnement
cp .env.local.example .env.local
# Éditer .env.local avec vos clés

# Lancer en dev
pnpm dev
```

## Commandes

```bash
pnpm dev          # Serveur dev (Turbopack)
pnpm build        # Build production
pnpm lint         # ESLint
pnpm typecheck    # TypeScript
pnpm db:push      # Push schema vers Neon
pnpm db:studio    # Drizzle Studio
```

---

## Conformité

- RGPD : [Registre des traitements](./docs/legal/REGISTRE-RGPD.md)
- CNIL : Bases légales documentées
- Stripe : DPA signé
- Données sensibles : Chiffrement column-level

---

## Responsable

**EXPERT IA ENTREPRISE SOLUTIONS** (SASU)
SIRET: 988 031 225 00010
10 rue Saint Thiébaut, 54000 Nancy
contact@expert-ia-entreprise.fr

---

**Licence:** Projet privé - Tous droits réservés
