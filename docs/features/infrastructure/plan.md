# Plan: Infrastructure (Sprint 1 - Complétion)

**Effort estimé:** 4 jours
**Priorité:** CRITIQUE (bloquant pour Sprint 2)

---

## Phase 1: Schéma Drizzle complet (1,5j)

### Tâches

- [x] 1.1 Ajouter les enums Drizzle (zone_fiscale, tension_locative, niveau_loyer, lead_statut)
- [x] 1.2 Créer table `villes` avec tous les champs marché
- [x] 1.3 Créer table `programmes` avec relation vers villes
- [x] 1.4 Créer table `simulations` avec JSONB (inputData, resultats)
- [x] 1.5 Créer table `leads` avec consentements RGPD
- [x] 1.6 Créer table `quotas` pour packs payants
- [x] 1.7 Définir les relations Drizzle (villesRelations, programmesRelations, etc.)
- [x] 1.8 Appliquer le schéma avec `pnpm db:push` ✓

### Fichiers à créer/modifier

- `src/lib/schema.ts` - Ajouter toutes les tables métier

### Validation

- [x] `pnpm db:push` sans erreur ✓
- [x] Base affiche 9 tables (4 auth + 5 métier) ✓
- [x] `pnpm typecheck` passe ✓

---

## Phase 2: Types TypeScript (0,5j) ✓

### Tâches

- [x] 2.1 Créer `src/types/ville.ts` avec interface Ville, VilleMarche, VilleFilters
- [x] 2.2 Créer `src/types/programme.ts` avec interface Programme, ProgrammeAvecVille, ProgrammeCarte
- [x] 2.3 Créer `src/types/simulation.ts` avec interfaces SimulationInput, SimulationResultat, SimulationProjection
- [x] 2.4 Créer `src/types/lead.ts` avec interface Lead, LeadInput, LeadStatut
- [x] 2.5 Créer index `src/types/index.ts` qui re-exporte tout

### Fichiers créés

- `src/types/ville.ts` ✓
- `src/types/programme.ts` ✓
- `src/types/simulation.ts` ✓
- `src/types/lead.ts` ✓
- `src/types/index.ts` ✓

### Validation

- [x] `pnpm typecheck` passe ✓
- [x] Types utilisables dans les composants (via `@/types`)

---

## Phase 3: Client API EspoCRM (1j) ✓

### Tâches

- [x] 3.1 Créer `src/lib/espocrm/client.ts` avec classe EspoCRMClient ✓
- [x] 3.2 Implémenter `getVilles()` avec pagination et filtres ✓
- [x] 3.3 Implémenter `getVilleBySlug(slug)` ✓
- [x] 3.4 Implémenter `getProgrammes(villeId?)` avec filtres ✓
- [x] 3.5 Implémenter `createLead(data)` pour sync découverte ✓
- [x] 3.6 Ajouter gestion d'erreurs avec retry (3 tentatives, exponential backoff) ✓
- [x] 3.7 Ajouter variables d'environnement dans `src/lib/env.ts` ✓
- [x] 3.8 Créer endpoint test `/api/espocrm/test/route.ts` ✓

### Fichiers créés

- `src/lib/espocrm/client.ts` (336 lignes) - Classe EspoCRMClient ✓
- `src/lib/espocrm/types.ts` (191 lignes) - Types + helpers conversion ✓
- `src/lib/espocrm/index.ts` (53 lignes) - Export singleton ✓
- `src/app/api/espocrm/test/route.ts` (53 lignes) - Endpoint test ✓

### Fonctionnalités implémentées

- `getVilles(filters?, pagination?)` - Liste avec filtres departement/zoneFiscale/search
- `getVilleBySlug(slug)` - Recherche unique par slug
- `getProgrammes(filters?, pagination?)` - Liste avec filtres villeId/promoteur/prix
- `getProgrammeById(id)` - Récupération par ID
- `createLead(lead)` - Création Contact avec cSource="simulateur-jeanbrun"
- `findLeadByEmail(email)` - Déduplication leads
- `healthCheck()` - Vérification connexion
- Helpers: `toEspoLead()`, `fromEspoVille()`, `fromEspoProgramme()`

### Validation

- [x] Endpoint `/api/espocrm/test` retourne les 5 premières villes ✓
- [x] `pnpm typecheck` passe ✓
- [x] `pnpm build:ci` passe ✓

---

## Phase 4: Pages légales + RGPD (1j) ✓

### Tâches

- [x] 4.1 Créer `docs/legal/REGISTRE-RGPD.md` avec registre des traitements ✓
- [x] 4.2 Créer page `/mentions-legales` ✓
- [x] 4.3 Créer page `/cgv` (Conditions Générales de Vente) ✓
- [x] 4.4 Créer page `/politique-confidentialite` ✓
- [x] 4.5 Ajouter liens dans le footer (`src/components/site-footer.tsx`) ✓
- [x] 4.6 Vérifier metadata SEO (noindex sur CGV, lang=fr) ✓

### Fichiers créés

- `docs/legal/REGISTRE-RGPD.md` (déjà existant, complet) ✓
- `src/app/mentions-legales/page.tsx` ✓
- `src/app/cgv/page.tsx` ✓
- `src/app/politique-confidentialite/page.tsx` ✓

### Fichiers modifiés

- `src/components/site-footer.tsx` - Liens légaux + branding CardImmo ✓
- `src/app/layout.tsx` - Metadata SEO FR + JSON-LD + lang=fr ✓

### Validation

- [x] Registre RGPD complété ✓
- [x] 3 pages légales accessibles ✓
- [x] Liens dans le footer fonctionnels ✓
- [x] `pnpm check` passe ✓

---

## Checklist finale Sprint 1

### Technique

- [x] `pnpm dev` fonctionne ✓
- [x] `pnpm build:ci` passe ✓
- [x] `pnpm check` (lint + typecheck) passe ✓
- [x] Schéma Drizzle complet appliqué ✓
- [x] Client EspoCRM fonctionnel ✓

### Fonctionnel

- [x] 9 tables en base (4 auth + 5 métier) ✓
- [x] API EspoCRM accessible (test endpoint) ✓
- [x] Pages légales publiées ✓
- [x] Registre RGPD documenté ✓

### Documentation

- [ ] CHECKLIST.md mis à jour (Sprint 1 = 100%)
- [x] Ce plan mis à jour avec [x] sur tâches terminées ✓

---

## Commit suggéré

```
feat(db): add complete Drizzle schema for simulator

- Add villes, programmes, simulations, leads, quotas tables
- Add EspoCRM client with retry logic
- Add legal pages (mentions, CGV, privacy)
- Add RGPD register documentation

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
```

---

*Dernière mise à jour: 30 janvier 2026*
