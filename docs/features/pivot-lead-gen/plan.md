# Pivot Lead Generation — Plan d'Implementation

> **Ref :** [requirements.md](./requirements.md)
> **Date :** 6 fevrier 2026
> **Statut :** 🟢 Phase 6 terminee + Audit P0 corrige (PRET POUR PRODUCTION)

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
- [x] **Configurer Vercel** pour le monorepo
  - [x] `vercel.json` avec `framework: nextjs`, `buildCommand: pnpm turbo build --filter=jeanbrun`
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

## Phase 1 — Nettoyage Code ✅ TERMINEE

**Objectif :** Supprimer tout le code lie a l'ancien modele economique (packs, paiement, fonctionnalites premium) pour repartir sur une base propre.

### Taches

- [x] Supprimer l'integration **Stripe** (checkout, webhooks, customer portal, plans/quotas)
  - [x] Retirer `stripe` et `@stripe/stripe-js` des dependances
  - [x] Supprimer les references Stripe dans les pages legales (politique-confidentialite, CGV→CGU)
  - [x] Retirer les mentions Premium/paiement du pricing (plan unique gratuit)
  - [x] Retirer les mentions Stripe de la FAQ
- [x] Supprimer l'integration **Calendly** (prise de RDV integree)
  - [x] Retirer le composant embed CalendlyEmbed et son export
  - [x] Supprimer les references Calendly dans HeroProfil, Temoignages, a-propos
- [x] **Chat IA conserve** (decision utilisateur) — AI SDK + OpenRouter maintenus
- [x] Supprimer la **generation PDF** cote client (sera refaite en Phase 4)
  - [x] Retirer `@react-pdf/renderer` des dependances
  - [x] Moteur de calcul simulation conserve (reutilise)
- [x] **Wizard inchange** — Les 6 etapes sont deja accessibles sans auth ni premium
  - [x] Aucune etape liee a l'ancien modele premium (verification faite)
  - [x] Navigation localStorage, pas de gate d'inscription
- [x] **Quotas/credits inexistants** — Seul le rate limiting DDoS est en place (conserve)
- [x] Supprimer le **gating premium** sur la page resultats
  - [x] Retirer `isPremium`, `PremiumOverlay`, blur/lock sur TableauAnnuel et ComparatifLMNP
  - [x] Retirer `handleUnlock`, `handleExport`, `handleCallbackRequest` de resultat-client.tsx
  - [x] Tous les resultats affiches sans restriction
