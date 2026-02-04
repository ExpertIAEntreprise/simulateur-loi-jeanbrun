# Checklist - Simulateur Loi Jeanbrun

**Version:** 2.1
**Dernière mise à jour:** 4 février 2026
**Audit:** Conformité PRD/REQUIREMENTS validée

---

## Vue d'ensemble

| Sprint | Focus | Status | Progression |
|--------|-------|--------|-------------|
| **Sprint 1** | Infrastructure | ✅ Terminé | 100% |
| **Sprint 2** | Moteur de calcul | ✅ Terminé | 100% |
| **Sprint 3** | Interface simulateur | ⬜ À faire | 0% |
| **Sprint 4** | Pages SEO + Contenu | ✅ Terminé | 95% |
| **Sprint 5** | Monétisation | ⬜ À faire | 0% |
| **Sprint 6** | Deploy & Tests | ⬜ À faire | 0% |

---

## Sprint 1 — Infrastructure ✅ TERMINÉ

**Dates:** 03-14 Février 2026
**Objectif:** Environnement de développement fonctionnel (Vercel + Neon)

### Features terminées ✅

| Feature | Notes |
|---------|-------|
| Setup Next.js 16 + TypeScript | App Router, Turbopack, React 19 |
| Tailwind CSS v4 + shadcn/ui | 19 composants UI |
| Neon PostgreSQL + Drizzle ORM | 9 tables (user, session, account, verification, villes, programmes, simulations, leads, quotas) |
| Better Auth | Email/password + email verification + account lockout (5 tentatives/15 min) |
| Déploiement Vercel | https://simulateur-loi-jeanbrun.vercel.app |
| GitHub Actions CI/CD | Build + lint automatique |
| Entités EspoCRM Jeanbrun | CJeanbrunVille (51), CJeanbrunProgramme |
| Client API EspoCRM | `/src/lib/espocrm/` - client.ts, types.ts |
| Pages légales | CGV, mentions légales, politique de confidentialité |
| REGISTRE-RGPD.md | 549 lignes - 8 traitements, AIPD, sous-traitants |
| Rate limiting | Upstash Redis - 10 req/min par IP |
| Logging structuré | Pino logger |
| Accessibilité | WCAG 2.1 AA - 5 guides A11Y |

### Validation Sprint 1 ✅

- [x] `pnpm dev` démarre sans erreur
- [x] `pnpm build:ci` produit un build de production
- [x] `pnpm check` (lint + typecheck) passe
- [x] Déploiement Vercel fonctionnel
- [x] Connexion Neon PostgreSQL OK
- [x] Better Auth fonctionnel (login, register, forgot, reset)
- [x] Schéma Drizzle complet (9 tables)
- [x] Client API EspoCRM fonctionnel
- [x] Pages légales publiées
- [x] REGISTRE-RGPD.md créé et complet

---

## Sprint 2 — Moteur de calcul ✅ TERMINÉ

**Dates:** 17-28 Février 2026
**Objectif:** Tous les calculs fiscaux implémentés et testés à 90%+

### Features terminées ✅

| Feature | Status | Fichier | Lignes |
|---------|--------|---------|--------|
| Module IR 2026 | ✅ Terminé | `/src/lib/calculs/ir.ts` | 205 |
| Module TMI automatique | ✅ Terminé | `/src/lib/calculs/tmi.ts` | 104 |
| Module Jeanbrun neuf | ✅ Terminé | `/src/lib/calculs/jeanbrun-neuf.ts` | 107 |
| Module Jeanbrun ancien | ✅ Terminé | `/src/lib/calculs/jeanbrun-ancien.ts` | 143 |
| Module déficit foncier | ✅ Terminé | `/src/lib/calculs/deficit-foncier.ts` | 211 |
| Module crédit immobilier | ✅ Terminé | `/src/lib/calculs/credit.ts` | 323 |
| Module plus-value | ✅ Terminé | `/src/lib/calculs/plus-value.ts` | 288 |
| Module LMNP comparatif | ✅ Terminé | `/src/lib/calculs/lmnp.ts` | 366 |
| Module rendements | ✅ Terminé | `/src/lib/calculs/rendements.ts` | 110 |
| Orchestrateur simulation | ✅ Terminé | `/src/lib/calculs/orchestrateur.ts` | 467 |
| Feature flags | ✅ Terminé | `/src/lib/calculs/feature-flags.ts` | 458 |
| Constants fiscales | ✅ Terminé | `/src/lib/calculs/constants.ts` | 640 |
| Tests unitaires | ✅ Terminé | `/src/lib/calculs/__tests__/` | 30+ tests |

**Total moteur de calcul:** 3,644 lignes de code

### Validation Sprint 2 ✅

- [x] Tous les modules créés dans `/src/lib/calculs/`
- [x] Tests unitaires passent (Vitest)
- [x] Coverage > 90%
- [x] Formules validées vs exemples PRD
- [x] API `/api/simulation/calcul` fonctionnelle

---

## Sprint 3 — Interface simulateur

**Dates:** 03-14 Mars 2026
**Objectif:** Wizard 6 étapes utilisable

