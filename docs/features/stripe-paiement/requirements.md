# Stripe Paiement - Requirements

**Feature:** Monetisation Stripe + Gestion Quotas + Export PDF
**Version:** 1.0
**Date:** 02 fevrier 2026
**Sprint:** 5 (S9-S10)

---

## 1. Description

La feature Monetisation permet aux utilisateurs de debloquer les fonctionnalites premium du simulateur via un paiement Stripe. Le modele freemium propose une simulation gratuite avec resultats basiques, et des packs payants pour acceder aux analyses detaillees, export PDF et comparatifs.

### Objectifs business

- Convertir les utilisateurs freemium en clients payants
- Generer du revenu via 2 packs (9,90 EUR et 14,90 EUR)
- Capturer des leads qualifies pour le service de conseil
- Fideliser avec le Pack Duo (acces illimite 30 jours)

### Objectifs utilisateur

- Debloquer facilement les sections premium
- Telecharger un rapport PDF professionnel
- Recevoir confirmation par email apres achat
- Gerer son solde de simulations

---

## 2. Exigences fonctionnelles

### 2.1 Produits Stripe

| ID Stripe | Nom | Prix TTC | Simulations | Usage |
|-----------|-----|----------|-------------|-------|
| price_pack3 | Pack 3 | 9,90 EUR | 3 avancees | One-time |
| price_duo30 | Pack Duo | 14,90 EUR | Illimite 30j | One-time |

**Criteres d'acceptation:**
- [ ] Produits crees dans Stripe Dashboard (test + live)
- [ ] Prix affiche en EUR TTC
- [ ] Metadata: type, simulations, validite

### 2.2 Checkout Stripe

**En tant qu'utilisateur**, je veux acheter un pack pour debloquer les fonctionnalites premium.

| Element | Specification |
|---------|---------------|
| Bouton achat | "Debloquer (9,90 EUR)" dans overlay |
| Redirection | Stripe Checkout hosted |
| Success URL | `/compte/succes?session_id={CHECKOUT_SESSION_ID}` |
| Cancel URL | `/simulateur/resultat/{simulationId}` |
| Email | Pre-rempli si connu |
| Metadata | email, simulationId |

**Criteres d'acceptation:**
- [ ] Bouton declenche redirection vers Stripe Checkout
- [ ] Email pre-rempli si utilisateur authentifie
- [ ] Session Stripe creee avec metadata
- [ ] Redirection success/cancel fonctionnelle
- [ ] Mode test et live configurable via env

### 2.3 Webhook Stripe

**En tant que systeme**, je veux traiter les paiements valides pour mettre a jour les quotas.

| Evenement | Action |
|-----------|--------|
| checkout.session.completed | Mise a jour quota + envoi email |
| payment_intent.payment_failed | Log erreur (optionnel) |

**Criteres d'acceptation:**
- [ ] Webhook endpoint `/api/webhooks/stripe`
- [ ] Signature Stripe verifiee
- [ ] Event checkout.session.completed traite
- [ ] Quota mis a jour selon pack achete
- [ ] Email confirmation envoye
- [ ] Idempotence (pas de double traitement)

### 2.4 Gestion des quotas

**En tant qu'utilisateur**, je veux voir mon solde de simulations restantes.

| Pack | Quota initial | Expiration |
|------|---------------|------------|
| Pack 3 | 3 simulations | Illimite |
| Pack Duo | 999 (illimite) | 30 jours |

**Logique:**
- Decrementation apres chaque simulation avancee completee
- Affichage quota dans header si > 0
- Alerte si quota = 1 (derniere simulation)
- Blocage si quota = 0

**Stockage:**
- EspoCRM: champ `cSimulationsQuota` sur Contact
- Local: localStorage comme fallback temporaire

**Criteres d'acceptation:**
- [ ] Quota affiche dans header utilisateur
- [ ] Decrementation apres simulation
- [ ] Alerte quota bas
- [ ] Blocage si quota epuise
- [ ] Sync EspoCRM

### 2.5 Overlay Premium

**En tant qu'utilisateur freemium**, je vois les sections premium floues avec CTA d'achat.

| Section | Statut | Overlay |
|---------|--------|---------|
| Synthese KPIs | Gratuit | Non |
| Graphique patrimoine | Gratuit (limite) | Partiel |
| Tableau annuel | Premium | Blur + CTA |
| Comparatif LMNP | Premium | Blur + CTA |
| Export PDF | Premium | Bouton desactive |

**Criteres d'acceptation:**
- [ ] Composant PremiumOverlay reutilisable
- [ ] Blur sur contenu premium
- [ ] Card CTA centree avec prix et bouton
- [ ] Animation fade-in au scroll
- [ ] Deblocage instantane apres paiement

### 2.6 Export PDF

**En tant qu'utilisateur premium**, je veux telecharger un rapport PDF de ma simulation.

| Element | Contenu |
|---------|---------|
| En-tete | Logo, date, identifiant simulation |
| Section 1 | Synthese investissement (4 KPIs) |
| Section 2 | Details fiscaux (IR, Jeanbrun, economies) |
| Section 3 | Tableau annuel sur 9 ans |
| Section 4 | Graphique patrimoine |
| Section 5 | Comparatif LMNP vs Jeanbrun |
| Pied de page | Mentions legales, contact |

