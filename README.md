# Simulateur Loi Jeanbrun

Plateforme de simulation fiscale pour la Loi Jeanbrun (PLF 2026) avec accompagnement personnalisé.

**Version:** 2.0
**Stack:** Next.js 14 + Vercel + Neon PostgreSQL + Drizzle ORM

---

## Structure du projet

```
simulateur_jeanbrun/
├── README.md
├── docs/
│   ├── specs/              # Spécifications
│   │   ├── REQUIREMENTS.md # Requirements v2.0
│   │   ├── PRD.md          # Product Requirements Document
│   │   └── WIREFRAMES.md   # Maquettes simulateur
│   ├── phases/             # Planning sprints
│   │   ├── PHASE-1-INFRASTRUCTURE.md
│   │   ├── PHASE-2-CALCULS.md
│   │   ├── PHASE-3-INTERFACE.md
│   │   ├── PHASE-4-SEO.md
│   │   ├── PHASE-5-MONETISATION.md
│   │   └── PHASE-6-DEPLOY.md
│   ├── planning/
│   │   └── PLAN-IMPLEMENTATION.md
│   ├── legal/
│   │   └── REGISTRE-RGPD.md  # Conformité CNIL
│   └── technical/
│       ├── FORMULES.md
│       ├── ESPOCRM-SCHEMA.md
│       └── SCRAPING-PIPELINE.md
├── config/                 # Configuration n8n
├── data/                   # Données statiques (communes, loyers)
├── scripts/                # Scripts d'import
├── assets/mockups/         # Maquettes visuelles
└── app/                    # (futur) Code Next.js
```

---

## Stack technique

| Composant | Technologie |
|-----------|-------------|
| Frontend | Next.js 14 (App Router) |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Base de données | Neon PostgreSQL + Drizzle ORM |
| CRM (leads) | EspoCRM (sync API) |
| Paiement | Stripe Checkout |
| RDV | Calendly |
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
git clone https://github.com/ExpertIAEntreprise/simulateur_jeanbrun.git
cd simulateur_jeanbrun

# (futur) Installer les dépendances
cd app && npm install

# (futur) Lancer en dev
npm run dev
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