### Features

| Feature | Status | Notes |
|---------|--------|-------|
| Étape 1: Profil fiscal | ⬜ À faire | Revenus, situation familiale |
| Étape 2: Projet immobilier | ⬜ À faire | Type bien, zone, prix |
| Étape 3: Financement | ⬜ À faire | Apport, durée crédit |
| Étape 4: Revenus locatifs | ⬜ À faire | Loyer estimé, charges |
| Étape 5: Comparaison régimes | ⬜ À faire | Jeanbrun vs LMNP |
| Étape 6: Résultats | ⬜ À faire | Graphiques, synthèse |
| Validation Zod | ⬜ À faire | Schémas par étape |
| Persistance état | ⬜ À faire | localStorage ou Zustand |
| Design responsive | ⬜ À faire | Mobile-first |

### Validation Sprint 3

- [ ] 6 étapes navigables
- [ ] Formulaires validés (react-hook-form + Zod)
- [ ] Calculs affichés en temps réel
- [ ] Responsive mobile

---

## Sprint 4 — Pages SEO + Contenu ✅ TERMINÉ (95%)

**Dates:** 17 Janvier - 4 Février 2026
**Objectif:** Pages villes, programmes, blog, contenu SEO

### Features Pages Villes ✅

| Feature | Status | Notes |
|---------|--------|-------|
| Template `/villes/[slug]` | ✅ Terminé | ISR 1h, 382 pages (52 metropoles + 330 peripheriques) |
| Composant DonneesMarche | ✅ Terminé | Prix m², DVF, tendances via barometre |
| Composant PlafondsJeanbrun | ✅ Terminé | Loyers, prix par zone fiscale |
| Composant ProgrammesList | ✅ Terminé | Programmes neufs par ville depuis EspoCRM |
| Composant SimulateurPreRempli | ✅ Terminé | CTA sidebar vers simulateur |
| Composant VillesProches | ✅ Terminé | Maillage SEO inter-villes |
| Composant CTAVille | ✅ Terminé | CTA en bas de page |
| Metadata SEO dynamiques | ✅ Terminé | Title, description, OG par ville |
| Sitemap.xml | ✅ Terminé | Toutes pages villes + blog + contenu |

### Features Pages Contenu ✅

| Feature | Status | Notes |
|---------|--------|-------|
| Page `/loi-jeanbrun` | ✅ Terminé | Guide complet, FAQ, JSON-LD |
| Page `/a-propos` | ✅ Terminé | Profil expert, Calendly, JSON-LD |
| Blog `/blog` + 10 articles | ✅ Terminé | MDX, 16 466 mots, categories |
| Barometre `/barometre` | ✅ Terminé | Données mensuelles par ville |
| Page `/programmes` | ✅ Terminé | Liste programmes EspoCRM |
| Page `/accessibilite` | ✅ Terminé | Declaration RGAA |

### Features Navigation/Layout ✅

| Feature | Status | Notes |
|---------|--------|-------|
| Header Shadcn Studio unifié | ✅ Terminé | Navigation dropdowns, responsive |
| Footer 03 unifié (5 colonnes) | ✅ Terminé | Newsletter, villes SEO, legal |
| Layout `(app)` avec header/footer | ✅ Terminé | Toutes pages internes |
| Nettoyage composants obsolètes | ✅ Terminé | LandingHeader/Footer supprimés |

### Features EspoCRM Jeanbrun ✅

| Feature | Status | Notes |
|---------|--------|-------|
| Entités CJeanbrunVille (313) | ✅ Terminé | 52 metropoles + 261 peripheriques |
| Entités CJeanbrunProgramme (153) | ✅ Terminé | Source Nexity |
| Champ lotsDetails | ✅ Terminé | Type text, JSON stringify (4 fev 2026) |
| Arrondissements Paris (20) | ✅ Terminé | Avec metropoleParentId |
| Arrondissements Marseille (16) | ✅ Terminé | Avec metropoleParentId |
| Client API EspoCRM | ✅ Terminé | `src/lib/espocrm/` |

### Restant (5%) - En attente enrichissement Tom

| Feature | Status | Notes |
|---------|--------|-------|
| Enrichissement 153 programmes | 🟡 En cours | Tom scrape Nexity (batch 10 test) |
| Adapter ProgrammeCard (lotsDetails) | ⬜ Bloqué | Attente données enrichies |
| Pagination/filtres programmes | ⬜ Bloqué | Attente données enrichies |
| Page detail `/programmes/[slug]` | ⬜ Optionnel | Apres enrichissement |

### Validation Sprint 4

- [x] 382 pages villes générées (ISR)
- [x] Données marché affichées (DVF + barometre)
- [x] Programmes neufs depuis EspoCRM
- [x] Header/Footer unifié sur toutes les pages
- [ ] Lighthouse SEO > 90 (à tester en production)
- [ ] Enrichissement programmes complet (Tom)

---

## Sprint 5 — Monétisation

**Dates:** 31 Mars - 11 Avril 2026
**Objectif:** Paiement fonctionnel + PDF + RDV

