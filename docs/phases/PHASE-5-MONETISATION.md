# Phase 5 - Monetisation

**Sprint:** 5
**Semaines:** S9-S10 (31 Mars - 11 Avril 2026)
**Effort estime:** 8 jours
**Objectif:** Paiement Stripe + Export PDF fonctionnels

---

## 1. Decisions techniques

### Modele economique

| Decision | Choix | Justification |
|----------|-------|---------------|
| Processeur paiement | Stripe Checkout | Integration simple, reputation, support EU |
| Mode paiement | One-time (pas d'abo) | MVP simple, conversion directe |
| Stockage quotas | EspoCRM | Deja utilise pour leads, centralise |
| Generation PDF | @react-pdf/renderer | React natif, SSR compatible |
| Email transactionnel | Mailjet | Deja configure, deliverabilite FR |

### Produits

| Produit | Prix TTC | Simulations | Validite |
|---------|----------|-------------|----------|
| Pack 3 | 9,90 EUR | 3 avancees | Illimite |
| Pack Duo | 14,90 EUR | Illimite | 30 jours |

### Architecture

| Composant | Route/Fichier | Responsabilite |
|-----------|---------------|----------------|
| Checkout API | `/api/checkout/create-session` | Creer session Stripe |
| Webhook | `/api/webhooks/stripe` | Traiter paiements |
| Quota API | `/api/quota` | CRUD quotas utilisateur |
| PDF API | `/api/pdf/download` | Generer rapport |
| PremiumOverlay | `components/simulateur/resultats/` | Blur sections premium |

---

## 2. Sections Premium vs Free

| Section | Acces |
|---------|-------|
| Synthese KPIs (4 cards) | Free |
| Graphique patrimoine | Free (limite) |
| Tableau annuel detaille | Premium |
| Comparatif LMNP | Premium |
| Export PDF | Premium |
| Conseil personnalise | Premium |

---

## 3. Flux paiement

```
1. User clique "Debloquer (9,90 EUR)"
2. Frontend POST /api/checkout/create-session
3. Backend cree session Stripe avec metadata
4. Redirect vers Stripe Checkout
5. User paie avec carte
6. Stripe POST webhook checkout.session.completed
7. Backend verifie signature + met a jour quota EspoCRM
8. Backend envoie email confirmation
9. User redirige vers /compte/succes
10. Page resultats detecte quota > 0, debloque sections
```

---

## 4. Securite

| Mesure | Implementation |
|--------|----------------|
| Signature webhook | `stripe.webhooks.constructEvent()` |
| Idempotence | Stocker event.id traites |
| HTTPS | Obligatoire pour checkout |
| Rate limiting | 10 req/min sur endpoints sensibles |

---

## 5. Livrables

- [ ] Stripe Checkout test OK
- [ ] Webhook traite evenements
- [ ] Quota mis a jour dans EspoCRM
- [ ] Overlay sur sections premium
- [ ] PDF genere correctement
- [ ] Email confirmation envoye

---

## 6. Feature details

Implementation detaillee dans:
- `docs/features/stripe-paiement/requirements.md`
- `docs/features/stripe-paiement/plan.md`

---

**Date:** 02 fevrier 2026
