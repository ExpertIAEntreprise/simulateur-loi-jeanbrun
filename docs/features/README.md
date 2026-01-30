# Features Directory

Ce dossier contient les plans d'implémentation actifs pour chaque feature du Simulateur Loi Jeanbrun.

## Structure

Chaque feature a son propre dossier avec deux fichiers :

```
features/
├── [nom-feature]/
│   ├── requirements.md   ← Exigences (quoi)
│   └── plan.md           ← Implémentation (comment)
└── README.md             ← Ce fichier
```

## Créer une nouvelle feature

1. Crée un dossier avec le nom de la feature (kebab-case)
2. Crée `requirements.md` avec les exigences
3. Crée `plan.md` avec les tâches à cocher

## Template requirements.md

```markdown
# Feature: [Nom de la feature]

## Description

[Description en 2-3 phrases]

## Exigences fonctionnelles

- [ ] FR-1: [User story ou exigence]
- [ ] FR-2: ...

## Exigences non-fonctionnelles

- [ ] NFR-1: Performance - [critère mesurable]
- [ ] NFR-2: Sécurité - [critère]
- [ ] NFR-3: UX - [critère]

## Critères d'acceptation

- [ ] AC-1: [Condition vérifiable]
- [ ] AC-2: ...
```

## Template plan.md

```markdown
# Plan: [Nom de la feature]

## Phase 1: [Nom de la phase]

### Tâches

- [ ] 1.1 [Tâche actionnable]
- [ ] 1.2 [Tâche actionnable]

### Fichiers à créer/modifier

- `src/lib/[fichier].ts` - [description]
- `src/components/[fichier].tsx` - [description]

### Validation

- [ ] `pnpm lint` passe
- [ ] `pnpm typecheck` passe
- [ ] Tests unitaires passent

---

## Phase 2: [Nom de la phase]

...
```

## Features actuelles

| Feature | Sprint | Status | Plan |
|---------|--------|--------|------|
| `infrastructure/` | 1 | 🟡 En cours | [plan.md](./infrastructure/plan.md) |

## Workflow

Voir `docs/WORKFLOW.md` pour le processus complet de développement.