### Features

| Feature | Status | Notes |
|---------|--------|-------|
| Stripe Checkout | ⬜ À faire | Plans Free/Pro |
| Webhooks Stripe | ⬜ À faire | checkout.session.completed |
| Gestion abonnements | ⬜ À faire | Statut user, expiration |
| Export PDF rapport | ⬜ À faire | @react-pdf/renderer |
| Template PDF complet | ⬜ À faire | 10 pages, graphiques |
| Gate paywall | ⬜ À faire | PDF réservé aux Pro |
| Formulaire découverte | ⬜ À faire | Multi-étapes + validation |
| Qualification automatique | ⬜ À faire | Calcul éligibilité serveur |
| Calendly embed | ⬜ À faire | Prise de RDV |
| Webhook Calendly | ⬜ À faire | Sync EspoCRM |
| Stripe Tax (TVA) | ⬜ À faire | B2C France |

### Validation Sprint 5

- [ ] Paiement Stripe fonctionnel (test mode)
- [ ] PDF généré avec toutes les données
- [ ] RDV Calendly intégré
- [ ] Webhooks fonctionnels

---

## Sprint 6 — Deploy & Tests

**Dates:** 14-25 Avril 2026
**Objectif:** Production stable et testée

### Features

| Feature | Status | Notes |
|---------|--------|-------|
| Tests E2E Playwright | ⬜ À faire | Parcours simulation |
| Tests E2E paiement | ⬜ À faire | Stripe test mode |
| Tests E2E PDF | ⬜ À faire | Génération + download |
| Domaine production | ⬜ À faire | simuler-loi-fiscale-jeanbrun.fr |
| SSL + CDN | ⬜ À faire | Via Vercel |
| Monitoring (Sentry) | ⬜ À faire | Error tracking |
| Analytics (Plausible) | ⬜ À faire | Privacy-first |
| Performance | ⬜ À faire | Core Web Vitals |
| Documentation utilisateur | ⬜ À faire | FAQ, guide |

### Validation Sprint 6

- [ ] Tests E2E passent (Playwright)
- [ ] Domaine production actif
- [ ] Monitoring configuré
- [ ] Lighthouse > 90 (toutes catégories)

---

## Tâches externes (Tom / Moltbot)

| Tâche | Status | Responsable |
|-------|--------|-------------|
| Créer entité CJeanbrunVille | ✅ Terminé | Admin EspoCRM |
| Créer entité CJeanbrunProgramme | ✅ Terminé | Admin EspoCRM |
| Importer 313 villes + arrondissements | ✅ Terminé | Admin EspoCRM |
| Importer 153 programmes Nexity | ✅ Terminé | Admin EspoCRM |
| Créer champ lotsDetails | ✅ Terminé (04/02) | Claude |
| Credentials R2 sur Boldbot | ✅ Terminé (04/02) | Claude |
| Instructions scraping Tom | ✅ Terminé (04/02) | Claude |
| Batch test 10 programmes | 🟡 En cours | Tom |
| Enrichissement 153 programmes | ⬜ À faire | Tom |

---

## Légende

| Symbole | Signification |
|---------|---------------|
| ✅ | Terminé |
| 🟡 | En cours |
| ⬜ | À faire |
| ❌ | Bloqué |

---

## Résumé technique Sprint 1-2

### Architecture implémentée

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                  # Auth pages (login, register, forgot, reset)
│   ├── api/                     # 5 API routes
│   │   ├── auth/[...all]/      # Better Auth handler
│   │   ├── chat/               # AI chat (OpenRouter)
│   │   ├── simulation/calcul/  # Tax calculation
│   │   ├── diagnostics/        # Health check
│   │   └── espocrm/test/       # EspoCRM test
│   ├── dashboard/              # Protected dashboard
│   └── profile/                # User profile
├── components/
│   ├── auth/                   # 8 auth components
│   └── ui/                     # 19 shadcn/ui components
├── lib/
│   ├── auth.ts                 # Better Auth server
│   ├── auth-client.ts          # Better Auth client
│   ├── auth-lockout.ts         # Account lockout (237 lines)
│   ├── db.ts                   # Drizzle connection
│   ├── schema.ts               # 9 tables (383 lines)
│   ├── calculs/                # Tax engine (3,644 lines)
│   │   ├── ir.ts, tmi.ts, jeanbrun-*.ts
│   │   ├── credit.ts, plus-value.ts, lmnp.ts
│   │   ├── orchestrateur.ts, feature-flags.ts
│   │   └── __tests__/
│   └── espocrm/                # CRM client
└── types/                      # TypeScript types
```

### Statistiques code

| Métrique | Valeur |
|----------|--------|
| Fichiers source (TS/TSX) | 117 |
| Documentation (MD) | 41 |
| Moteur de calcul | 3,644 lignes |
| Schéma DB | 383 lignes |
| Tests | 30+ cases |
| Composants UI | 19 |
| API Routes | 5 |
| Tables DB | 9 |

---

*Dernière mise à jour : 4 février 2026 - Sprint 4 terminé, nettoyage composants obsolètes*
