# REQUIREMENTS.md - Simulateur Loi Jeanbrun

**Version:** 2.0
**Date:** 30 janvier 2026
**Statut:** Validé pour développement MVP
**Modifications v2:** Stack Vercel/Neon, parcours accompagnement, conformité RGPD

---

## Table des matières

1. [Vue d'ensemble](#1-vue-densemble)
2. [Personas et contexte](#2-personas-et-contexte)
3. [Requirements fonctionnels](#3-requirements-fonctionnels)
4. [Requirements techniques](#4-requirements-techniques)
5. [User Stories MVP](#5-user-stories-mvp)
6. [Contraintes techniques](#6-contraintes-techniques)
7. [Critères de qualité](#7-critères-de-qualité)
8. [Schéma d'API REST](#8-schéma-dapi-rest)

---

## 1. Vue d'ensemble

### 1.1 Scope MVP

| Module | MVP | Phase 2 |
|--------|-----|---------|
| Simulateur rapide (gratuit) | ✅ | - |
| Simulateur avancé (6 étapes) | ✅ | - |
| Pages villes SEO (50 villes) | ✅ | 500+ villes |
| Programmes neufs (SEO informatif) | ✅ | - |
| **Accompagnement gratuit** | ✅ | - |
| **Découverte patrimoniale** | ✅ | - |
| **Prise RDV Calendly** | ✅ | - |
| Export PDF | ✅ | - |
| Paiement Stripe | ✅ | - |

### 1.2 Stack technique (alignée CardImmo)

| Composant | Technologie | Contrainte |
|-----------|-------------|------------|
| Frontend | Next.js 14 + TypeScript | App Router obligatoire |
| Styling | Tailwind CSS v4 + shadcn/ui | Composants accessibles |
| Backend | Next.js API Routes | Serverless |
| Base de données | **Neon (PostgreSQL) + Drizzle ORM** | Serverless |
| CRM/Prospection | **EspoCRM (sync leads)** | API REST |
| Paiement | Stripe Checkout | Mode Session |
| Hébergement | **Vercel** | Edge + Serverless |

### 1.3 Modèle économique

```
┌─────────────────────────────────────────────────────────────┐
│  1. REVENUS DIRECTS (Freemium)                              │
│     - Pack 3 simulations: 9,90€                             │
│     - Pack Duo 30 jours: 14,90€                             │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│  2. ACCOMPAGNEMENT GRATUIT (Commission promoteur)           │
│     - Leads qualifiés → Découverte patrimoniale → RDV       │
│     - Proposition lots personnalisée                        │
│     - Rémunération par le promoteur (pas le client)         │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│  3. REVENTE LEADS (CGP locaux)                              │
│     - Leads non convertis en RDV                            │
│     - Revente à CGP/plateformes partenaires                 │
│     - ⚠️ RGPD: Consentement explicite requis (opt-in)       │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Personas et contexte

### 2.1 Persona 1: Investisseur primo-accédant (P1-PRIMO)

| Attribut | Valeur |
|----------|--------|
| Profil | 35-50 ans, cadre, revenus 50-80k€/an |
| Objectif | Réduire ses impôts, préparer sa retraite |
| Douleur | Ne comprend pas les mécanismes fiscaux |
| Device | Mobile (70%), Desktop (30%) |
| Parcours | Google → Simulateur rapide → Résultats → Avancé |

### 2.2 Persona 2: Investisseur expérimenté (P2-EXPERT)

| Attribut | Valeur |
|----------|--------|
| Profil | 45-60 ans, ex-Pinel, patrimoine >500k€ |
| Objectif | Optimiser nouveau véhicule fiscal post-Pinel |
| Douleur | Pinel terminé, cherche l'équivalent |
| Device | Desktop (60%), Mobile (40%) |
| Parcours | Google → Simulateur avancé → Comparatifs → PDF |

### 2.3 Persona 3: Curieux en veille (P3-CURIEUX)

| Attribut | Valeur |
|----------|--------|
| Profil | 25-40 ans, primo-information |
| Objectif | Comprendre si Jeanbrun est fait pour lui |
| Douleur | Trop d'infos contradictoires |
| Device | Mobile (80%), Desktop (20%) |
| Parcours | Google → Page ville SEO → Guide → Newsletter |

---

## 3. Requirements fonctionnels

### 3.1 Module Simulateur

#### REQ-SIM-001: Simulateur rapide gratuit

| Attribut | Valeur |
|----------|--------|
| **ID** | REQ-SIM-001 |
| **Priorité** | P0 (Critique MVP) |
| **Description** | Simulation rapide sans inscription en < 2 minutes |
| **Dépendances** | REQ-DATA-001 |

**Critères d'acceptation:**
- [ ] 4 champs: Ville (autocomplete), Budget (slider 100k-500k), Revenus (tranches), Niveau loyer
- [ ] Temps complétion < 2 minutes
- [ ] Résultat: Économie annuelle, Économie 9 ans, Loyer estimé
- [ ] CTA vers simulation détaillée visible
- [ ] Fonctionne sans JavaScript (SSR fallback)

---

#### REQ-SIM-002: Simulateur avancé 6 étapes

| Attribut | Valeur |
|----------|--------|
| **ID** | REQ-SIM-002 |
| **Priorité** | P0 (Critique MVP) |
| **Description** | Simulation complète avec tous paramètres fiscaux |
| **Dépendances** | REQ-SIM-001, REQ-PAY-001 |

**Étapes:**

| Étape | Champs |
|-------|--------|
| 1/6 Profil | Situation familiale, Parts fiscales, Revenus, TMI auto, Objectif |
| 2/6 Projet | Type Neuf/Ancien, Ville, Surface, Prix, Travaux (ancien) |
| 3/6 Financement | Apport, Durée, Taux, Assurance, Différé |
| 4/6 Location | Niveau loyer, Charges, Taxe foncière, Gestion |
| 5/6 Sortie | Durée détention, Revalorisation, Stratégie |
| 6/6 Structure | Nom propre / SCI IR / SCI IS, Comparatif LMNP |

**Critères d'acceptation:**
- [ ] Sauvegarde localStorage pour reprise
- [ ] Barre progression 1/6 à 6/6
- [ ] Bouton Retour sans perte de données
- [ ] Validation temps réel des erreurs
- [ ] TMI calculé automatiquement
- [ ] Seuil travaux 30% vérifié (ancien)

---

#### REQ-SIM-003: Calculs fiscaux Jeanbrun

| Attribut | Valeur |
|----------|--------|
| **ID** | REQ-SIM-003 |
| **Priorité** | P0 (Critique MVP) |
| **Description** | Formules de calcul correctes et testées |

**Formules:**

| Calcul | Formule |
|--------|---------|
| Base amortissement | prixAcquisition × 0.80 |
| Amort. neuf intermédiaire | base × 3.5%, plafond 8 000€ |
| Amort. neuf social | base × 4.5%, plafond 10 000€ |
| Amort. neuf très social | base × 5.5%, plafond 12 000€ |
| Amort. ancien intermédiaire | base × 3.0%, plafond 10 700€ |
| Amort. ancien social | base × 3.5%, plafond 10 700€ |
| Amort. ancien très social | base × 4.0%, plafond 10 700€ |
| Économie impôt | amortissementPlafonné × TMI |
| Déficit bonifié | Plafond 21 400€ jusqu'au 31/12/2027 |

**Critères d'acceptation:**
- [ ] Calculs validés contre exemples PRD (tolérance 1€)
- [ ] Plafonds correctement appliqués
- [ ] Base 80% (terrain exclu)
- [ ] Déficit bonifié 21 400€ pour 2026-2027
- [ ] Test unitaire chaque scénario

---

#### REQ-SIM-004: Page résultats

| Attribut | Valeur |
|----------|--------|
| **ID** | REQ-SIM-004 |
| **Priorité** | P0 (Critique MVP) |
| **Description** | Affichage résultats avec graphiques et comparatifs |

**Sections:**

| Section | Accès |
|---------|-------|
| Synthèse (économie, rendement, cash-flow) | Gratuit |
| Graphique patrimoine 9 ans | Gratuit |
| Tableau année par année | Premium |
| Comparatif Jeanbrun vs LMNP | Premium |
| Comparatif structures juridiques | Premium |
| Export PDF | Premium |

**Critères d'acceptation:**
- [ ] Synthèse visible immédiatement
- [ ] Graphique interactif patrimoine
- [ ] Sections Premium masquées avec overlay
- [ ] Lien de partage unique généré
- [ ] Temps chargement < 2 secondes

---

#### REQ-SIM-005: Modèle freemium

| Attribut | Valeur |
|----------|--------|
| **ID** | REQ-SIM-005 |
| **Priorité** | P0 (Critique MVP) |
| **Description** | Gestion quotas et monétisation |

**Grille tarifaire:**

| Offre | Prix | Contenu |
|-------|------|---------|
| Gratuit | 0€ | 1 simulation (capture email) |
| Pack 3 | 9,90€ | 3 simulations + comparatifs + PDF |
| Pack Duo | 14,90€ | Illimité 30 jours + Guide PDF |

**Critères d'acceptation:**
- [ ] 1ère simulation gratuite avec capture email
- [ ] Compteur simulations restantes affiché
- [ ] Paiement déclenche déblocage immédiat
- [ ] Simulations liées à l'email 30 jours
- [ ] Email confirmation après achat

---

### 3.2 Module Pages Villes SEO

#### REQ-SEO-001: Pages villes MVP

| Attribut | Valeur |
|----------|--------|
| **ID** | REQ-SEO-001 |
| **Priorité** | P0 (Critique MVP) |
| **Description** | 50 pages villes SEO-ready |

**Critères d'acceptation:**
- [ ] Données marché (prix m², évolution, loyer, tension)
- [ ] Plafonds Jeanbrun par zone affichés
- [ ] Simulateur pré-rempli intégré
- [ ] Programmes neufs listés (si existants)
- [ ] Contenu éditorial unique (400-600 mots)
- [ ] Metadata SEO optimisées

---

#### REQ-SEO-002: JSON-LD

| Attribut | Valeur |
|----------|--------|
| **ID** | REQ-SEO-002 |
| **Priorité** | P1 (Important) |
| **Description** | Données structurées pour SEO |

**Schémas:**

| Page | JSON-LD |
|------|---------|
| Accueil | Organization, WebSite, SearchAction |
| Simulateur | WebApplication |
| Ville | Place, ItemList |
| Programme | RealEstateListing, Offer |
| Guide | Article, FAQPage |

---

### 3.3 Module Programmes (SEO informatif)

> **Note v2:** Pas d'API agrégateur disponible (Plugimmo, Otaree).
> Les programmes sont affichés à titre informatif (SEO) via scraping.
> La commercialisation se fait via l'accompagnement personnalisé.

#### REQ-PROG-001: Programmes dans pages villes

| Attribut | Valeur |
|----------|--------|
| **ID** | REQ-PROG-001 |
| **Priorité** | P1 (Important) |
| **Description** | Affichage programmes neufs à titre informatif (SEO) |

**Critères d'acceptation:**
- [ ] Scraping mensuel (SeLoger, Bien'ici, sites promoteurs)
- [ ] Affichage: nom, promoteur, fourchette prix, livraison
- [ ] **Pas de lien d'achat direct** (informatif uniquement)
- [ ] CTA → "Simulez votre investissement" ou "Être accompagné"
- [ ] Stockage dans Neon (table `programmes`)

---

### 3.4 Module Accompagnement Gratuit

#### REQ-ACC-001: Proposition accompagnement

| Attribut | Valeur |
|----------|--------|
| **ID** | REQ-ACC-001 |
| **Priorité** | P0 (Critique MVP) |
| **Description** | Proposer un accompagnement gratuit après simulation |

**Parcours utilisateur:**

```
Résultats simulation
        ↓
┌─────────────────────────────────────────────────┐
│  "Vous souhaitez aller plus loin ?"             │
│                                                 │
│  Je vous accompagne GRATUITEMENT jusqu'à        │
│  votre investissement.                          │
│                                                 │
│  Ma rémunération est versée par le promoteur,   │
│  pas par vous. C'est 100% transparent.          │
│                                                 │
│  [En savoir plus]  [Être accompagné →]          │
└─────────────────────────────────────────────────┘
```

**Critères d'acceptation:**
- [ ] Bloc visible sur page résultats (après synthèse)
- [ ] Message transparent sur le modèle économique
- [ ] CTA "Être accompagné" → Découverte patrimoniale
- [ ] Tracking conversion (simulation → clic accompagnement)

---

#### REQ-ACC-002: Découverte patrimoniale

| Attribut | Valeur |
|----------|--------|
| **ID** | REQ-ACC-002 |
| **Priorité** | P0 (Critique MVP) |
| **Description** | Formulaire de qualification avant prise de RDV |

**Champs du formulaire:**

| Section | Champs |
|---------|--------|
| **Identité** | Nom, Prénom, Email, Téléphone |
| **Situation pro** | Statut (salarié/indépendant/retraité), Ancienneté |
| **Revenus** | Revenus nets mensuels, Revenus fonciers existants |
| **Patrimoine** | Résidence principale (O/N, valeur), Autres biens, Épargne disponible |
| **Endettement** | Crédits en cours (montant, durée restante) |
| **Projet** | Budget envisagé, Objectif principal, Horizon de temps |
| **Consentements** | Voir REQ-RGPD-003 |

**Critères d'acceptation:**
- [ ] Formulaire multi-étapes (3-4 écrans)
- [ ] Validation temps réel
- [ ] Consentement RGPD explicite AVANT soumission
- [ ] Calcul automatique capacité d'emprunt estimée
- [ ] Qualification automatique (éligible / non éligible)
- [ ] Stockage Neon + sync EspoCRM (lead)

---

#### REQ-ACC-003: Qualification automatique

| Attribut | Valeur |
|----------|--------|
| **ID** | REQ-ACC-003 |
| **Priorité** | P0 (Critique MVP) |
| **Description** | Déterminer si le prospect est éligible à un RDV |

**Critères d'éligibilité:**

| Critère | Seuil |
|---------|-------|
| Revenus mensuels | >= 3 000€ net |
| Taux d'endettement après projet | <= 35% |
| Apport disponible | >= 10% du projet |
| TMI | >= 11% (intérêt fiscal) |

**Résultats:**

| Statut | Action |
|--------|--------|
| **Éligible** | Accès Calendly pour RDV |
| **Non éligible** | Message explicatif + conseils + proposition newsletter |

**Critères d'acceptation:**
- [ ] Calcul côté serveur (pas manipulable)
- [ ] Message personnalisé selon motif de non-éligibilité
- [ ] Suggestions pour devenir éligible (ex: "Remboursez X€ de crédit")
- [ ] Option "Me recontacter dans 6 mois"

---

#### REQ-ACC-004: Prise de RDV Calendly

| Attribut | Valeur |
|----------|--------|
| **ID** | REQ-ACC-004 |
| **Priorité** | P0 (Critique MVP) |
| **Description** | Intégration Calendly pour prospects éligibles |

**Critères d'acceptation:**
- [ ] Embed Calendly sur page dédiée
- [ ] Pré-remplissage nom/email depuis formulaire
- [ ] Webhook Calendly → Neon (statut lead = "rdv_pris")
- [ ] Email de confirmation avec rappel simulation
- [ ] Sync EspoCRM (lead avec RDV)

---

### 3.4 Module Paiement

#### REQ-PAY-001: Stripe Checkout

| Attribut | Valeur |
|----------|--------|
| **ID** | REQ-PAY-001 |
| **Priorité** | P0 (Critique MVP) |
| **Description** | Paiement packs simulations |

**Critères d'acceptation:**
- [ ] Stripe Checkout Session (redirect)
- [ ] Prix TTC avec TVA 20%
- [ ] Webhook checkout.session.completed
- [ ] Mise à jour quota dans EspoCRM
- [ ] Email confirmation avec reçu
- [ ] Mode test Stripe fonctionnel

---

#### REQ-PAY-002: Gestion quotas

| Attribut | Valeur |
|----------|--------|
| **ID** | REQ-PAY-002 |
| **Priorité** | P0 (Critique MVP) |
| **Description** | Suivi simulations par utilisateur |

**Critères d'acceptation:**
- [ ] Quota stocké dans EspoCRM (Contact)
- [ ] Simulation avancée décrémente quota
- [ ] Simulateur rapide toujours gratuit
- [ ] Overlay "Acheter" si quota épuisé
- [ ] Vérification quota côté serveur

---

### 3.5 Module Données

#### REQ-DATA-001: Données villes

| Attribut | Valeur |
|----------|--------|
| **ID** | REQ-DATA-001 |
| **Priorité** | P0 (Critique MVP) |
| **Description** | Données marché par ville |

**Sources et fréquences:**

| Donnée | Source | MAJ |
|--------|--------|-----|
| Prix m² | DVF (data.gouv.fr) | Mensuelle |
| Loyer m² | Observatoires/Clameur | Trimestrielle |
| Tension locative | INSEE | Annuelle |
| Plafonds Jeanbrun | Barèmes officiels | À modification |
| Zone fiscale | Administration | Annuelle |

---

#### REQ-DATA-002: Sync programmes

| Attribut | Valeur |
|----------|--------|
| **ID** | REQ-DATA-002 |
| **Priorité** | P1 (Important) |
| **Description** | Import programmes depuis API agrégateur |

**Critères d'acceptation:**
- [ ] Cron quotidien (3h)
- [ ] Nouveaux créés, existants mis à jour
- [ ] Programmes épuisés → statut "epuise"
- [ ] Log sync conservé 30 jours
- [ ] Alerte email si échec

---

## 4. Requirements techniques

### 4.1 Performance

#### REQ-PERF-001: Core Web Vitals

| Métrique | Cible |
|----------|-------|
| LCP | < 2.5s |
| FID | < 100ms |
| CLS | < 0.1 |
| TTFB | < 600ms |
| TTI | < 3.5s |

**Critères d'acceptation:**
- [ ] PageSpeed mobile >= 90
- [ ] PageSpeed desktop >= 95
- [ ] Aucune métrique "Poor" (rouge)
- [ ] Images WebP + lazy loading
- [ ] CSS critique inliné

---

#### REQ-PERF-002: Temps réponse API

| Endpoint | P95 | P99 |
|----------|-----|-----|
| GET /api/villes | < 200ms | < 500ms |
| GET /api/villes/[slug] | < 150ms | < 300ms |
| GET /api/programmes | < 300ms | < 600ms |
| POST /api/simulation | < 500ms | < 1000ms |
| POST /api/simulation/calcul | < 100ms | < 200ms |

---

### 4.2 SEO Technique

#### REQ-SEO-003: Stratégie rendu

| Page | Stratégie | Revalidation |
|------|-----------|--------------|
| Accueil | SSG | 1 heure |
| Villes | SSG | 24 heures |
| Programmes | ISR | 1 heure |
| Simulateur | SSR | N/A |
| Résultats | SSR | N/A |

---

### 4.3 Tests

#### REQ-TEST-001: Couverture

| Type | Cible | Framework |
|------|-------|-----------|
| Unitaires | 80% | Jest |
| Composants | 70% | Testing Library |
| E2E | Parcours critiques | Playwright |
| API | 90% endpoints | Supertest |

**Parcours E2E critiques:**
1. Simulation rapide complète
2. Simulation avancée 6 étapes
3. Paiement Stripe et déblocage
4. Navigation ville → simulateur
5. Export PDF

---

### 4.4 Sécurité

#### REQ-SEC-001: OWASP Top 10

| Risque | Mesure |
|--------|--------|
| Broken Access Control | Validation serveur quotas |
| Cryptographic Failures | HTTPS, secrets en env vars |
| Injection | Validation Zod inputs |
| Security Misconfiguration | Headers CSP, CORS restrictif |
| XSS | Échappement React, CSP |

**Critères d'acceptation:**
- [ ] Données sensibles non exposées
- [ ] Webhooks Stripe signature vérifiée
- [ ] Rate limiting 10 req/min par IP
- [ ] Headers sécurité configurés
- [ ] Audit sécurité avant production

---

## 5. User Stories MVP

### 5.1 Priorité P0 (Sprint 1-2)

| ID | User Story | Persona |
|----|------------|---------|
| US-001 | En tant que visiteur, je veux réaliser une simulation rapide gratuite afin de connaître mon économie d'impôt | P1, P3 |
| US-002 | En tant que visiteur, je veux voir les résultats avec économie annuelle et totale | Tous |
| US-003 | En tant que visiteur, je veux accéder à une page ville avec données marché | Tous |
| US-004 | En tant qu'utilisateur, je veux réaliser une simulation avancée 6 étapes | P1, P2 |
| US-005 | En tant qu'utilisateur, je veux sauvegarder ma simulation pour y revenir | Tous |

### 5.2 Priorité P1 (Sprint 3-4)

| ID | User Story | Persona |
|----|------------|---------|
| US-006 | En tant qu'utilisateur, je veux payer pour débloquer simulations | Tous |
| US-007 | En tant qu'utilisateur premium, je veux exporter en PDF | P2 |
| US-008 | En tant qu'utilisateur premium, je veux comparer Jeanbrun vs LMNP | P2 |
| US-009 | En tant que visiteur, je veux voir programmes neufs d'une ville | P1 |
| US-010 | En tant que visiteur, je veux la fiche détaillée d'un programme | P1, P2 |

### 5.3 Priorité P2 (Sprint 5-6)

| ID | User Story | Persona |
|----|------------|---------|
| US-011 | En tant qu'utilisateur, je veux partager ma simulation via lien | Tous |
| US-012 | En tant que visiteur mobile, je veux expérience optimisée | Tous |
| US-013 | En tant qu'utilisateur, je veux email avec récapitulatif | Tous |
| US-014 | En tant que visiteur, je veux filtrer programmes par prix | P1 |
| US-015 | En tant que visiteur, je veux voir programmes sur carte | P1 |

---

## 6. Contraintes techniques

### 6.1 Infrastructure

| ID | Contrainte | Impact |
|----|------------|--------|
| CT-001 | **Vercel + Neon** (aligné CardImmo) | Serverless, Edge Functions disponibles |
| CT-002 | Neon PostgreSQL (via Drizzle ORM) | Base principale, schéma custom |
| CT-003 | EspoCRM pour sync leads | API REST, entités custom |
| CT-004 | Budget Vercel Pro | Limites serverless functions |

### 6.2 Design

| ID | Contrainte | Impact |
|----|------------|--------|
| CD-001 | Mobile first (70%+ trafic) | Design responsive obligatoire |
| CD-002 | shadcn/ui uniquement | Pas Material UI, Chakra |
| CD-003 | Tailwind CSS v4 | Pas CSS modules |
| CD-004 | Accessibilité WCAG 2.1 AA | Tests axe-core obligatoires |

### 6.3 Légal

| ID | Contrainte | Impact |
|----|------------|--------|
| CL-001 | RGPD compliance | Bandeau cookies, politique confidentialité |
| CL-002 | Disclaimers fiscaux | "Simulation indicative" sur résultats |
| CL-003 | Mentions légales | Page dédiée obligatoire |
| CL-004 | CGV | Page CGV avant achat |

---

## 7. Critères de qualité

### 7.1 Accessibilité WCAG 2.1 AA

| Critère | Exigence | Vérification |
|---------|----------|--------------|
| 1.1.1 Non-text Content | Alt sur images | axe-core |
| 1.3.1 Info and Relationships | HTML sémantique | Lighthouse |
| 1.4.3 Contrast | Ratio 4.5:1 | axe-core |
| 2.1.1 Keyboard | Navigation clavier | Test manuel |
| 2.4.4 Link Purpose | Liens explicites | axe-core |
| 3.1.1 Language | lang="fr" | Validator |

### 7.2 Qualité code

| Métrique | Cible | Outil |
|----------|-------|-------|
| Couverture tests | >= 80% | Jest coverage |
| Complexité cyclomatique | < 10 | ESLint |
| Dette technique | < 2 jours | SonarQube |
| Duplications | < 3% | SonarQube |
| Taille fichiers | < 400 lignes | ESLint |

### 7.3 RGPD (Audit v2 - 30 janvier 2026)

> **Référence:** `/docs/REGISTRE-RGPD.md` (à créer avant développement)

#### 7.3.1 Bases légales par traitement

| Traitement | Base légale | Durée conservation |
|------------|-------------|-------------------|
| Simulation gratuite | **Intérêt légitime** | 3 ans inactivité |
| Découverte patrimoniale | **Consentement explicite** | 3 ans (prospect) |
| Accompagnement (RDV) | **Mesures précontractuelles** | 10 ans (client) |
| Revente leads CGP | **Consentement distinct** (opt-in séparé) | Jusqu'à retrait |
| Analytics | **Intérêt légitime** (cookie-less) ou consentement | Session |

#### 7.3.2 Consentements requis

| Formulaire | Consentements (cases séparées) |
|------------|-------------------------------|
| **Découverte patrimoniale** | ☐ J'accepte le traitement de mes données pour être accompagné (obligatoire) |
| | ☐ J'accepte d'être recontacté par des partenaires CGP (optionnel) |
| | ☐ J'accepte de recevoir des informations commerciales (optionnel) |

#### 7.3.3 Checklist conformité (P0)

- [ ] **Registre des traitements** (CNIL Art.30) - `/docs/REGISTRE-RGPD.md`
- [ ] **Politique de confidentialité** complète - `/app/politique-confidentialite`
- [ ] **Bandeau cookies** granulaire (Tarteaucitron ou équivalent)
- [ ] **Formulaire droits** (accès, rectification, effacement, portabilité)
- [ ] **DPA signé avec Stripe** (sous-traitant paiement)
- [ ] **Chiffrement données sensibles** (revenus, patrimoine) en base
- [ ] **Purge automatique** données > 3 ans inactivité
- [ ] **Opt-in double confirmation** pour revente leads

#### 7.3.4 Points critiques identifiés (audit)

| Risque | Mitigation | Statut |
|--------|------------|--------|
| Revente leads sans consentement | Opt-in séparé obligatoire | À implémenter |
| Données sensibles non chiffrées | Chiffrement Neon at-rest + column-level | À implémenter |
| Pas de DPA Stripe | Contrat standard Stripe | Disponible |
| Durées conservation floues | Définir par traitement | Fait (ci-dessus) |

---

## 8. Schéma d'API REST

### 8.1 Endpoints publics

```
GET /api/villes
  Query: ?zone=A,B1&limit=50&offset=0
  Response: { data: Ville[], total: number }

GET /api/villes/[slug]
  Response: Ville

GET /api/villes/[slug]/programmes
  Query: ?prixMin=100000&prixMax=300000&typeLot=T2,T3
  Response: { data: Programme[], total: number }

GET /api/villes/autocomplete
  Query: ?q=lyo
  Response: { suggestions: { name: string, slug: string }[] }

GET /api/programmes
  Query: ?villeSlug=lyon&eligible=true&limit=20
  Response: { data: Programme[], total: number }

GET /api/programmes/[slug]
  Response: Programme

POST /api/simulation/rapide
  Body: { villeSlug, budget, revenus, niveauLoyer }
  Response: { economieAnnuelle, economieTotale, loyerEstime }

POST /api/simulation/avancee
  Body: SimulationInput
  Response: { id, resultats: SimulationResult }

GET /api/simulation/[id]
  Response: Simulation
```

### 8.2 Endpoints authentifiés

```
GET /api/user/simulations
  Headers: Authorization: Bearer <token>
  Response: { simulations: Simulation[] }

GET /api/user/quota
  Headers: Authorization: Bearer <token>
  Response: { simulationsRestantes: number, expiration: Date }
```

### 8.3 Endpoints Stripe

```
POST /api/checkout/create-session
  Body: { priceId: string, email: string }
  Response: { sessionUrl: string }

POST /api/webhooks/stripe
  Headers: Stripe-Signature
  Response: { received: true }
```

### 8.4 Endpoints Accompagnement

```
POST /api/decouverte
  Body: DecouvertePatrimonialeInput
  Response: {
    id: string,
    eligible: boolean,
    qualification: QualificationResult,
    calendlyUrl?: string  // Si éligible
  }

GET /api/decouverte/[id]
  Response: DecouvertePatrimoniale

POST /api/calendly/webhook
  Headers: Calendly-Webhook-Signature
  Body: CalendlyEvent
  Response: { received: true }
  Action: Met à jour le lead dans Neon + sync EspoCRM

POST /api/leads/consent
  Body: { email: string, consentType: 'cgp_transfer' | 'newsletter', granted: boolean }
  Response: { updated: true }
```

### 8.5 Types TypeScript

```typescript
interface Ville {
  id: string;
  slug: string;
  name: string;
  departement: string;
  region: string;
  zoneFiscale: 'A' | 'A_bis' | 'B1' | 'B2' | 'C';
  prixM2Moyen: number;
  prixM2Median: number;
  evolutionPrix1An: number;
  loyerM2Moyen: number;
  tensionLocative: 'faible' | 'moyenne' | 'forte' | 'tres_forte';
  plafonds: {
    intermediaire: number;
    social: number;
    tresSocial: number;
  };
  nbProgrammes: number;
  metaTitle: string;
  metaDescription: string;
  dateMaj: string;
}

interface Programme {
  id: string;
  slug: string;
  name: string;
  promoteur: string;
  villeId: string;
  adresse: string;
  latitude: number;
  longitude: number;
  prixMin: number;
  prixMax: number;
  prixM2Moyen: number;
  nbLotsTotal: number;
  nbLotsDisponibles: number;
  typesLots: ('T1' | 'T2' | 'T3' | 'T4' | 'T5')[];
  dateLivraison: string;
  eligibleJeanbrun: boolean;
  zoneFiscale: string;
  images: string[];
  description: string;
  statut: 'disponible' | 'epuise' | 'livre';
}

interface SimulationInput {
  // Étape 1
  situationFamiliale: 'celibataire' | 'couple';
  partsFiscales: number;
  revenuNetImposable: number;
  objectif: 'reduire_impots' | 'revenus' | 'patrimoine' | 'retraite';

  // Étape 2
  typeBien: 'neuf' | 'ancien';
  villeSlug: string;
  surface: number;
  prixAcquisition: number;
  montantTravaux?: number;

  // Étape 3
  apport: number;
  dureeEmprunt: number;
  tauxEmprunt: number;
  assuranceEmprunt: number;
  differeMois?: number;

  // Étape 4
  niveauLoyer: 'intermediaire' | 'social' | 'tres_social';
  chargesCopro: number;
  taxeFonciere: number;
  fraisGestion: number;
  vacanceLocative: number;

  // Étape 5
  dureeDetention: number;
  revalorisationAnnuelle: number;
  strategieSortie: 'revente' | 'conservation';

  // Étape 6
  structureJuridique: 'nom_propre' | 'sci_ir' | 'sci_is';
  comparerLMNP: boolean;
}

interface SimulationResult {
  economieFiscaleAnnuelle: number;
  economieFiscaleTotale: number;
  loyerMensuelEstime: number;
  mensualiteCredit: number;
  cashFlowMensuel: number;
  rendementBrut: number;
  rendementNet: number;
  baseAmortissement: number;
  amortissementAnnuel: number;
  amortissementPlafonne: number;
  deficitFoncier: number;
  tableauAnnuel?: TableauAnnuel[];
  comparatifLMNP?: ComparatifLMNP;
  plusValueEstimee: number;
  impotPlusValue: number;
}

interface TableauAnnuel {
  annee: number;
  loyers: number;
  charges: number;
  interets: number;
  amortissement: number;
  revenuFoncier: number;
  economieImpot: number;
  cashFlow: number;
}

// --- Types Accompagnement (v2) ---

interface DecouvertePatrimonialeInput {
  // Identité
  nom: string;
  prenom: string;
  email: string;
  telephone: string;

  // Situation professionnelle
  statutPro: 'salarie' | 'independant' | 'retraite' | 'autre';
  ancienneteMois: number;

  // Revenus
  revenusMensuelsNets: number;
  revenusFonciersExistants: number;

  // Patrimoine
  residencePrincipale: boolean;
  valeurRP?: number;
  autresBiens: number;
  epargneDisponible: number;

  // Endettement
  creditsEnCours: {
    montantMensuel: number;
    dureeRestanteMois: number;
    type: 'immobilier' | 'conso' | 'autre';
  }[];

  // Projet
  budgetEnvisage: number;
  objectifPrincipal: 'reduire_impots' | 'revenus' | 'patrimoine' | 'retraite';
  horizonMois: number;

  // Consentements RGPD (obligatoires)
  consentementTraitement: boolean;  // Obligatoire
  consentementCGP: boolean;         // Optionnel (revente leads)
  consentementNewsletter: boolean;  // Optionnel
}

interface QualificationResult {
  eligible: boolean;
  score: number;  // 0-100
  criteres: {
    revenusSuffisants: boolean;      // >= 3000€
    endettementOk: boolean;          // <= 35%
    apportSuffisant: boolean;        // >= 10% projet
    tmiInteressant: boolean;         // >= 11%
  };
  motifNonEligibilite?: string;
  suggestions?: string[];  // Ex: "Remboursez 200€/mois de crédit"
}

interface DecouvertePatrimoniale extends DecouvertePatrimonialeInput {
  id: string;
  simulationId?: string;  // Lien vers simulation si existante
  qualification: QualificationResult;
  statut: 'nouveau' | 'rdv_pris' | 'accompagne' | 'converti' | 'perdu';
  dateCreation: string;
  dateMaj: string;
  espoContactId?: string;  // ID EspoCRM après sync
}

interface LeadConsent {
  email: string;
  consentType: 'cgp_transfer' | 'newsletter';
  granted: boolean;
  dateConsent: string;
  ipAddress: string;
  source: string;  // Page d'origine
}
```

---

## Annexes

### A. Glossaire

| Terme | Définition |
|-------|------------|
| Amortissement | Déduction fiscale usure bien |
| Déficit foncier | Charges > loyers perçus |
| TMI | Tranche Marginale d'Imposition |
| LMNP | Location Meublée Non Professionnelle |
| SCI | Société Civile Immobilière |
| ISR | Incremental Static Regeneration |
| SSG | Static Site Generation |
| SSR | Server-Side Rendering |

### B. Documents référence

| Document | Chemin |
|----------|--------|
| PRD complet | /root/simulateur_loi_Jeanbrun/PRD_Simulateur_Loi_Jeanbrun.md |
| Formules calcul | /root/simulateur_loi_Jeanbrun/formules_calcul_simulateur_jeanbrun.md |
| Wireframes | /root/simulateur_loi_Jeanbrun/wireframes_simulateur_jeanbrun.md |
| Schéma EspoCRM | /root/simulateur_loi_Jeanbrun/docs/ESPOCRM-SCHEMA.md |
| Pipeline scraping | /root/simulateur_loi_Jeanbrun/docs/SCRAPING-PIPELINE.md |

---

**Version:** 2.0
**Dernière mise à jour:** 30 janvier 2026
