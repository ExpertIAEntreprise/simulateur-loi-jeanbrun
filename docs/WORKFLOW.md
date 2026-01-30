# Simulateur Loi Jeanbrun — Workflow de développement

## Principe

Chaque feature suit un processus en 3 étapes :

1. **Simplifier** la spec existante (décisions uniquement)
2. **Créer** le dossier feature (requirements + plan)
3. **Implémenter** phase par phase

---

## Structure des dossiers

```
docs/
├── specs/
│   ├── PRD.md              ← Vision produit (référence)
│   ├── REQUIREMENTS.md     ← Exigences fonctionnelles
│   └── WIREFRAMES.md       ← Maquettes UI
├── planning/
│   └── PLAN-IMPLEMENTATION.md  ← Plan des 6 sprints
├── phases/                 ← Décisions techniques par phase
│   ├── PHASE-1-INFRASTRUCTURE.md
│   ├── PHASE-2-CALCULS.md
│   ├── PHASE-3-INTERFACE.md
│   ├── PHASE-4-SEO.md
│   ├── PHASE-5-MONETISATION.md
│   └── PHASE-6-DEPLOY.md
├── technical/              ← Documentation technique
│   ├── FORMULES.md
│   ├── ESPOCRM-SCHEMA.md
│   └── SCRAPING-PIPELINE.md
├── features/               ← Plans d'implémentation (actifs)
│   ├── moteur-calcul/
│   │   ├── requirements.md
│   │   └── plan.md
│   └── [autre-feature]/
├── legal/
│   └── REGISTRE-RGPD.md
└── WORKFLOW.md             ← Ce fichier
```

---

## Prompt à copier-coller

Utilise ce prompt pour démarrer chaque nouvelle feature :

```
## Feature : [NOM DE LA FEATURE]

### Étape 1 — Simplifier la spec existante

Lis le fichier `docs/phases/PHASE-[X]-[NOM].md` et simplifie-le :
- Garde uniquement les décisions techniques (quoi + pourquoi)
- Supprime tout le code exemple
- Supprime les tâches de développement déjà complétées
- Objectif : ~50-100 lignes max

### Étape 2 — Créer le dossier feature

Crée le dossier `docs/features/[nom-feature]/` avec deux fichiers :

**requirements.md** doit contenir :
- Description de la feature
- Exigences fonctionnelles (user stories ou liste)
- Exigences non-fonctionnelles (sécurité, performance, UX)
- Critères d'acceptation (checklist de validation)

**plan.md** doit contenir :
- Plan d'implémentation divisé en phases
- Chaque phase = un bloc logique de travail
- Chaque phase contient des tâches actionnables avec [ ]
- Référence aux fichiers à créer/modifier

### Étape 3 — Validation

Montre-moi le plan avant de commencer l'implémentation.
```

---

## Exemple concret

```
## Feature : Moteur de calcul fiscal

### Étape 1 — Simplifier la spec existante

Lis le fichier `docs/phases/PHASE-2-CALCULS.md` et simplifie-le.

### Étape 2 — Créer le dossier feature

Crée `docs/features/moteur-calcul/` avec requirements.md et plan.md.

### Étape 3 — Validation

Montre-moi le plan avant de commencer.
```

---

## Mapping Phases → Features

| Phase / Spec | Feature à créer | Sprint | Type |
|--------------|-----------------|--------|------|
| `phases/PHASE-1-INFRASTRUCTURE.md` | `features/infrastructure/` | Sprint 1 | Fondation |
| `phases/PHASE-2-CALCULS.md` | `features/moteur-calcul/` | Sprint 2 | Core |
| `phases/PHASE-3-INTERFACE.md` | `features/simulateur-wizard/` | Sprint 3 | Interface |
| `phases/PHASE-4-SEO.md` | `features/pages-villes-seo/` | Sprint 4 | SEO |
| `phases/PHASE-5-MONETISATION.md` | `features/stripe-paiement/` | Sprint 5 | Business |
| `phases/PHASE-5-MONETISATION.md` | `features/export-pdf/` | Sprint 5 | Business |
| `phases/PHASE-5-MONETISATION.md` | `features/calendly-rdv/` | Sprint 5 | Business |
| `phases/PHASE-6-DEPLOY.md` | `features/tests-e2e/` | Sprint 6 | Quality |
| `phases/PHASE-6-DEPLOY.md` | `features/production-deploy/` | Sprint 6 | Deploy |

### Features techniques transverses

| Spec technique | Feature à créer | Type |
|----------------|-----------------|------|
| `technical/ESPOCRM-SCHEMA.md` | `features/espocrm-sync/` | Intégration |
| `technical/SCRAPING-PIPELINE.md` | `features/scraping-data/` | Data |
| `technical/FORMULES.md` | (inclus dans moteur-calcul) | Reference |
| `technical/MOLTBOT-MISSION-PROGRAMMES.md` | (exécuté par Moltbot) | Externe |

