# Checklist - Simulateur Loi Jeanbrun

**Version:** 1.1
**Dernière mise à jour:** 30 janvier 2026

---

## Vue d'ensemble

| Sprint | Focus | Status | Progression |
|--------|-------|--------|-------------|
| **Sprint 1** | Infrastructure | 🟡 En cours | 70% |
| **Sprint 2** | Moteur de calcul | ⬜ À faire | 0% |
| **Sprint 3** | Interface simulateur | ⬜ À faire | 0% |
| **Sprint 4** | Pages SEO | ⬜ À faire | 0% |
| **Sprint 5** | Monétisation | ⬜ À faire | 0% |
| **Sprint 6** | Deploy & Tests | ⬜ À faire | 0% |

---

## Sprint 1 — Infrastructure

**Dates:** 03-14 Février 2026
**Objectif:** Environnement de développement fonctionnel (Vercel + Neon)

### Features terminées ✅

| Feature | Notes |
|---------|-------|
| Setup Next.js 16 + TypeScript | App Router, Turbopack |
| Tailwind CSS v4 + shadcn/ui | 16 composants de base |
| Neon PostgreSQL + Drizzle ORM | Schema Better Auth |
| Better Auth | Email/password + email verification |
| Déploiement Vercel | https://simulateur-loi-jeanbrun.vercel.app |
| GitHub Actions CI/CD | Build + lint automatique |
| Entités EspoCRM Jeanbrun | CJeanbrunVille (51), CJeanbrunProgramme (0) |

### Features en cours 🟡

| Feature | Status | Plan |
|---------|--------|------|
| Schéma DB complet | À faire | `docs/features/infrastructure/plan.md` |
| Client API EspoCRM | À faire | `docs/features/infrastructure/plan.md` |
| Pages légales | À faire | `docs/features/infrastructure/plan.md` |
| REGISTRE-RGPD.md | À faire | `docs/features/infrastructure/plan.md` |

### Validation Sprint 1

- [x] `pnpm dev` démarre sans erreur
- [x] `pnpm build:ci` produit un build de production
- [x] `pnpm check` (lint + typecheck) passe
- [x] Déploiement Vercel fonctionnel
- [x] Connexion Neon PostgreSQL OK
- [x] Better Auth fonctionnel (login, register, forgot, reset)
- [ ] Schéma Drizzle complet (10 tables)
- [ ] Client API EspoCRM fonctionnel
- [ ] Pages légales publiées
- [ ] REGISTRE-RGPD.md créé

---

## Sprint 2 — Moteur de calcul

**Dates:** 17-28 Février 2026
**Objectif:** Tous les calculs fiscaux implémentés et testés à 90%+

### Features

| Feature | Status | Notes |
|---------|--------|-------|
| Module IR 2026 | ⬜ À faire | Tranches, décote, plafonnement QF |
| Module TMI automatique | ⬜ À faire | Calcul depuis revenus |
| Module Jeanbrun neuf | ⬜ À faire | Amortissement 2%/an sur 50 ans |
| Module Jeanbrun ancien | ⬜ À faire | Travaux déductibles 300k |
| Module déficit foncier | ⬜ À faire | Report 10 ans, plafond bonifié |
| Module crédit immobilier | ⬜ À faire | Mensualités, tableau amortissement |
| Module plus-value | ⬜ À faire | Abattements durée détention |
| Module LMNP comparatif | ⬜ À faire | Micro-BIC, réel |
| Module rendements | ⬜ À faire | Brut, net, net-net |
| Orchestrateur simulation | ⬜ À faire | Coordination modules |
| Tests unitaires | ⬜ À faire | 90%+ coverage |

### Validation Sprint 2

- [ ] Tous les modules créés dans `/src/lib/calculs/`
- [ ] Tests unitaires passent (Jest)
- [ ] Coverage > 90%
- [ ] Formules validées vs exemples manuels

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

## Sprint 4 — Pages SEO

**Dates:** 17-28 Mars 2026
**Objectif:** 50 pages villes indexables avec programmes

### Features

| Feature | Status | Notes |
|---------|--------|-------|
| Template `/villes/[slug]` | ⬜ À faire | SSG avec generateStaticParams |
| Composant DonneesMarche | ⬜ À faire | Prix m², loyers, tendances |
| Composant PlafondsJeanbrun | ⬜ À faire | Loyers, prix par zone |
| Composant ProgrammesList | ⬜ À faire | Top 3 programmes par ville |
| Composant SimulateurPreRempli | ⬜ À faire | CTA vers simulateur |
| Import données DVF | ⬜ À faire | Prix ventes par commune |
| Import données loyers | ⬜ À faire | Observatoire loyers |
| Metadata SEO dynamiques | ⬜ À faire | Title, description, OG |
| Sitemap.xml | ⬜ À faire | 50 URLs villes |

### Validation Sprint 4

- [ ] 50 pages générées en SSG
- [ ] Données marché affichées
- [ ] Programmes neufs depuis EspoCRM
- [ ] Lighthouse SEO > 90

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

## Tâches externes (Moltbot)

| Tâche | Status | Responsable |
|-------|--------|-------------|
| Créer entité CJeanbrunVille | ✅ Terminé | Admin EspoCRM |
| Créer entité CJeanbrunProgramme | ✅ Terminé | Admin EspoCRM |
| Importer 51 villes (A_bis, A, B1) | ✅ Terminé | Admin EspoCRM |
| Générer API key jeanbrun | ✅ Terminé | Admin EspoCRM |
| SSH VPS CardImmo configuré | ✅ Terminé (30/01) | Claude + Moltbot |
| Créer skill Moltbot scraping | ✅ Terminé | Moltbot |
| Premier scraping test (Liberty - Nancy) | ✅ Terminé (30/01) | Moltbot |
| Scraping 51 villes complet | 🟡 En cours | Moltbot |

---

## Légende

| Symbole | Signification |
|---------|---------------|
| ✅ | Terminé |
| 🟡 | En cours |
| ⬜ | À faire |
| ❌ | Bloqué |

---

## Features actives

| Feature | Sprint | Plan |
|---------|--------|------|
| infrastructure | 1 | `docs/features/infrastructure/plan.md` |

---

*Dernière mise à jour : 30 janvier 2026*