**Criteres d'acceptation:**
- [ ] Generation PDF avec @react-pdf/renderer
- [ ] Design coherent avec l'app (dark theme)
- [ ] Graphique rendu en image
- [ ] Telelechargement direct navigateur
- [ ] Nom fichier: `simulation-jeanbrun-{id}.pdf`
- [ ] Taille < 2 MB

### 2.7 Email confirmation

**En tant qu'utilisateur**, je recois un email apres mon achat.

| Element | Contenu |
|---------|---------|
| Objet | "Confirmation de votre achat - Simulateur Loi Jeanbrun" |
| Corps | Merci, recapitulatif pack, lien simulateur |
| CTA | "Acceder a mes simulations" |
| Footer | Contact support, mentions legales |

**Criteres d'acceptation:**
- [ ] Email envoye via Mailjet ou Resend
- [ ] Template HTML responsive
- [ ] Recapitulatif achat (pack, prix, date)
- [ ] Lien vers simulateur
- [ ] Envoi dans les 30 secondes apres paiement

---

## 3. Exigences non-fonctionnelles

### 3.1 Securite

- Webhook signature Stripe obligatoire
- Pas de donnees sensibles en localStorage
- HTTPS obligatoire pour checkout
- Idempotence sur webhook (traitement unique)
- Rate limiting sur endpoints sensibles

### 3.2 Performance

- Checkout redirect < 2s
- Generation PDF < 5s
- Webhook traitement < 10s
- Email envoye < 30s apres paiement

### 3.3 Fiabilite

- Mode test Stripe en dev
- Logs detailles sur webhook
- Retry automatique email si echec
- Fallback localStorage si EspoCRM indisponible

### 3.4 UX

- Feedback immediat apres clic achat
- Spinner pendant checkout
- Animation deblocage sections
- Toast confirmation paiement
- PDF preview avant telechargement (optionnel)

---

## 4. Exigences techniques

### 4.1 Variables d'environnement

```env
# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_PACK3=price_...
STRIPE_PRICE_DUO30=price_...

# Email
MAILJET_API_KEY=...
MAILJET_SECRET_KEY=...
EMAIL_FROM=noreply@simulateur-loi-jeanbrun.fr

# EspoCRM (existant)
ESPOCRM_API_KEY=...
ESPOCRM_URL=https://espocrm.expert-ia-entreprise.fr
```

### 4.2 Dependances

| Package | Version | Usage |
|---------|---------|-------|
| stripe | ^16.x | API Stripe |
| @react-pdf/renderer | ^4.x | Generation PDF |
| mailjet | ^3.x | Envoi emails |

### 4.3 Structure fichiers

```
src/
├── app/api/
│   ├── checkout/
│   │   └── create-session/route.ts
│   └── webhooks/
│       └── stripe/route.ts
├── components/simulateur/resultats/
│   ├── PremiumOverlay.tsx
│   └── ExportPDFButton.tsx
├── lib/
│   ├── stripe.ts
│   ├── email/
│   │   ├── send-confirmation.ts
│   │   └── templates/
│   │       └── achat-confirmation.tsx
│   └── pdf/
│       ├── generate-rapport.tsx
│       └── components/
│           ├── RapportPDF.tsx
│           ├── SectionSynthese.tsx
│           ├── TableauAnnuel.tsx
│           └── GraphiquePatrimoine.tsx
└── types/
    └── stripe.ts
```

---

## 5. Criteres d'acceptation globaux

### Fonctionnels

- [ ] Achat Pack 3 (9,90 EUR) fonctionnel
- [ ] Achat Pack Duo (14,90 EUR) fonctionnel
- [ ] Webhook traite checkout.session.completed
- [ ] Quota mis a jour dans EspoCRM
- [ ] Sections premium debloquees apres paiement
- [ ] Export PDF fonctionnel
- [ ] Email confirmation envoye

### Techniques

- [ ] Stripe mode test fonctionnel
- [ ] Stripe mode live configure
- [ ] Signature webhook verifiee
- [ ] TypeScript strict
- [ ] Tests unitaires >= 70%
- [ ] Logs structures pour debugging

### UX

- [ ] Checkout fluide (< 5 clics)
- [ ] Feedback visuel a chaque etape
- [ ] Erreurs explicites si echec
- [ ] Mobile responsive

---

## 6. Hors scope (Sprint 5)

- Abonnements recurrents (futur)
- Factures automatiques (futur)
- Remboursements automatiques (manuel)
- Multi-devise (EUR uniquement)
- Apple Pay / Google Pay (checkout Stripe gere)

---

## 7. Dependances externes

| Dependance | Type | Impact |
|------------|------|--------|
| Stripe Dashboard | Configuration | Produits a creer |
| Mailjet/Resend | Email | Compte a configurer |
| EspoCRM | Stockage | Champ cSimulationsQuota |
| Vercel | Hosting | Webhook URL publique |

---

**References:**
- Phase spec: `docs/phases/PHASE-5-MONETISATION.md`
- Stripe docs: https://stripe.com/docs/checkout
- React PDF: https://react-pdf.org/
- Mailjet: https://dev.mailjet.com/