---

## Détail des features par sprint

### Sprint 1 — Infrastructure (S1-S2)

| Feature | Fichiers clés | Priorité |
|---------|---------------|----------|
| `infrastructure/` | Next.js, Tailwind v4, shadcn/ui | CRITIQUE |
| `database/` | Drizzle + Neon, schéma, migrations | CRITIQUE |
| `auth/` | Better Auth (email/password) | HAUTE |

### Sprint 2 — Moteur de calcul (S3-S4)

| Feature | Fichiers clés | Priorité |
|---------|---------------|----------|
| `moteur-calcul/` | IR 2026, Jeanbrun, LMNP, plus-value | CRITIQUE |
| `tests-calculs/` | Jest, 90%+ coverage | HAUTE |

### Sprint 3 — Interface simulateur (S5-S6)

| Feature | Fichiers clés | Priorité |
|---------|---------------|----------|
| `simulateur-wizard/` | 6 étapes, react-hook-form, Zod | CRITIQUE |
| `resultats-dashboard/` | Graphiques, comparatifs | HAUTE |

### Sprint 4 — Pages SEO (S7-S8)

| Feature | Fichiers clés | Priorité |
|---------|---------------|----------|
| `pages-villes-seo/` | 50 villes, SSG, metadata | CRITIQUE |
| `scraping-data/` | DVF, loyers, programmes neufs | HAUTE |
| `espocrm-sync/` | cVille, cProgramme | MOYENNE |

### Sprint 5 — Monétisation (S9-S10)

| Feature | Fichiers clés | Priorité |
|---------|---------------|----------|
| `stripe-paiement/` | Checkout, webhooks, plans | CRITIQUE |
| `export-pdf/` | @react-pdf/renderer | HAUTE |
| `calendly-rdv/` | Embed, webhook callback | MOYENNE |

### Sprint 6 — Deploy & Tests (S11-S12)

| Feature | Fichiers clés | Priorité |
|---------|---------------|----------|
| `tests-e2e/` | Playwright, parcours critiques | CRITIQUE |
| `production-deploy/` | Domaine, SSL, monitoring | CRITIQUE |

---

## Agents spécialisés à utiliser

| Phase | Agents recommandés |
|-------|-------------------|
| Infrastructure | `drizzle-neon-expert`, `better-auth-expert` |
| Calculs | `tdd-guide` (tests first), `code-reviewer` |
| Interface | `ui-expert`, `react-hook-form-expert` |
| SEO | `espocrm-expert`, `scraping-expert` |
| Paiement | `stripe-payments-expert`, `security-reviewer` |
| Tests | `e2e-runner`, `build-error-resolver` |

---

## Pendant l'implémentation

1. **Une phase à la fois** — Ne pas sauter d'étapes
2. **Cocher les tâches** — Mettre `[x]` dans plan.md au fur et à mesure
3. **Valider chaque phase** — `pnpm lint && pnpm typecheck` avant de passer à la suite
4. **Commit par phase** — Un commit clair à la fin de chaque phase
5. **Tests first** — Utiliser `tdd-guide` pour les calculs fiscaux

---

## Commandes de validation

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

# Tests
pnpm test             # Run Jest unit tests
pnpm test:e2e         # Run Playwright E2E tests
```

---

## Après l'implémentation

- Marquer la feature comme terminée dans `docs/planning/PLAN-IMPLEMENTATION.md`
- Mettre à jour les checklists de sprint
- Le dossier `features/[nom]/` reste comme documentation de ce qui a été fait

---

## Coordination avec Moltbot

Pour le scraping des programmes immobiliers neufs (Phase 4), Moltbot exécute le travail en parallèle :

**Fichier mission:** `docs/technical/MOLTBOT-MISSION-PROGRAMMES.md`

**Prérequis pour Moltbot:**
1. Entités EspoCRM créées (cVille, cProgramme)
2. 50 villes importées avec zones fiscales
3. Clé API `ESPOCRM_API_KEY_JEANBRUN` générée

**Communication:**
- Moltbot envoie des rapports via WhatsApp
- Les données sont stockées dans EspoCRM
- Les pages SEO `/villes/[slug]` consomment les données via API

---

## Liens utiles

| Ressource | URL |
|-----------|-----|
| Production | https://simulateur-loi-jeanbrun.vercel.app |
| GitHub | https://github.com/ExpertIAEntreprise/simulateur-loi-jeanbrun |
| Neon Dashboard | https://console.neon.tech |
| EspoCRM | https://espocrm.expert-ia-entreprise.fr |
| Vercel | https://vercel.com/expertiaentreprise |

---

*Dernière mise à jour : 30 janvier 2026*
