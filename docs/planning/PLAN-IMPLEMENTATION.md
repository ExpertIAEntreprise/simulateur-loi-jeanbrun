# Plan d'Implémentation - Simulateur Loi Jeanbrun

**Version:** 2.2
**Date:** 30 janvier 2026
**Durée totale:** 12 semaines (6 sprints de 2 semaines)
**Auteur:** Équipe Claude Code
**Modifications v2.2:** Entités EspoCRM Jeanbrun créées (CJeanbrunVille, CJeanbrunProgramme)

---

## Statut Actuel

| Élément | Status | URL/Info |
|---------|--------|----------|
| **GitHub** | ✅ Déployé | https://github.com/ExpertIAEntreprise/simulateur-loi-jeanbrun |
| **Vercel** | ✅ Déployé | https://simulateur-loi-jeanbrun.vercel.app |
| **Neon DB** | ✅ Connectée | ep-noisy-cell-agxf4bs5-pooler.c-2.eu-central-1.aws.neon.tech |
| **Better Auth** | ✅ Configuré | Email/password + email verification |
| **EspoCRM Jeanbrun** | ✅ Créé | CJeanbrunVille (51), CJeanbrunProgramme (0) |
| **Scraping Moltbot** | 🔄 En cours | Skill transmis à Moltbot |

### Variables d'environnement Vercel (Production)

- [x] `POSTGRES_URL`
- [x] `BETTER_AUTH_SECRET`
- [x] `BETTER_AUTH_URL`
- [x] `NEXT_PUBLIC_APP_URL`
- [ ] `STRIPE_SECRET_KEY` (Sprint 5)
- [x] `ESPOCRM_API_KEY` → `1a97a8b3ca73fd5f1cdfed6c4f5341ec`

### Entités EspoCRM Jeanbrun (séparées de CardImmo)

| Entité | Records | Description |
|--------|---------|-------------|
| `CJeanbrunVille` | 51 | Villes éligibles (A_bis, A, B1) |
| `CJeanbrunProgramme` | 0 | Programmes neufs (scraping Moltbot) |

> **Note:** Les entités Jeanbrun sont préfixées `CJeanbrun*` pour éviter toute confusion avec CardImmo.

---

## Table des matières