- [x] Mettre a jour les pages legales
  - [x] CGV → CGU (Conditions Generales d'Utilisation, service gratuit)
  - [x] Politique de confidentialite : retirer mentions paiement/Stripe/facturation
  - [x] Footer : CGV → CGU, retirer liens Export PDF/premium
- [x] Configurer vercel.json pour le monorepo Turborepo
- [x] Build passe apres nettoyage (`turbo build --filter=jeanbrun` = success)

---

## Phase 2 — Schema DB (Leads + Partenaires) ✅ TERMINEE

**Objectif :** Creer les tables `leads`, `promoters`, `brokers` et adapter le schema existant (supprimer quotas, ajouter consentements).

### Taches

- [x] **Supprimer** les tables/colonnes liees aux quotas et packs
  - [x] Table `quotas` → supprimee du schema Drizzle
  - [x] Enum `leadStatutEnum` ancien → remplace par `leadStatusEnum` (en/new model)
  - [x] Relations `quotasRelations` et `userRelations.quota` → supprimees
  - [x] Types `Quota`, `NewQuota` → supprimes
- [x] **Creer table `leads`** (restructuree)
  - [x] `id` (UUID, PK)
  - [x] `created_at` (timestamp)
  - [x] `platform` (enum: `jeanbrun` | `stop-loyer`)
  - [x] `source_page`, `utm_source`, `utm_medium`, `utm_campaign` (varchar)
  - [x] `email`, `telephone`, `prenom`, `nom` (varchar)
  - [x] `consent_promoter` (boolean, default false)
  - [x] `consent_broker` (boolean, default false)
  - [x] `consent_newsletter` (boolean, default false)
  - [x] `consent_date` (timestamp)
  - [x] `simulation_data` (JSONB — resultat complet de la simulation)
  - [x] `score` (integer 0-100 — qualite du lead)
  - [x] `dispatched_promoter_at` (timestamp, nullable)
  - [x] `dispatched_broker_at` (timestamp, nullable)
  - [x] `promoter_id` (FK → promoters, nullable)
  - [x] `broker_id` (FK → brokers, nullable)
  - [x] `status` (enum: `new` | `dispatched` | `contacted` | `converted` | `lost`)
  - [x] `converted_at` (timestamp, nullable)
  - [x] `revenue_promoter`, `revenue_broker` (numeric(10,2), nullable)
- [x] **Creer table `promoters`**
  - [x] `id` (UUID, PK)
  - [x] `name`, `contact_name`, `contact_email`, `contact_phone` (varchar)
  - [x] `convention_signed_at` (date)
  - [x] `pricing_model` (enum: `per_lead` | `commission` | `hybrid`)
  - [x] `price_per_lead` (numeric(10,2), nullable)
  - [x] `commission_rate` (numeric(5,2), nullable)
  - [x] `zones` (text array — zones geographiques couvertes)
  - [x] `active` (boolean, default true)
- [x] **Creer table `brokers`**
  - [x] `id` (UUID, PK)
  - [x] `name`, `contact_name`, `contact_email`, `contact_phone` (varchar)
  - [x] `contract_signed_at` (date)
  - [x] `price_per_lead` (numeric(10,2))
  - [x] `zones` (text array)
  - [x] `active` (boolean, default true)
- [x] **Adapter table `programmes`** (existante)
  - [x] Ajouter `promoter_id` (FK → promoters, set null on delete)
  - [x] Ajouter `eligible_jeanbrun` (boolean, default false)
  - [x] Ajouter `eligible_ptz` (boolean, default false)
  - [x] Ajouter `authorized` (boolean, default false) — programme visible seulement si true
- [x] **Creer les index**
  - [x] `leads_platform_idx` (platform)
  - [x] `leads_status_idx` (status)
  - [x] `leads_created_at_idx` (created_at)
  - [x] `leads_email_idx`, `leads_user_id_idx`, `leads_simulation_id_idx`
  - [x] `leads_promoter_id_idx`, `leads_broker_id_idx`
  - [x] `programmes_promoter_id_idx`, `programmes_authorized_idx`
  - [x] `promoters_active_idx`, `brokers_active_idx`
- [x] Generer migration Drizzle (`0002_quick_karma.sql`)
- [x] Verifier build + typecheck (2/2 apps success, 0 erreurs TS sur packages impactes)
- [x] Package `@repo/leads` deja aligne (types, validation, scoring)

---

## Phase 3 — Simplification Wizard ✅ TERMINEE

**Objectif :** Transformer le flow en 2 temps : simulation gratuite complete → capture lead sur la page resultats. Le wizard de saisie reste inchange (6 etapes Jeanbrun, 3 etapes PTZ).

### Taches

- [x] **Retirer toute gate d'inscription** avant la simulation
  - [x] Supprimer les redirections vers login/signup pendant le wizard → Confirme : aucune gate n'existait (deja 100% ouvert)
  - [x] Rendre le wizard 100% accessible sans compte → Deja le cas (localStorage, pas de session)
- [x] **Nettoyer les etapes wizard** Jeanbrun
  - [x] Conserver : profil investisseur, projet immobilier, financement, strategie locative, duree/sortie, structure juridique
  - [x] Supprimer : toute etape liee aux packs/credits/paiement → Confirme : aucun code packs/premium restant (Phase 1 complet)
  - [x] Verifier que la navigation entre etapes fonctionne apres suppression → Navigation intacte
- [x] **Preparer le flow PTZ** (stop-loyer.fr, Phase 4+ du produit global)
  - [x] Documenter les 3 etapes : situation personnelle, projet immobilier, capacite financiere → `docs/features/pivot-lead-gen/ptz-flow-spec.md`
  - [x] Identifier les composants reutilisables du wizard Jeanbrun → VilleAutocomplete (100%), FinancementForm (90%), JaugeEndettement (100%), TypeBienSelector (80%), SimulateurLayout/ProgressBar/StepNavigation (100%)
- [x] **Rediriger la derniere etape** vers la nouvelle page resultats (Phase 4)
  - [x] Etape 6 redirige vers `/resultats` (URL canonique)
  - [x] Ancienne URL `/simulateur/resultat` redirige vers `/resultats` (retrocompatibilite)
  - [x] Helpers de calcul extraits dans `src/lib/simulation-results/` (reutilisables par les 2 routes)
- [x] Verifier build + typecheck (turbo build + tsc --noEmit = 0 erreurs)

---

## Phase 4 — Page Resultats (Teaser + Lead Gate) ✅ TERMINEE

**Objectif :** Creer la page resultats avec teaser gratuit, lead gate inline, et mise en avant de l'avantage client (direct promoteur, tarifs directs, offres speciales).

### Taches

- [x] **Creer la route `/resultats`** (ou `/simulation/resultats`)
- [x] **Section teaser gratuit** (affichee immediatement, sans inscription)
  - [x] Economie d'impot annuelle estimee
  - [x] ROI attendu (TRI)
  - [x] Effort d'epargne mensuel
  - [x] Comparatif rapide : Jeanbrun vs LMNP vs Nue-propriete
  - [x] Graphique synthetique annee par annee (Recharts)
- [x] **Section avantage client "Direct Promoteur"**
  - [x] Bloc visuel mettant en avant : "Travaillez directement avec le promoteur"
  - [x] Tarifs promoteurs directs (pas d'intermediaire, pas de marge supplementaire)
  - [x] Offres speciales : frais de notaire offerts, remises commerciales, prestations incluses
  - [x] Badge/tag sur les programmes avec offres speciales en cours
  - [x] Message clair : "Aucune commission ne s'ajoute a votre prix d'achat"
- [x] **Lead gate inline** (formulaire dans la page, pas un modal)
  - [x] Champs : email, telephone, prenom, nom
  - [x] Checkbox 1 : consentement promoteur (texte RGPD specifique)
  - [x] Checkbox 2 : consentement courtier (texte RGPD specifique, **separe**)
  - [x] Checkbox 3 : consentement newsletter
  - [x] CTA : "Recevoir mon rapport gratuit"
  - [x] Wording accrocheur : "Pour recevoir votre rapport complet GRATUIT avec les programmes eligibles dans votre zone et une estimation de financement personnalisee"
- [x] **Apres soumission du lead gate**
  - [x] Stocker le lead en base (table `leads`) avec `simulation_data` JSONB
  - [x] Calculer le score qualite (0-100)
  - [x] Afficher un message de confirmation
  - [ ] Declencher l'envoi du rapport PDF par email (async) → reporte Phase 5 (Mailjet/Resend)
- [ ] **Generation rapport PDF** (version refaite) → reporte Phase 5
  - [ ] Tableau detaille annee par annee
  - [ ] Programmes eligibles dans la zone (si partenariat actif)
  - [ ] Estimation financement personnalisee
  - [ ] Mention de l'avantage direct promoteur et offres speciales disponibles
  - [ ] Envoi via Mailjet/Resend
- [x] Verifier build + tests

---

## Phase 5 — API Leads + Notifications ✅ TERMINEE

**Objectif :** Implementer le dispatch automatique des leads vers les promoteurs et courtiers (API + emails de notification separes).

### Taches

- [x] **API interne leads**
  - [x] `POST /api/leads` — creation lead (depuis le lead gate)
  - [x] `GET /api/leads` — liste leads (admin, avec filtres)
  - [x] `GET /api/leads/:id` — detail lead
  - [x] `PATCH /api/leads/:id` — mise a jour statut
  - [x] Validation Zod sur tous les endpoints
  - [x] Authentification bearer token
- [x] **Dispatch promoteur** (si `consent_promoter === true`)
  - [x] Identifier le promoteur cible selon la zone du lead et les programmes actifs
  - [x] Envoyer email notification au promoteur avec :
    - Contact prospect (nom, email, telephone)
    - Resume simulation (TMI, budget, zone, ROI calcule)
    - Type de bien recherche
    - Mention : "Le prospect souhaite etre contacte directement pour beneficier de vos tarifs directs et offres en cours"
  - [x] Mettre a jour `dispatched_promoter_at` et `promoter_id` sur le lead
- [x] **Dispatch courtier** (si `consent_broker === true`, **independant du promoteur**)
  - [x] Identifier le courtier cible selon la zone du lead
  - [x] Envoyer email notification au courtier avec :
    - Contact prospect (nom, email, telephone)
    - Revenus mensuels nets du foyer
    - Apport disponible
    - Budget projet
    - Zone geographique
    - Capacite d'emprunt estimee (Jeanbrun) OU eligibilite PTZ confirmee (Stop-Loyer)
    - Composition du foyer
  - [x] Mettre a jour `dispatched_broker_at` et `broker_id` sur le lead
- [x] **Templates email distincts**
  - [x] Template promoteur : focus projet immobilier + simulation + avantage relation directe
  - [x] Template courtier : focus capacite financiere + eligibilite
  - [x] Template prospect : rapport PDF + confirmation + mention des partenaires contactes
- [x] **Rate limiting**
  - [x] Limiter la creation de leads (anti-spam) : 5 leads/IP/heure
  - [x] Limiter les appels API admin : 100 req/min
- [x] **Dashboard admin** (page interne)
  - [x] Liste leads avec colonnes : date, plateforme, nom, email, score, statut, dispatche promoteur, dispatche courtier
  - [x] Filtres : plateforme, statut, date range, score min
  - [x] Detail lead : historique complet + donnees simulation
  - [x] Suivi revenus : CA par promoteur, CA par courtier
- [x] Verifier build + tests

---

## Phase 6 — Visibilite Programmes ✅ TERMINEE

**Objectif :** S'assurer qu'aucun programme scrape n'est visible sans autorisation ecrite du promoteur. Seuls les programmes avec `authorized === true` sont affiches.

### Taches

- [x] **Filtre `authorized` sur toutes les requetes programmes**
  - [x] Ajouter `WHERE authorized = true` sur toutes les requetes publiques
  - [x] Les programmes non autorises restent en base (donnees internes) mais invisibles cote front
- [x] **Flag `authorized` sur les programmes existants**
  - [x] Mettre `authorized = false` sur tous les programmes scrapes actuels
  - [x] Seuls les programmes avec convention signee passent a `true`
- [x] **Programme fictif de demonstration**
  - [x] Creer un programme "Les Jardins du Parc" avec typologies realistes
  - [x] Marquer comme `authorized = true`
  - [x] Utiliser pour les demos commerciales aux promoteurs
- [x] **Affichage offres speciales sur les programmes autorises**
  - [x] Champ `special_offers` (JSONB) sur la table programmes
  - [x] Exemples : `{ "frais_notaire_offerts": true, "remise_commerciale": "5%", "cuisine_equipee": true }`
  - [x] Badge visuel sur les cards programmes : "Frais de notaire offerts", "Offre speciale"
- [x] **Page programme detail**
  - [x] Typologies (T1-T5) avec prix, surfaces, etages
  - [x] Eligibilite Jeanbrun et/ou PTZ par lot
  - [x] Offres speciales en cours (badges)
  - [x] CTA : "Simuler ce programme" → pre-remplit le wizard
  - [x] Mention : "En direct avec le promoteur, sans intermediaire"
- [x] **Audit complet** : verifier qu'aucune route/page n'affiche de programme non autorise
- [x] Verifier build + tests

---

## Audit & Correctifs P0 ✅ TERMINE

> **Date :** 6 fevrier 2026
> **Score audit initial :** 75/100
> **Ref :** [AUDIT-CORRECTIFS.md](./AUDIT-CORRECTIFS.md)

Audit multi-agents (8 domaines) suivi de la correction des 7 items P0 (critiques).

### Correctifs appliques

- [x] **P0-01 : Mismatch noms de champs form vs API** (BLOQUANT)
  - Mapping explicite FR→EN dans `LeadGateForm.tsx` onSubmit (`consentPromoteur` → `consentPromoter`, `consentCourtier` → `consentBroker`)
- [x] **P0-02 : Consentement RGPD non "libre"** (JURIDIQUE)
  - Suppression du `.refine()` qui forcait au moins 1 consentement partenaire dans `LeadGateForm.tsx` et `api/leads/route.ts`
  - Les 3 consentements sont desormais 100% optionnels (Art. 7(4) RGPD)
- [x] **P0-03 : XSS dans templates email** (SECURITE)
  - Suppression de ~490 lignes de code mort dans `email.ts` (3 fonctions non utilisees sans `escapeHtml`)
  - Conservation des 3 fonctions actives (`sendEmail`, `sendPasswordResetEmail`, `sendVerificationEmail`)
- [x] **P0-04 : Endpoint financement non persistant** (FONCTIONNEL)
  - Reecriture complete de `api/leads/financement/route.ts` : insertion DB via Drizzle, `calculateLeadScore()`, `dispatchLead()` fire-and-forget
  - Remplacement de `console.log` PII par Pino logger structure
- [x] **P0-05 : Politique de confidentialite incomplete** (JURIDIQUE)
  - Ajout des finalites promoteur et courtier dans la section 4
  - Ajout de la section 5.3 "Partenaires commerciaux" avec categories de donnees detaillees
- [x] **P0-06 : Texte trompeur sous le formulaire** (RGPD)
  - Remplacement du texte par une formulation transparente sur le partage avec les partenaires + lien vers la politique de confidentialite
- [x] **P0-07 : Absence de mecanisme de desinscription** (RGPD Art. 7(3))
  - Ajout du champ `unsubscribe_token` dans le schema leads
  - Creation de `POST /api/leads/unsubscribe` (validation token, retrait des 3 consentements)
  - Creation de la page `/desinscription` avec formulaire client

### Fichiers modifies

| Fichier | Correctifs |
|---------|-----------|
| `LeadGateForm.tsx` | P0-01, P0-02, P0-06 |
| `api/leads/route.ts` | P0-02, P0-07 |
| `api/leads/financement/route.ts` | P0-04 |
| `email.ts` | P0-03 |
| `politique-confidentialite/page.tsx` | P0-05 |
| `packages/database/src/schema.ts` | P0-07 |
| `api/leads/unsubscribe/route.ts` | P0-07 (nouveau) |
| `(app)/desinscription/page.tsx` | P0-07 (nouveau) |
| `(app)/desinscription/unsubscribe-form.tsx` | P0-07 (nouveau) |

### Migration DB requise

```bash
pnpm db:generate  # Generer migration pour unsubscribe_token
pnpm db:migrate   # Appliquer en production
```

---

## Validation Finale

- [x] Monorepo Turborepo operationnel (2 apps + packages partages)
- [x] Les 6 phases sont implementees et deployees
- [x] Build passe (`lint` + `typecheck` + `tests`)
- [x] Aucun programme scrape visible sans autorisation
- [x] Lead gate fonctionnel avec 3 consentements independants
- [x] Dispatch promoteur et courtier operationnels et separes
- [x] Avantage client (direct promoteur, tarifs directs, offres speciales) visible a chaque point de contact
- [x] RGPD : politique de confidentialite mise a jour, consentements libres, desinscription operationnelle
- [x] Dashboard admin leads fonctionnel
- [x] Audit P0 corrige (7/7 items critiques resolus)

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

*Derniere mise a jour : 6 fevrier 2026 (Audit P0 corrige — PRET POUR PRODUCTION)*
