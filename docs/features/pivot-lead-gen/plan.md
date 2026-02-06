# Pivot Lead Generation — Plan d'Implementation

> **Ref :** [requirements.md](./requirements.md)
> **Date :** 6 fevrier 2026
> **Statut :** 🟡 Phase 0 terminee

---

## Vue d'ensemble

Le pivot se decompose en **7 phases** qui transforment le projet d'un modele packs/simulations vers un modele apporteur d'affaires digital. Chaque phase est autonome et deployable independamment.

**Decision architecturale :** Monorepo Turborepo pour partager le code entre simuler-loi-jeanbrun.fr et stop-loyer.fr (DB, leads, UI, SEO).

**Ordre des phases :**
0. Migration monorepo Turborepo (prerequis)
1. Nettoyage code (supprimer l'ancien modele)
2. Schema DB (leads, promoteurs, courtiers)
3. Simplification wizard (6 → 2 temps : simulation + capture)
4. Page resultats (teaser + lead gate + avantage client direct)
5. API leads + notifications (dispatch promoteur ET courtier)
6. Visibilite programmes (masquer scrapes non autorises)

---

## Phase 0 — Migration Monorepo Turborepo ✅ TERMINEE

**Objectif :** Transformer le projet standalone `simulateur_loi_Jeanbrun` en monorepo Turborepo avec deux apps et des packages partages.

### Taches

- [x] **Initialiser Turborepo** a la racine du repo
  - [x] Installer `turbo` comme devDependency racine
  - [x] Creer `turbo.json` avec les pipelines (build, dev, lint, typecheck, test)
  - [x] Creer `pnpm-workspace.yaml` avec `apps/*` et `packages/*`
- [x] **Deplacer l'app Jeanbrun existante** dans `apps/jeanbrun/`
  - [x] Deplacer `src/`, `public/`, `next.config.ts`, `tsconfig.json`, etc.
  - [x] Adapter les imports via re-exports de compatibilite
  - [x] Build + typecheck passent (`turbo build --filter=jeanbrun`)
- [x] **Creer le squelette `apps/stop-loyer/`** (vide pour l'instant)
  - [x] Init Next.js 16 minimal
  - [x] Meme stack : Tailwind v4, shadcn/ui, TypeScript strict
  - [x] Page d'accueil placeholder "Stop Loyer - Bientot disponible"
- [x] **Extraire les packages partages**
  - [x] `packages/database/` — Drizzle schema, connexion Neon, migrations
  - [x] `packages/ui/` — 33 composants shadcn/ui communs + utils.ts
  - [x] `packages/leads/` — Types, validation Zod, scoring leads
  - [x] `packages/seo/` — Metadata, JSON-LD helpers
  - [x] `packages/config/` — ESLint, TSConfig base + Next.js, PostCSS
- [x] **Adapter les imports** dans `apps/jeanbrun/` pour utiliser les packages
  - [x] Re-exports de compatibilite : `@/lib/db` → `@repo/database`
  - [x] Re-exports de compatibilite : `@/components/ui/*` → `@repo/ui/components/*`
  - [x] Re-exports de compatibilite : `@/lib/utils` → `@repo/ui/utils`
  - [x] Re-exports de compatibilite : `@/lib/schema` → `@repo/database/schema`
- [ ] **Configurer Vercel** pour le monorepo
  - [ ] Projet Vercel `jeanbrun` → root directory `apps/jeanbrun`
  - [ ] Projet Vercel `stop-loyer` → root directory `apps/stop-loyer`
  - [ ] Variables d'environnement partagees (DB, API keys)
- [x] Verifier que le build passe pour les deux apps (`turbo build` = 2/2 success)
- [x] Verifier lint + typecheck (0 erreurs, 205 warnings import order)

### Structure cible

```
/                              ← racine monorepo
├── turbo.json
├── pnpm-workspace.yaml
├── package.json               ← devDeps: turbo
├── apps/
│   ├── jeanbrun/              → simuler-loi-jeanbrun.fr
│   │   ├── src/
│   │   ├── next.config.ts
│   │   └── package.json
│   └── stop-loyer/            → stop-loyer.fr
│       ├── src/
│       ├── next.config.ts
│       └── package.json
├── packages/
│   ├── database/              → Drizzle + Neon
│   │   ├── src/schema.ts
│   │   ├── src/db.ts
│   │   └── drizzle/
│   ├── ui/                    → Composants shadcn partages
│   ├── leads/                 → Types, validation, scoring, dispatch
│   ├── seo/                   → Metadata, JSON-LD, sitemap
│   └── config/                → ESLint, TSConfig, Tailwind
└── docs/                      → Documentation (inchangee)
```

---

## Phase 1 — Nettoyage Code ⬜

**Objectif :** Supprimer tout le code lie a l'ancien modele economique (packs, paiement, fonctionnalites premium) pour repartir sur une base propre.

### Taches

- [ ] Supprimer l'integration **Stripe** (checkout, webhooks, customer portal, plans/quotas)
  - [ ] Retirer `stripe` et `@stripe/stripe-js` des dependances
  - [ ] Supprimer les routes API `/api/webhooks/stripe/`, `/api/checkout/`
  - [ ] Supprimer les composants pricing/checkout
  - [ ] Retirer les variables d'environnement Stripe
- [ ] Supprimer l'integration **Calendly** (prise de RDV integree)
  - [ ] Retirer le composant embed Calendly
  - [ ] Supprimer les references Calendly dans les pages
- [ ] Supprimer le **Chat IA** (assistant conversationnel)
  - [ ] Retirer les routes API chat/streaming
  - [ ] Supprimer les composants chat UI
  - [ ] Retirer les dependances AI SDK liees au chat
- [ ] Supprimer la **generation PDF** cote client (sera refaite en Phase 4)
  - [ ] Retirer la generation PDF inline
  - [ ] Conserver le moteur de calcul simulation (reutilise)
- [ ] Supprimer les **etapes 3 a 6** du wizard si elles concernent l'ancien flow premium
  - [ ] Identifier quelles etapes sont specifiques a l'ancien modele
  - [ ] Conserver les etapes de saisie simulation (profil, projet, financement, strategie, duree, structure)
- [ ] Supprimer le systeme de **quotas/credits** utilisateur
  - [ ] Retirer la logique de decompte simulations
  - [ ] Retirer les guards/middlewares de verification quota
- [ ] Verifier que le build passe apres nettoyage (`lint` + `typecheck`)

### Fichiers concernes (a identifier)

```
src/app/api/webhooks/stripe/    → supprimer
src/app/api/checkout/           → supprimer
src/app/api/chat/               → supprimer
src/components/pricing/         → supprimer
src/components/chat/            → supprimer
src/components/calendly/        → supprimer
src/lib/stripe.*                → supprimer
src/lib/quotas.*                → supprimer
```

---

## Phase 2 — Schema DB (Leads + Partenaires) ⬜

**Objectif :** Creer les tables `leads`, `promoters`, `brokers` et adapter le schema existant (supprimer quotas, ajouter consentements).

### Taches

- [ ] **Supprimer** les tables/colonnes liees aux quotas et packs
  - [ ] Table `subscriptions` ou equivalent → supprimer
  - [ ] Colonnes `quota_*`, `plan_*` sur la table users → supprimer
- [ ] **Creer table `leads`**
  - [ ] `id` (UUID, PK)
  - [ ] `created_at` (timestamp)
  - [ ] `platform` (enum: `jeanbrun` | `stop-loyer`)
  - [ ] `source_page`, `utm_source`, `utm_medium`, `utm_campaign` (varchar)
  - [ ] `email`, `phone`, `first_name`, `last_name` (varchar)
  - [ ] `consent_promoter` (boolean, default false)
  - [ ] `consent_broker` (boolean, default false)
  - [ ] `consent_newsletter` (boolean, default false)
  - [ ] `consent_date` (timestamp)
  - [ ] `simulation_data` (JSONB — resultat complet de la simulation)
  - [ ] `score` (integer 0-100 — qualite du lead)
  - [ ] `dispatched_promoter_at` (timestamp, nullable)
  - [ ] `dispatched_broker_at` (timestamp, nullable)
  - [ ] `promoter_id` (FK → promoters, nullable)
  - [ ] `broker_id` (FK → brokers, nullable)
  - [ ] `status` (enum: `new` | `dispatched` | `contacted` | `converted` | `lost`)
  - [ ] `converted_at` (timestamp, nullable)
  - [ ] `revenue_promoter`, `revenue_broker` (decimal, nullable)
- [ ] **Creer table `promoters`**
  - [ ] `id` (UUID, PK)
  - [ ] `name`, `contact_name`, `contact_email`, `contact_phone` (varchar)
  - [ ] `convention_signed_at` (date)
  - [ ] `pricing_model` (enum: `per_lead` | `commission` | `hybrid`)
  - [ ] `price_per_lead` (decimal, nullable)
  - [ ] `commission_rate` (decimal, nullable)
  - [ ] `zones` (text array — zones geographiques couvertes)
  - [ ] `active` (boolean, default true)
- [ ] **Creer table `brokers`**
  - [ ] `id` (UUID, PK)
  - [ ] `name`, `contact_name`, `contact_email`, `contact_phone` (varchar)
  - [ ] `contract_signed_at` (date)
  - [ ] `price_per_lead` (decimal)
  - [ ] `zones` (text array)
  - [ ] `active` (boolean, default true)
- [ ] **Adapter table `programs`** (existante)
  - [ ] Ajouter `promoter_id` (FK → promoters)
  - [ ] Ajouter `eligible_jeanbrun` (boolean)
  - [ ] Ajouter `eligible_ptz` (boolean)
  - [ ] Ajouter `authorized` (boolean, default false) — programme visible seulement si true
- [ ] **Creer les index**
  - [ ] `idx_leads_platform` (platform)
  - [ ] `idx_leads_status` (status)
  - [ ] `idx_leads_created` (created_at DESC)
  - [ ] `idx_programs_city` (city)
  - [ ] `idx_programs_zone` (zone)
- [ ] Generer et appliquer la migration Drizzle
- [ ] Verifier build + typecheck

---

## Phase 3 — Simplification Wizard ⬜

**Objectif :** Transformer le flow en 2 temps : simulation gratuite complete → capture lead sur la page resultats. Le wizard de saisie reste inchange (6 etapes Jeanbrun, 3 etapes PTZ).

### Taches

- [ ] **Retirer toute gate d'inscription** avant la simulation
  - [ ] Supprimer les redirections vers login/signup pendant le wizard
  - [ ] Rendre le wizard 100% accessible sans compte
- [ ] **Nettoyer les etapes wizard** Jeanbrun
  - [ ] Conserver : profil investisseur, projet immobilier, financement, strategie locative, duree/sortie, structure juridique
  - [ ] Supprimer : toute etape liee aux packs/credits/paiement
  - [ ] Verifier que la navigation entre etapes fonctionne apres suppression
- [ ] **Preparer le flow PTZ** (stop-loyer.fr, Phase 4+ du produit global)
  - [ ] Documenter les 3 etapes : situation personnelle, projet immobilier, capacite financiere
  - [ ] Identifier les composants reutilisables du wizard Jeanbrun
- [ ] **Rediriger la derniere etape** vers la nouvelle page resultats (Phase 4)
  - [ ] Au lieu de generer un PDF ou afficher un dashboard, rediriger vers `/resultats`
- [ ] Verifier build + tests

---

## Phase 4 — Page Resultats (Teaser + Lead Gate) ⬜

**Objectif :** Creer la page resultats avec teaser gratuit, lead gate inline, et mise en avant de l'avantage client (direct promoteur, tarifs directs, offres speciales).

### Taches

- [ ] **Creer la route `/resultats`** (ou `/simulation/resultats`)
- [ ] **Section teaser gratuit** (affichee immediatement, sans inscription)
  - [ ] Economie d'impot annuelle estimee
  - [ ] ROI attendu (TRI)
  - [ ] Effort d'epargne mensuel
  - [ ] Comparatif rapide : Jeanbrun vs LMNP vs Nue-propriete
  - [ ] Graphique synthetique annee par annee (Recharts)
- [ ] **Section avantage client "Direct Promoteur"**
  - [ ] Bloc visuel mettant en avant : "Travaillez directement avec le promoteur"
  - [ ] Tarifs promoteurs directs (pas d'intermediaire, pas de marge supplementaire)
  - [ ] Offres speciales : frais de notaire offerts, remises commerciales, prestations incluses
  - [ ] Badge/tag sur les programmes avec offres speciales en cours
  - [ ] Message clair : "Aucune commission ne s'ajoute a votre prix d'achat"
- [ ] **Lead gate inline** (formulaire dans la page, pas un modal)
  - [ ] Champs : email, telephone, prenom, nom
  - [ ] Checkbox 1 : consentement promoteur (texte RGPD specifique)
  - [ ] Checkbox 2 : consentement courtier (texte RGPD specifique, **separe**)
  - [ ] Checkbox 3 : consentement newsletter
  - [ ] CTA : "Recevoir mon rapport gratuit"
  - [ ] Wording accrocheur : "Pour recevoir votre rapport complet GRATUIT avec les programmes eligibles dans votre zone et une estimation de financement personnalisee"
- [ ] **Apres soumission du lead gate**
  - [ ] Stocker le lead en base (table `leads`) avec `simulation_data` JSONB
  - [ ] Calculer le score qualite (0-100)
  - [ ] Afficher un message de confirmation
  - [ ] Declencher l'envoi du rapport PDF par email (async)
- [ ] **Generation rapport PDF** (version refaite)
  - [ ] Tableau detaille annee par annee
  - [ ] Programmes eligibles dans la zone (si partenariat actif)
  - [ ] Estimation financement personnalisee
  - [ ] Mention de l'avantage direct promoteur et offres speciales disponibles
  - [ ] Envoi via Mailjet/Resend
- [ ] Verifier build + tests

---

## Phase 5 — API Leads + Notifications ⬜

**Objectif :** Implementer le dispatch automatique des leads vers les promoteurs et courtiers (API + emails de notification separes).

### Taches

- [ ] **API interne leads**
  - [ ] `POST /api/leads` — creation lead (depuis le lead gate)
  - [ ] `GET /api/leads` — liste leads (admin, avec filtres)
  - [ ] `GET /api/leads/:id` — detail lead
  - [ ] `PATCH /api/leads/:id` — mise a jour statut
  - [ ] Validation Zod sur tous les endpoints
  - [ ] Authentification bearer token
- [ ] **Dispatch promoteur** (si `consent_promoter === true`)
  - [ ] Identifier le promoteur cible selon la zone du lead et les programmes actifs
  - [ ] Envoyer email notification au promoteur avec :
    - Contact prospect (nom, email, telephone)
    - Resume simulation (TMI, budget, zone, ROI calcule)
    - Type de bien recherche
    - Mention : "Le prospect souhaite etre contacte directement pour beneficier de vos tarifs directs et offres en cours"
  - [ ] Mettre a jour `dispatched_promoter_at` et `promoter_id` sur le lead
- [ ] **Dispatch courtier** (si `consent_broker === true`, **independant du promoteur**)
  - [ ] Identifier le courtier cible selon la zone du lead
  - [ ] Envoyer email notification au courtier avec :
    - Contact prospect (nom, email, telephone)
    - Revenus mensuels nets du foyer
    - Apport disponible
    - Budget projet
    - Zone geographique
    - Capacite d'emprunt estimee (Jeanbrun) OU eligibilite PTZ confirmee (Stop-Loyer)
    - Composition du foyer
  - [ ] Mettre a jour `dispatched_broker_at` et `broker_id` sur le lead
- [ ] **Templates email distincts**
  - [ ] Template promoteur : focus projet immobilier + simulation + avantage relation directe
  - [ ] Template courtier : focus capacite financiere + eligibilite
  - [ ] Template prospect : rapport PDF + confirmation + mention des partenaires contactes
- [ ] **Rate limiting**
  - [ ] Limiter la creation de leads (anti-spam) : 5 leads/IP/heure
  - [ ] Limiter les appels API admin : 100 req/min
- [ ] **Dashboard admin** (page interne)
  - [ ] Liste leads avec colonnes : date, plateforme, nom, email, score, statut, dispatche promoteur, dispatche courtier
  - [ ] Filtres : plateforme, statut, date range, score min
  - [ ] Detail lead : historique complet + donnees simulation
  - [ ] Suivi revenus : CA par promoteur, CA par courtier
- [ ] Verifier build + tests

---

## Phase 6 — Visibilite Programmes ⬜

**Objectif :** S'assurer qu'aucun programme scrape n'est visible sans autorisation ecrite du promoteur. Seuls les programmes avec `authorized === true` sont affiches.

### Taches

- [ ] **Filtre `authorized` sur toutes les requetes programmes**
  - [ ] Ajouter `WHERE authorized = true` sur toutes les requetes publiques
  - [ ] Les programmes non autorises restent en base (donnees internes) mais invisibles cote front
- [ ] **Flag `authorized` sur les programmes existants**
  - [ ] Mettre `authorized = false` sur tous les programmes scrapes actuels
  - [ ] Seuls les programmes avec convention signee passent a `true`
- [ ] **Programme fictif de demonstration**
  - [ ] Creer un programme "Les Jardins du Parc" avec typologies realistes
  - [ ] Marquer comme `authorized = true`
  - [ ] Utiliser pour les demos commerciales aux promoteurs
- [ ] **Affichage offres speciales sur les programmes autorises**
  - [ ] Champ `special_offers` (JSONB) sur la table programmes
  - [ ] Exemples : `{ "frais_notaire_offerts": true, "remise_commerciale": "5%", "cuisine_equipee": true }`
  - [ ] Badge visuel sur les cards programmes : "Frais de notaire offerts", "Offre speciale"
- [ ] **Page programme detail**
  - [ ] Typologies (T1-T5) avec prix, surfaces, etages
  - [ ] Eligibilite Jeanbrun et/ou PTZ par lot
  - [ ] Offres speciales en cours (badges)
  - [ ] CTA : "Simuler ce programme" → pre-remplit le wizard
  - [ ] Mention : "En direct avec le promoteur, sans intermediaire"
- [ ] **Audit complet** : verifier qu'aucune route/page n'affiche de programme non autorise
- [ ] Verifier build + tests

---

## Validation Finale

- [ ] Monorepo Turborepo operationnel (2 apps + packages partages)
- [ ] Les 6 phases sont implementees et deployees
- [ ] Build passe (`lint` + `typecheck` + `tests`)
- [ ] Aucun programme scrape visible sans autorisation
- [ ] Lead gate fonctionnel avec 3 consentements independants
- [ ] Dispatch promoteur et courtier operationnels et separes
- [ ] Avantage client (direct promoteur, tarifs directs, offres speciales) visible a chaque point de contact
- [ ] RGPD : politique de confidentialite, registre, retention 36 mois
- [ ] Dashboard admin leads fonctionnel

---

## Notes Techniques

### Monetisation Double par Visiteur

```
Visiteur → Simulation gratuite → Teaser resultats
                                       │
                                  Lead Gate
                                 (3 consentements)
                                       │
                         ┌─────────────┼─────────────┐
                         ▼             ▼             ▼
                    Promoteur      Courtier      Newsletter
                    (100-200EUR)    (40-80EUR)     (nurturing)
                         │             │
                         ▼             ▼
                  Contact direct   Proposition
                  + tarifs directs financement
                  + offres speciales
```

### Avantage Client — Points de Communication

| Point de contact | Message |
|-----------------|---------|
| Page resultats (teaser) | "Beneficiez des tarifs promoteurs directs, sans intermediaire" |
| Lead gate (wording) | "Recevez les offres speciales en cours (frais de notaire offerts...)" |
| Rapport PDF | Section "Vos avantages" : relation directe, tarifs directs, offres speciales |
| Email confirmation prospect | Rappel des avantages du contact direct promoteur |
| Card programme | Badge "Frais de notaire offerts" / "Offre speciale" |
| Page programme detail | "En direct avec le promoteur, sans intermediaire" |

### Stack Cible

| Composant | Technologie |
|-----------|-------------|
| Monorepo | Turborepo + pnpm workspaces |
| Frontend | Next.js 16 + React 19 + Tailwind v4 |
| Base de donnees | Neon PostgreSQL + Drizzle ORM (package partage) |
| Email transactionnel | Mailjet ou Resend |
| PDF | React-PDF ou Puppeteer |
| Auth (admin) | Better Auth |
| Deploiement | Vercel (2 projets : jeanbrun + stop-loyer) |
| Analytics | PostHog |

---

*Derniere mise a jour : 6 fevrier 2026*