1. [Vue d'ensemble](#1-vue-densemble)
2. [Sprint 1 - Infrastructure](#2-sprint-1---infrastructure)
3. [Sprint 2 - Moteur de calcul](#3-sprint-2---moteur-de-calcul)
4. [Sprint 3 - Interface simulateur](#4-sprint-3---interface-simulateur)
5. [Sprint 4 - Pages SEO](#5-sprint-4---pages-seo)
6. [Sprint 5 - Monétisation + Accompagnement](#6-sprint-5---monétisation--accompagnement)
7. [Sprint 6 - Deploy & Tests](#7-sprint-6---deploy--tests)
8. [Structure des fichiers](#8-structure-des-fichiers)
9. [Configuration Vercel](#9-configuration-vercel)
10. [Schéma Base de Données](#10-schéma-base-de-données)
11. [Risques et mitigations](#11-risques-et-mitigations)

---

## 1. Vue d'ensemble

### 1.1 Planning des 6 sprints

| Sprint | Semaines | Dates | Focus | Jours estimés |
|--------|----------|-------|-------|---------------|
| **1** | S1-S2 | 03-14 Fév 2026 | Infrastructure (Next.js, Docker, EspoCRM) | 10,5j |
| **2** | S3-S4 | 17-28 Fév 2026 | Moteur de calcul (formules fiscales) | 12j |
| **3** | S5-S6 | 03-14 Mar 2026 | Interface simulateur (6 étapes) | 18,5j |
| **4** | S7-S8 | 17-28 Mar 2026 | Pages SEO (50 villes) | 13,75j |
| **5** | S9-S10 | 31 Mar - 11 Avr 2026 | Monétisation (Stripe, PDF) | 15,5j |
| **6** | S11-S12 | 14-25 Avr 2026 | Deploy + Tests E2E | 13j |

### 1.2 Jalons clés

| Jalon | Date | Critère de validation |
|-------|------|----------------------|
| MVP Technique | Fin Sprint 2 | Calculs fonctionnels avec tests |
| MVP Fonctionnel | Fin Sprint 3 | Simulateur 6 étapes utilisable |
| MVP SEO | Fin Sprint 4 | 50 pages villes indexables |
| MVP Complet | Fin Sprint 5 | Paiement + PDF fonctionnels |
| Production | Fin Sprint 6 | Site live sur domaine principal |

### 1.3 Stack technique confirmée (alignée CardImmo)

| Composant | Technologie | Version |
|-----------|-------------|---------|
| Frontend | Next.js | 14.x (App Router) |
| Langage | TypeScript | 5.x |
| Styling | Tailwind CSS | v4 |
| UI | shadcn/ui | Latest |
| Validation | Zod | 3.x |
| **Base de données** | **Neon (PostgreSQL) + Drizzle ORM** | Latest |
| **CRM Sync** | **EspoCRM API** (entités séparées: `CJeanbrunLead`, `CJeanbrunSimulation`) | 8.x |
| Paiement | Stripe | Latest |
| PDF | @react-pdf/renderer | 3.x |
| Tests | Jest + Playwright | Latest |
| **Hébergement** | **Vercel** | Pro |
| **RDV** | **Calendly** (embed + webhook) | - |

---

## 2. Sprint 1 - Infrastructure

**Dates:** 03-14 Février 2026
**Objectif:** Environnement de développement fonctionnel avec stack Vercel/Neon

### 2.1 Tâches détaillées

| ID | Tâche | Effort | Dépendances | Livrable |
|----|-------|--------|-------------|----------|
| 1.1 | Setup projet Next.js 14 | 1j | - | Projet initialisé |
| 1.2 | Configuration TypeScript strict | 0,5j | 1.1 | tsconfig.json |
| 1.3 | Installation Tailwind v4 + shadcn/ui | 1j | 1.1 | Composants de base |
| 1.4 | Configuration ESLint + Prettier | 0,5j | 1.1 | .eslintrc, .prettierrc |
| 1.5 | **Setup Neon PostgreSQL + Drizzle ORM** | 1j | 1.1 | Schéma DB, migrations |
| 1.6 | **Configuration Vercel (projet, env vars)** | 0,5j | 1.1 | Déploiement preview |
| 1.7 | **Schéma Drizzle (villes, programmes, simulations, leads)** | 1,5j | 1.5 | /src/db/schema.ts |
| 1.8 | Client API EspoCRM (sync leads) | 1j | 1.1 | /src/lib/api/espocrm.ts |
| 1.9 | **Créer REGISTRE-RGPD.md** | 0,5j | - | Conformité CNIL |
| 1.10 | Import données test (266 communes) | 1j | 1.7 | Données en base Neon |
| 1.11 | CI/CD GitHub Actions + Vercel | 0,5j | 1.6 | Workflow de build |
| 1.12 | **Politique de confidentialité + CGV** | 1j | 1.9 | Pages légales |

**Total Sprint 1:** 10 jours

### 2.2 Checklist de fin de sprint

- [x] `pnpm dev` démarre sans erreur
- [x] `pnpm build` produit un build de production
- [x] Déploiement preview Vercel fonctionnel ✅ https://simulateur-loi-jeanbrun.vercel.app
- [x] Connexion Neon PostgreSQL OK ✅ Configurée
- [x] Schéma Drizzle avec migrations appliquées ✅ (Better Auth tables)
- [x] API EspoCRM accessible ✅ → **Entités créées: `CJeanbrunVille`, `CJeanbrunProgramme`**
- [x] 51 villes prioritaires importées (EspoCRM) ✅ zones A_bis, A, B1
- [ ] 266 communes complètes importées (Neon) - Sprint 4
- [ ] REGISTRE-RGPD.md créé et complet
- [ ] Pages politique confidentialité + CGV

---

## 3. Sprint 2 - Moteur de calcul

**Dates:** 17-28 Février 2026
**Objectif:** Tous les calculs fiscaux implémentés et testés à 90%+

### 3.1 Tâches détaillées

| ID | Tâche | Effort | Dépendances | Livrable |
|----|-------|--------|-------------|----------|
| 2.1 | Module calcul IR 2026 | 1,5j | 1.1 | /src/lib/calculs/ir.ts |
| 2.2 | Module TMI automatique | 0,5j | 2.1 | Calcul TMI depuis revenus |
| 2.3 | Module amortissement Jeanbrun neuf | 1j | - | /src/lib/calculs/jeanbrun-neuf.ts |
| 2.4 | Module amortissement Jeanbrun ancien | 1j | - | /src/lib/calculs/jeanbrun-ancien.ts |
| 2.5 | Module déficit foncier bonifié | 1j | 2.3, 2.4 | /src/lib/calculs/deficit-foncier.ts |
| 2.6 | Module calcul crédit immobilier | 1j | - | /src/lib/calculs/credit.ts |
| 2.7 | Module plus-value immobilière | 1,5j | - | /src/lib/calculs/plus-value.ts |
| 2.8 | Module LMNP (comparatif) | 1j | - | /src/lib/calculs/lmnp.ts |
| 2.9 | Module rendements (brut, net, net-net) | 0,5j | 2.3-2.6 | /src/lib/calculs/rendements.ts |
| 2.10 | Tests unitaires calculs | 2j | 2.1-2.9 | 90%+ coverage |
| 2.11 | Orchestrateur simulation | 1j | 2.1-2.9 | /src/lib/calculs/orchestrateur.ts |

**Total Sprint 2:** 12 jours

### 3.2 Formules critiques à implémenter

```typescript
// Amortissement Jeanbrun Neuf
const baseAmortissement = prixAcquisition * 0.80; // 80% (terrain exclu)
const tauxParNiveau = {
  intermediaire: 0.035, // Plafond 8 000€
  social: 0.045,        // Plafond 10 000€
  tres_social: 0.055    // Plafond 12 000€
};

// Amortissement Jeanbrun Ancien
const tauxAncien = {
  intermediaire: 0.030, // Plafond unique 10 700€
  social: 0.035,
  tres_social: 0.040
};

// Condition éligibilité ancien: travaux >= 30% prix achat

// Déficit foncier bonifié: 21 400€ jusqu'au 31/12/2027
```

### 3.3 Checklist de fin de sprint

- [ ] Tous les modules de calcul créés
- [ ] Tests unitaires >= 90% coverage sur /lib/calculs/
- [ ] Calculs validés contre exemples du PRD
- [ ] API `/api/simulation/calcul` fonctionnelle
- [ ] Documentation des formules dans le code

---

## 4. Sprint 3 - Interface simulateur

**Dates:** 03-14 Mars 2026
**Objectif:** Simulateur 6 étapes complet et responsive

### 4.1 Tâches détaillées

| ID | Tâche | Effort | Dépendances | Livrable |
|----|-------|--------|-------------|----------|
| 3.1 | Layout simulateur + progress bar | 1j | 1.3 | Layout partagé |
| 3.2 | Étape 1: Profil investisseur | 2j | 3.1 | Formulaire complet |
| 3.3 | Étape 2: Projet immobilier | 2,5j | 3.1 | Neuf/Ancien + validation travaux |
| 3.4 | Étape 3: Financement | 2j | 3.1 | Crédit + différé + jauge |
| 3.5 | Étape 4: Stratégie locative | 2j | 3.1 | 3 niveaux + visualisation |
| 3.6 | Étape 5: Durée et sortie | 1,5j | 3.1 | Slider + hypothèses |
| 3.7 | Étape 6: Structure juridique | 1,5j | 3.1 | 3 options + comparatif |
| 3.8 | Page résultats simulation | 3j | 2.11, 3.2-3.7 | Synthèse + graphiques |
| 3.9 | Composant graphique patrimoine | 1j | 3.8 | Chart Recharts |
| 3.10 | Sauvegarde localStorage | 0,5j | 3.2-3.7 | Reprise possible |
| 3.11 | Responsive mobile | 1,5j | 3.1-3.10 | Design mobile first |

**Total Sprint 3:** 18,5 jours

### 4.2 Composants UI à créer

```
/src/components/simulateur/
├── SimulateurLayout.tsx       # Layout avec progress bar
├── StepNavigation.tsx         # Boutons Retour/Continuer
├── ProgressBar.tsx            # Barre 1/6 à 6/6
├── etape-1/
│   ├── ProfilForm.tsx
│   ├── TMICalculator.tsx
│   └── ObjectifSelector.tsx
├── etape-2/
│   ├── TypeBienSelector.tsx
│   ├── VilleAutocomplete.tsx
│   ├── TravauxValidator.tsx   # NOUVEAU v2.0
│   └── RecapProjet.tsx
├── etape-3/
│   ├── FinancementForm.tsx
│   ├── DiffereSelector.tsx    # NOUVEAU v2.0
│   └── JaugeEndettement.tsx   # NOUVEAU v2.0
├── etape-4/
│   ├── NiveauLoyerCards.tsx
│   ├── PerteGainVisualisation.tsx  # NOUVEAU v2.0
│   └── ChargesForm.tsx
├── etape-5/
│   ├── DureeSlider.tsx
│   ├── RevalorisationInput.tsx
│   └── StrategieSortie.tsx
├── etape-6/
│   ├── StructureCards.tsx
│   └── ComparatifTable.tsx
└── resultats/
    ├── SyntheseCard.tsx
    ├── GraphiquePatrimoine.tsx
    ├── TableauAnnuel.tsx       # Premium
    ├── ComparatifLMNP.tsx      # Premium
    └── ExportPDF.tsx           # Premium
```

### 4.3 Checklist de fin de sprint

- [ ] 6 étapes navigables avec retour
- [ ] Validation temps réel sur tous les champs
- [ ] TMI calculé automatiquement
- [ ] Seuil travaux 30% vérifié (ancien)
- [ ] Jauge endettement avec couleurs
- [ ] Visualisation Perte/Gain locatif
- [ ] Page résultats avec synthèse
- [ ] Design responsive mobile

---

## 5. Sprint 4 - Pages SEO

**Dates:** 17-28 Mars 2026
**Objectif:** 50 pages villes SEO-ready indexables

### 5.1 Tâches détaillées

| ID | Tâche | Effort | Dépendances | Livrable |
|----|-------|--------|-------------|----------|
| 4.1 | Template page ville | 2j | 1.8 | /app/villes/[slug]/page.tsx |
| 4.2 | Composant données marché | 1j | 4.1 | Prix, loyers, tension |
| 4.3 | Composant plafonds Jeanbrun | 0,5j | 4.1 | 3 niveaux par zone |
| 4.4 | Liste programmes intégrée | 1j | 4.1, 1.9 | Top 3 programmes |
| 4.5 | Simulateur pré-rempli | 1j | 4.1, 3.2 | Ville injectée |
| 4.6 | Contenu éditorial 50 villes | 3j | 4.1 | 400-600 mots uniques |
| 4.7 | JSON-LD pages villes | 1j | 4.1 | Place, ItemList |
| 4.8 | Sitemap.xml dynamique | 0,5j | 4.1 | /sitemap.xml |
| 4.9 | robots.txt | 0,25j | - | /robots.txt |
| 4.10 | Metadata SEO dynamiques | 0,5j | 4.1 | Title, description |
| 4.11 | Maillage interne automatique | 1j | 4.1 | Villes proches |
| 4.12 | Page index villes | 1j | 4.1 | /villes |
| 4.13 | SSG build 50 villes | 1j | 4.1-4.12 | Static generation |

**Total Sprint 4:** 13,75 jours

### 5.2 Liste des 50 villes MVP

```
Paris, Lyon, Marseille, Toulouse, Nice, Nantes, Strasbourg, Montpellier,
Bordeaux, Lille, Rennes, Reims, Le Havre, Saint-Étienne, Toulon, Grenoble,
Dijon, Angers, Nîmes, Villeurbanne, Le Mans, Aix-en-Provence, Clermont-Ferrand,
Brest, Tours, Limoges, Amiens, Perpignan, Metz, Besançon, Orléans, Mulhouse,
Rouen, Caen, Nancy, Saint-Denis, Argenteuil, Montreuil, Roubaix, Tourcoing,
Avignon, Dunkerque, Nanterre, Créteil, Poitiers, Versailles, Courbevoie,
Vitry-sur-Seine, Colombes, Asnières-sur-Seine
```

### 5.3 Checklist de fin de sprint

- [ ] 50 pages villes générées statiquement
- [ ] Données marché affichées (DVF, loyers)
- [ ] Plafonds Jeanbrun par zone
- [ ] Simulateur pré-rempli fonctionnel
- [ ] Contenu unique par ville
- [ ] JSON-LD valide (Rich Results Test)
- [ ] Sitemap.xml complet
- [ ] Core Web Vitals >= 90

---

## 6. Sprint 5 - Monétisation + Accompagnement

**Dates:** 31 Mars - 11 Avril 2026
**Objectif:** Paiement Stripe + Export PDF + Parcours accompagnement complet

### 6.1 Tâches détaillées

| ID | Tâche | Effort | Dépendances | Livrable |
|----|-------|--------|-------------|----------|
| 5.1 | Configuration Stripe (produits, prix) | 1j | - | Dashboard Stripe |
| 5.2 | Endpoint checkout session | 1j | 5.1 | /api/checkout/create-session |
| 5.3 | Webhook Stripe | 1,5j | 5.1 | /api/webhooks/stripe |
| 5.4 | Gestion quotas utilisateur | 1j | 5.3, 1.7 | Champ Neon |
| 5.5 | UI composant paiement | 1j | 5.2 | Modal achat |
| 5.6 | Overlay premium sur résultats | 1j | 5.4, 3.8 | Masquage sections |
| 5.7 | Template PDF résultats | 1,5j | 3.8 | @react-pdf/renderer |
| 5.8 | Génération PDF côté serveur | 1j | 5.7 | /api/pdf/generate |
| **5.9** | **Bloc proposition accompagnement** | 0,5j | 3.8 | Sur page résultats |
| **5.10** | **Formulaire découverte patrimoniale** | 2j | 1.7 | Multi-étapes + validation |
| **5.11** | **Module qualification automatique** | 1j | 5.10 | Calcul éligibilité serveur |
| **5.12** | **Intégration Calendly (embed + webhook)** | 1j | 5.11 | Prise RDV |
| **5.13** | **Gestion consentements RGPD** | 1j | 5.10 | Opt-in séparés |
| **5.14** | **Sync leads EspoCRM** | 0,5j | 5.10 | API call après soumission |
| 5.15 | Email confirmation achat + RDV | 1j | 5.3, 5.12 | Templates email |
| 5.16 | Tests intégration | 1j | 5.1-5.15 | Mode test |

**Total Sprint 5:** 17 jours

### 6.2 Produits Stripe à créer

| ID Produit | Nom | Prix TTC | Description |
|------------|-----|----------|-------------|
| price_pack3 | Pack 3 Simulations | 9,90€ | 3 simulations avancées |
| price_duo30 | Pack Duo 30 jours | 14,90€ | Illimité + Guide PDF |

### 6.3 Parcours Accompagnement

```
Résultats simulation
        ↓
┌─────────────────────────────────┐
│  Bloc "Être accompagné"         │
│  (modèle économique transparent)│
└─────────────────────────────────┘
        ↓
Découverte patrimoniale (3 étapes)
├── Identité + Contact
├── Revenus + Patrimoine + Endettement
└── Projet + Consentements RGPD
        ↓
Qualification automatique (serveur)
├── Éligible → Calendly embed
└── Non éligible → Message + suggestions
        ↓
Sync EspoCRM (lead créé)
```

### 6.4 Critères qualification

| Critère | Seuil | Calcul |
|---------|-------|--------|
| Revenus mensuels | >= 3 000€ | Direct |
| Taux endettement | <= 35% | (crédits + mensualité projet) / revenus |
| Apport | >= 10% projet | épargne / budget |
| TMI | >= 11% | Barème IR |

### 6.5 Checklist de fin de sprint

- [ ] Stripe Checkout fonctionnel (test)
- [ ] Webhook traite checkout.session.completed
- [ ] Quota décrémenté après simulation
- [ ] Overlay sur sections premium
- [ ] Export PDF avec logo et disclaimer
- [ ] **Bloc accompagnement visible sur résultats**
- [ ] **Formulaire découverte patrimoniale fonctionnel**
- [ ] **Qualification automatique (serveur)**
- [ ] **Calendly embed + webhook**
- [ ] **Consentements RGPD (3 opt-in séparés)**
- [ ] **Sync EspoCRM après soumission**
- [ ] Emails confirmation envoyés

---

## 7. Sprint 6 - Deploy & Tests

**Dates:** 14-25 Avril 2026
**Objectif:** Site live en production avec monitoring

### 7.1 Tâches détaillées

| ID | Tâche | Effort | Dépendances | Livrable |
|----|-------|--------|-------------|----------|
| 6.1 | Tests E2E parcours critiques | 3j | 3.8, 5.6 | Playwright specs |
| 6.2 | Tests de charge | 1j | 6.1 | Rapport k6 |
| 6.3 | Audit accessibilité axe-core | 1j | - | Rapport a11y |
| 6.4 | Audit sécurité OWASP | 1j | - | Rapport sécurité |
| 6.5 | Configuration SSL Let's Encrypt | 0,5j | 1.6 | HTTPS actif |
| 6.6 | Configuration DNS domaine | 0,5j | 6.5 | simuler-loi-fiscale-jeanbrun.fr |
| 6.7 | Redirections 301 domaines secondaires | 0,5j | 6.6 | 4 domaines redirigés |
| 6.8 | Setup monitoring (Sentry, logs) | 1j | 1.5 | Dashboard erreurs |
| 6.9 | Setup analytics (GA4 + Plausible) | 0,5j | - | Tracking actif |
| 6.10 | Documentation déploiement | 1j | 6.1-6.9 | README.md |
| 6.11 | Optimisation Core Web Vitals | 1,5j | - | Score >= 90 |
| 6.12 | Go live production | 0,5j | 6.1-6.11 | Site public |

**Total Sprint 6:** 13 jours

### 7.2 Tests E2E critiques

```typescript
// tests/e2e/simulation-rapide.spec.ts
test('simulation rapide complète', async ({ page }) => {
  await page.goto('/simulateur');
  await page.fill('[data-testid="ville"]', 'Lyon');
  await page.click('[data-testid="suggestion-lyon"]');
  // ... assertions résultats
});

// tests/e2e/simulation-avancee.spec.ts
test('simulation avancée 6 étapes', async ({ page }) => {
  // Étape 1 à 6 + résultats
});

// tests/e2e/paiement.spec.ts
test('achat pack simulations', async ({ page }) => {
  // Stripe test mode
});
```

### 7.3 Checklist pré-production

- [ ] Tests E2E passent sur Chrome, Firefox, Safari
- [ ] Score PageSpeed mobile >= 90
- [ ] Score PageSpeed desktop >= 95
- [ ] Audit axe-core sans erreur critique
- [ ] Headers sécurité configurés (CSP, etc.)
- [ ] SSL valide sur domaine principal
- [ ] Redirections 301 fonctionnelles
- [ ] Sentry reçoit les erreurs
- [ ] GA4 + Plausible trackent
- [ ] Stripe en mode live

---

## 8. Structure des fichiers

### 8.1 Arborescence complète du projet

> **Note:** Structure réorganisée le 30/01/2026 - Next.js à la racine (plus de sous-dossier `app/`)

```
/root/simulateur_loi_Jeanbrun/
├── .github/
│   └── workflows/
│       └── ci.yml
├── public/
│   ├── favicon.ico
│   ├── robots.txt
│   └── images/
│       └── logo.svg
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                    # Landing page
│   │   ├── globals.css
│   │   ├── simulateur/
│   │   │   ├── page.tsx                # Simulateur rapide
│   │   │   ├── avance/
│   │   │   │   ├── page.tsx            # Étape 1
│   │   │   │   ├── etape-2/page.tsx
│   │   │   │   ├── etape-3/page.tsx
│   │   │   │   ├── etape-4/page.tsx
│   │   │   │   ├── etape-5/page.tsx
│   │   │   │   └── etape-6/page.tsx
│   │   │   └── resultat/
│   │   │       └── [id]/page.tsx       # Page résultats
│   │   ├── villes/
│   │   │   ├── page.tsx                # Index villes
│   │   │   └── [slug]/page.tsx         # Page ville
│   │   ├── programmes/
│   │   │   ├── page.tsx                # Liste programmes
│   │   │   └── [slug]/page.tsx         # Fiche programme
│   │   ├── guide/
│   │   │   ├── page.tsx                # Hub guides
│   │   │   └── [slug]/page.tsx         # Article
│   │   ├── compte/
│   │   │   ├── page.tsx                # Dashboard
│   │   │   └── simulations/page.tsx    # Historique
│   │   ├── api/
│   │   │   ├── villes/
│   │   │   │   ├── route.ts
│   │   │   │   ├── [slug]/route.ts
│   │   │   │   └── autocomplete/route.ts
│   │   │   ├── programmes/
│   │   │   │   ├── route.ts
│   │   │   │   └── [slug]/route.ts
│   │   │   ├── simulation/
│   │   │   │   ├── rapide/route.ts
│   │   │   │   ├── avancee/route.ts
│   │   │   │   └── [id]/route.ts
│   │   │   ├── checkout/
│   │   │   │   └── create-session/route.ts
│   │   │   ├── webhooks/
│   │   │   │   ├── stripe/route.ts
│   │   │   │   └── calendly/route.ts        # NOUVEAU v2
│   │   │   ├── decouverte/                  # NOUVEAU v2
│   │   │   │   ├── route.ts                 # POST formulaire
│   │   │   │   └── [id]/route.ts
│   │   │   ├── leads/                       # NOUVEAU v2
│   │   │   │   └── consent/route.ts
│   │   │   ├── pdf/
│   │   │   │   └── generate/route.ts
│   │   │   └── user/
│   │   │       ├── quota/route.ts
│   │   │       └── simulations/route.ts
│   │   ├── accompagnement/                  # NOUVEAU v2
│   │   │   ├── page.tsx                     # Formulaire découverte
│   │   │   ├── qualification/page.tsx       # Résultat qualification
│   │   │   └── rdv/page.tsx                 # Calendly embed
│   │   ├── mentions-legales/page.tsx
│   │   ├── cgv/page.tsx
│   │   ├── politique-confidentialite/page.tsx
│   │   └── sitemap.ts
│   ├── components/
│   │   ├── ui/                         # shadcn/ui
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   ├── slider.tsx
│   │   │   ├── card.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── progress.tsx
│   │   │   ├── alert.tsx
│   │   │   ├── tooltip.tsx
│   │   │   └── ...
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── MobileNav.tsx
│   │   ├── simulateur/
│   │   │   ├── SimulateurLayout.tsx
│   │   │   ├── StepNavigation.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   ├── etape-1/
│   │   │   ├── etape-2/
│   │   │   ├── etape-3/
│   │   │   ├── etape-4/
│   │   │   ├── etape-5/
│   │   │   ├── etape-6/
│   │   │   └── resultats/
│   │   ├── villes/
│   │   │   ├── VilleCard.tsx
│   │   │   ├── DonneesMarche.tsx
│   │   │   ├── PlafondsJeanbrun.tsx
│   │   │   └── VillesProches.tsx
│   │   ├── programmes/
│   │   │   ├── ProgrammeCard.tsx
│   │   │   ├── ProgrammeGalerie.tsx
│   │   │   └── ProgrammeMap.tsx
│   │   ├── common/
│   │   │   ├── SEO.tsx
│   │   │   ├── JsonLd.tsx
│   │   │   └── CookieBanner.tsx
│   │   └── accompagnement/              # NOUVEAU v2
│   │       ├── AccompagnementCTA.tsx    # Bloc sur page résultats
│   │       ├── DecouverteForm.tsx       # Formulaire multi-étapes
│   │       ├── QualificationResult.tsx  # Résultat éligibilité
│   │       ├── CalendlyEmbed.tsx        # Widget Calendly
│   │       └── ConsentementRGPD.tsx     # Opt-ins séparés
│   ├── db/                              # NOUVEAU v2 - Drizzle
│   │   ├── index.ts                     # Client Neon
│   │   ├── schema.ts                    # Schéma tables
│   │   └── migrations/                  # Fichiers migration
│   ├── lib/
│   │   ├── calculs/
│   │   │   ├── ir.ts                   # Impôt sur le revenu
│   │   │   ├── jeanbrun-neuf.ts        # Amortissement neuf
│   │   │   ├── jeanbrun-ancien.ts      # Amortissement ancien
│   │   │   ├── deficit-foncier.ts      # Déficit foncier bonifié
│   │   │   ├── credit.ts               # Mensualités, tableau amort.
│   │   │   ├── plus-value.ts           # PV immobilière
│   │   │   ├── lmnp.ts                 # Comparatif LMNP
│   │   │   ├── rendements.ts           # Brut, net, net-net
│   │   │   ├── orchestrateur.ts        # Orchestration complète
│   │   │   └── __tests__/              # Tests unitaires
│   │   │       ├── ir.test.ts
│   │   │       ├── jeanbrun-neuf.test.ts
│   │   │       ├── jeanbrun-ancien.test.ts
│   │   │       └── ...
│   │   ├── api/
│   │   │   ├── espocrm.ts              # Client API EspoCRM (sync leads)
│   │   │   ├── stripe.ts               # Client Stripe
│   │   │   └── calendly.ts             # Client Calendly API
│   │   ├── utils/
│   │   │   ├── format.ts               # Formatage monétaire
│   │   │   ├── validation.ts           # Schémas Zod
│   │   │   └── constants.ts            # Constantes (plafonds, taux)
│   │   └── hooks/
│   │       ├── useSimulation.ts
│   │       ├── useVille.ts
│   │       └── useLocalStorage.ts
│   ├── types/
│   │   ├── simulation.ts
│   │   ├── ville.ts
│   │   ├── programme.ts
│   │   ├── lead.ts                      # NOUVEAU v2
│   │   ├── decouverte.ts                # NOUVEAU v2
│   │   └── api.ts
│   └── styles/
│       └── fonts.css
├── tests/
│   ├── e2e/
│   │   ├── simulation-rapide.spec.ts
│   │   ├── simulation-avancee.spec.ts
│   │   ├── paiement.spec.ts
│   │   └── navigation-ville.spec.ts
│   └── integration/
│       └── api.test.ts
├── docker/
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── nginx/
│       └── nginx.conf
├── .env.example
├── .env.local
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── jest.config.js
├── playwright.config.ts
├── package.json
└── README.md
```

---

## 9. Configuration Vercel

### 9.1 vercel.json

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "nextjs",
  "regions": ["cdg1"],
  "functions": {
    "src/app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "SAMEORIGIN" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    }
  ],
  "redirects": [
    {
      "source": "/simulateur-loi-fiscale-jeanbrun.fr/:path*",
      "destination": "https://simuler-loi-fiscale-jeanbrun.fr/:path*",
      "permanent": true
    }
  ]
}
```

### 9.2 Variables d'environnement Vercel

```bash
# Production (Vercel Dashboard → Settings → Environment Variables)

# Base de données
DATABASE_URL=postgres://...@ep-xxx.eu-west-1.aws.neon.tech/neondb?sslmode=require

# EspoCRM (sync leads)
ESPOCRM_URL=https://espocrm.expert-ia-entreprise.fr/api/v1
ESPOCRM_API_KEY=xxx

# Stripe
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx

# Calendly
CALENDLY_WEBHOOK_SECRET=xxx

# Site
NEXT_PUBLIC_SITE_URL=https://simuler-loi-fiscale-jeanbrun.fr
NEXT_PUBLIC_GA_ID=G-XXXXXXX
```

### 9.3 next.config.ts

```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    ppr: true,  // Partial Pre-Rendering
  },
  images: {
    domains: ['images.unsplash.com'],
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
        ],
      },
    ]
  },
}

export default nextConfig
```

---

## 10. Schéma Base de Données

### 10.1 Schéma Drizzle ORM (src/db/schema.ts)

```typescript
import { pgTable, text, integer, real, boolean, timestamp, jsonb, pgEnum } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// Enums
export const zoneFiscaleEnum = pgEnum('zone_fiscale', ['A', 'A_bis', 'B1', 'B2', 'C'])
export const tensionLocativeEnum = pgEnum('tension_locative', ['faible', 'moyenne', 'forte', 'tres_forte'])
export const niveauLoyerEnum = pgEnum('niveau_loyer', ['intermediaire', 'social', 'tres_social'])
export const leadStatutEnum = pgEnum('lead_statut', ['nouveau', 'rdv_pris', 'accompagne', 'converti', 'perdu'])

// Tables
export const villes = pgTable('villes', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  departement: text('departement').notNull(),
  region: text('region').notNull(),
  zoneFiscale: zoneFiscaleEnum('zone_fiscale').notNull(),
  prixM2Moyen: integer('prix_m2_moyen'),
  prixM2Median: integer('prix_m2_median'),
  evolutionPrix1An: real('evolution_prix_1an'),
  loyerM2Moyen: real('loyer_m2_moyen'),
  tensionLocative: tensionLocativeEnum('tension_locative'),
  plafondsIntermediaire: integer('plafonds_intermediaire'),
  plafondsSocial: integer('plafonds_social'),
  plafondsTresSocial: integer('plafonds_tres_social'),
  nbProgrammes: integer('nb_programmes').default(0),
  metaTitle: text('meta_title'),
  metaDescription: text('meta_description'),
  contenuEditorial: text('contenu_editorial'),
  dateMaj: timestamp('date_maj').defaultNow(),
})

export const programmes = pgTable('programmes', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  promoteur: text('promoteur'),
  villeId: text('ville_id').references(() => villes.id),
  adresse: text('adresse'),
  latitude: real('latitude'),
  longitude: real('longitude'),
  prixMin: integer('prix_min'),
  prixMax: integer('prix_max'),
  prixM2Moyen: integer('prix_m2_moyen'),
  nbLotsTotal: integer('nb_lots_total'),
  nbLotsDisponibles: integer('nb_lots_disponibles'),
  typesLots: text('types_lots').array(),
  dateLivraison: text('date_livraison'),
  eligibleJeanbrun: boolean('eligible_jeanbrun').default(true),
  images: text('images').array(),
  description: text('description'),
  statut: text('statut').default('disponible'),
  sourceUrl: text('source_url'),
  dateScrap: timestamp('date_scrap'),
})

export const simulations = pgTable('simulations', {
  id: text('id').primaryKey(),
  email: text('email'),
  inputData: jsonb('input_data').notNull(),
  resultats: jsonb('resultats').notNull(),
  isPremium: boolean('is_premium').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  villeId: text('ville_id').references(() => villes.id),
})

export const leads = pgTable('leads', {
  id: text('id').primaryKey(),
  // Identité
  nom: text('nom').notNull(),
  prenom: text('prenom').notNull(),
  email: text('email').notNull(),
  telephone: text('telephone'),
  // Situation
  statutPro: text('statut_pro'),
  ancienneteMois: integer('anciennete_mois'),
  revenusMensuelsNets: integer('revenus_mensuels_nets'),
  revenusFonciersExistants: integer('revenus_fonciers_existants'),
  // Patrimoine (chiffré)
  patrimoineData: text('patrimoine_data'),  // Chiffré côté app
  // Projet
  budgetEnvisage: integer('budget_envisage'),
  objectifPrincipal: text('objectif_principal'),
  horizonMois: integer('horizon_mois'),
  // Qualification
  score: integer('score'),
  eligible: boolean('eligible'),
  motifNonEligibilite: text('motif_non_eligibilite'),
  // Consentements RGPD
  consentementTraitement: boolean('consentement_traitement').notNull(),
  consentementCGP: boolean('consentement_cgp').default(false),
  consentementNewsletter: boolean('consentement_newsletter').default(false),
  dateConsentement: timestamp('date_consentement').notNull(),
  ipConsentement: text('ip_consentement'),
  // Statut
  statut: leadStatutEnum('statut').default('nouveau'),
  simulationId: text('simulation_id').references(() => simulations.id),
  espoContactId: text('espo_contact_id'),
  calendlyEventId: text('calendly_event_id'),
  // Dates
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const quotas = pgTable('quotas', {
  email: text('email').primaryKey(),
  simulationsRestantes: integer('simulations_restantes').default(1),
  packType: text('pack_type'),
  stripeSessionId: text('stripe_session_id'),
  dateAchat: timestamp('date_achat'),
  dateExpiration: timestamp('date_expiration'),
})

// Relations
export const villesRelations = relations(villes, ({ many }) => ({
  programmes: many(programmes),
  simulations: many(simulations),
}))

export const programmesRelations = relations(programmes, ({ one }) => ({
  ville: one(villes, { fields: [programmes.villeId], references: [villes.id] }),
}))
```

### 10.2 Migrations Drizzle

```bash
# Générer une migration
npx drizzle-kit generate:pg

# Appliquer les migrations
npx drizzle-kit push:pg

# Studio pour visualiser les données
npx drizzle-kit studio
```

---

## 11. Risques et mitigations

### 11.1 Risques techniques

| ID | Risque | Probabilité | Impact | Mitigation |
|----|--------|-------------|--------|------------|
| R1 | Formules de calcul incorrectes | Moyenne | Critique | Tests unitaires exhaustifs, review expert CGP |
| R2 | Performance dégradée EspoCRM | Moyenne | Élevé | Cache Redis agressif, requêtes optimisées |
| R3 | Échec intégration Stripe | Faible | Élevé | Mode test complet, webhooks retry |
| R4 | Core Web Vitals insuffisants | Moyenne | Moyen | SSG, lazy loading, optimisation images |
| R5 | Fuite de données utilisateur | Faible | Critique | Validation Zod, HTTPS, audit sécurité |

### 11.2 Risques projet

| ID | Risque | Probabilité | Impact | Mitigation |
|----|--------|-------------|--------|------------|
| R6 | Dépassement délai sprint | Moyenne | Moyen | Buffer 10%, scope flexible |
| R7 | Indisponibilité EspoCRM | Faible | Élevé | Données en cache 24h |
| R8 | Modification dispositif Jeanbrun | Moyenne | Moyen | Architecture flexible, config externalisée |
| R9 | SEO pénalisé (spam) | Faible | Critique | Contenu unique, respect guidelines |

### 11.3 Matrice des dépendances critiques

```
Sprint 1 ────► Sprint 2 ────► Sprint 3 ────► Sprint 4
   │              │              │              │
   │              │              │              │
   │              └──────────────┼──────────────┤
   │                             │              │
   │                             ▼              ▼
   │                          Sprint 5 ────► Sprint 6
   │                             ▲
   └─────────────────────────────┘
```

---

## Annexes

### A. Commandes de déploiement (Vercel)

```bash
# Développement local
cd /root/simulateur_loi_Jeanbrun
pnpm dev

# Build local (test)
pnpm run build:ci

# Déploiement preview
vercel --token $VERCEL_TOKEN

# Déploiement production
vercel --token $VERCEL_TOKEN --prod

# Vérification (actuellement)
curl -I https://simulateur-loi-jeanbrun.vercel.app

# Vérification (domaine final)
curl -I https://simuler-loi-fiscale-jeanbrun.fr

# Migrations Drizzle
pnpm db:push

# Voir la base de données
pnpm db:studio

# Git push déclenche auto-deploy
git push origin main
```

### B. Variables d'environnement

```bash
# .env.local (développement)
DATABASE_URL=postgres://...@ep-xxx.eu-west-1.aws.neon.tech/neondb?sslmode=require

ESPOCRM_URL=https://espocrm.expert-ia-entreprise.fr/api/v1
ESPOCRM_API_KEY=xxx

STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx

CALENDLY_API_KEY=xxx
CALENDLY_WEBHOOK_SECRET=xxx

NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_GA_ID=G-XXXXXXX
```

### C. Contacts et ressources

| Ressource | URL/Contact |
|-----------|-------------|
| **GitHub Repo** | https://github.com/ExpertIAEntreprise/simulateur-loi-jeanbrun |
| **Vercel Dashboard** | https://vercel.com/agent-ias-projects/simulateur-loi-jeanbrun |
| **Site Preview** | https://simulateur-loi-jeanbrun.vercel.app |
| REQUIREMENTS v2 | /root/simulateur_loi_Jeanbrun/docs/specs/REQUIREMENTS.md |
| PRD complet | /root/simulateur_loi_Jeanbrun/docs/specs/PRD.md |
| Formules calcul | /root/simulateur_loi_Jeanbrun/docs/technical/FORMULES.md |
| Wireframes v2.0 | /root/simulateur_loi_Jeanbrun/docs/specs/WIREFRAMES.md |
| **Registre RGPD** | /root/simulateur_loi_Jeanbrun/docs/legal/REGISTRE-RGPD.md **(à créer)** |
| Schéma EspoCRM | /root/simulateur_loi_Jeanbrun/docs/ESPOCRM-SCHEMA.md |

---

**Document maintenu par:** Équipe Claude Code
**Dernière mise à jour:** 30 janvier 2026 - v2.1 (Infrastructure déployée)
