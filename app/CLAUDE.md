# Simulateur Loi Jeanbrun - Guide de Développement

## Projet

Plateforme de simulation fiscale pour la Loi Jeanbrun (PLF 2026) avec accompagnement personnalisé.

**Responsable:** EXPERT IA ENTREPRISE SOLUTIONS (SASU)
**Domaine:** https://simuler-loi-fiscale-jeanbrun.fr
**Repo:** https://github.com/ExpertIAEntreprise/simulateur-loi-jeanbrun
**Preview:** https://simulateur-loi-jeanbrun.vercel.app

## Stack Technique

| Composant | Technologie |
|-----------|-------------|
| Framework | Next.js 16 + React 19 + TypeScript |
| Styling | Tailwind CSS 4 + shadcn/ui |
| Database | Neon PostgreSQL + Drizzle ORM |
| Auth | Better Auth |
| Paiement | Stripe Checkout |
| PDF | @react-pdf/renderer |
| Charts | Recharts |
| CRM | EspoCRM (sync leads) |
| RDV | Calendly |
| Hébergement | Vercel |

## Documentation Projet

| Document | Chemin |
|----------|--------|
| Requirements | `/docs/specs/REQUIREMENTS.md` |
| PRD | `/docs/specs/PRD.md` |
| Wireframes | `/docs/specs/WIREFRAMES.md` |
| Formules fiscales | `/docs/technical/FORMULES.md` |
| RGPD | `/docs/legal/REGISTRE-RGPD.md` |
| Planning | `/docs/planning/PLAN-IMPLEMENTATION.md` |

## Structure du Projet

```
src/
├── app/
│   ├── (auth)/              # Routes authentification
│   ├── (marketing)/         # Landing page, pages SEO
│   ├── simulateur/          # Simulateur rapide + avancé
│   │   ├── page.tsx         # Simulateur rapide
│   │   ├── avance/          # Simulateur 6 étapes
│   │   └── resultat/[id]/   # Page résultats
│   ├── villes/              # Pages SEO villes
│   │   └── [slug]/page.tsx
│   ├── accompagnement/      # Parcours accompagnement
│   │   ├── page.tsx         # Formulaire découverte
│   │   └── rdv/page.tsx     # Calendly embed
│   ├── compte/              # Espace utilisateur
│   └── api/
│       ├── simulation/      # API simulation
│       ├── checkout/        # Stripe
│       ├── decouverte/      # Découverte patrimoniale
│       └── webhooks/        # Stripe, Calendly
├── components/
│   ├── ui/                  # shadcn/ui
│   ├── simulateur/          # Composants simulateur
│   │   ├── etape-1/ à etape-6/
│   │   └── resultats/
│   └── accompagnement/      # Composants accompagnement
├── lib/
│   ├── calculs/             # Moteur de calcul fiscal
│   │   ├── ir.ts            # Impôt sur le revenu
│   │   ├── jeanbrun-neuf.ts
│   │   ├── jeanbrun-ancien.ts
│   │   └── orchestrateur.ts
│   ├── db.ts                # Connexion Neon
│   ├── schema.ts            # Schéma Drizzle
│   ├── stripe.ts            # Client Stripe
│   └── espocrm.ts           # Client EspoCRM
└── types/
    ├── simulation.ts
    ├── ville.ts
    └── lead.ts
```

## Formules Clés (Loi Jeanbrun)

```typescript
// Base amortissement
const baseAmortissement = prixAcquisition * 0.80  // Terrain exclu

// Amortissement neuf
const tauxNeuf = {
  intermediaire: 0.035,  // Plafond 8 000€
  social: 0.045,         // Plafond 10 000€
  tres_social: 0.055     // Plafond 12 000€
}

// Amortissement ancien (travaux >= 30% obligatoire)
const tauxAncien = {
  intermediaire: 0.030,  // Plafond 10 700€
  social: 0.035,
  tres_social: 0.040
}

// Déficit foncier bonifié: 21 400€ jusqu'au 31/12/2027

// Économie impôt
const economieImpot = Math.min(amortissement, plafond) * TMI
```

## Critères de Qualification (Accompagnement)

| Critère | Seuil |
|---------|-------|
| Revenus mensuels | >= 3 000€ |
| Taux endettement | <= 35% |
| Apport | >= 10% projet |
| TMI | >= 11% |

## Commandes

```bash
pnpm dev          # Dev server (NE PAS LANCER - demander à l'utilisateur)
pnpm build        # Build production
pnpm lint         # ESLint (TOUJOURS exécuter après modifications)
pnpm typecheck    # TypeScript (TOUJOURS exécuter après modifications)
pnpm db:push      # Push schema vers Neon
pnpm db:studio    # Drizzle Studio
```

## Règles de Développement

1. **TOUJOURS** exécuter `pnpm lint && pnpm typecheck` après modifications
2. **NE JAMAIS** lancer le serveur dev soi-même
3. **Données sensibles** : Chiffrement column-level pour revenus/patrimoine
4. **RGPD** : 3 consentements séparés (traitement, CGP, newsletter)
5. **Tests** : TDD, coverage 80%+ visé

## RGPD - Points Critiques

- Consentement explicite pour découverte patrimoniale
- Opt-in séparé pour revente leads CGP
- Durée conservation : 3 ans prospects, 10 ans clients
- Chiffrement données financières en base

## Variables d'Environnement

Voir `.env.local` pour la configuration complète.

Variables critiques :
- `POSTGRES_URL` : Connexion Neon
- `STRIPE_SECRET_KEY` : Paiement
- `ESPOCRM_API_KEY` : Sync leads
- `BETTER_AUTH_SECRET` : Sessions
