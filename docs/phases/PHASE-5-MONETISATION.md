# Phase 5 - Monétisation

**Sprint:** 5
**Semaines:** S9-S10 (31 Mars - 11 Avril 2026)
**Effort estimé:** 15,5 jours
**Objectif:** Paiement Stripe + Export PDF fonctionnels

---

## 1. Livrables

| Livrable | Critère validation |
|----------|-------------------|
| Stripe Checkout | Paiement test OK |
| Webhook Stripe | checkout.session.completed traité |
| Gestion quotas | Décrémentation après simulation |
| Overlay premium | Sections masquées |
| Export PDF | Génération + téléchargement |
| Email confirmation | Envoi après achat |

---

## 2. Produits Stripe

| ID | Nom | Prix TTC | Simulations |
|----|-----|----------|-------------|
| price_pack3 | Pack 3 | 9,90€ | 3 avancées |
| price_duo30 | Pack Duo | 14,90€ | Illimité 30j |

---

## 3. Tâches clés

### 3.1 Endpoint checkout (1j)

```typescript
// src/app/api/checkout/create-session/route.ts
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: Request) {
  const { priceId, email, simulationId } = await request.json()

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    mode: 'payment',
    customer_email: email,
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/compte/succes?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/simulateur/resultat/${simulationId}`,
    metadata: { email, simulationId },
  })

  return Response.json({ sessionUrl: session.url })
}
```

### 3.2 Webhook Stripe (1,5j)

```typescript
// src/app/api/webhooks/stripe/route.ts
import Stripe from 'stripe'
import { headers } from 'next/headers'
import { espocrm } from '@/lib/api/espocrm'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: Request) {
  const body = await request.text()
  const signature = headers().get('stripe-signature')!

  const event = stripe.webhooks.constructEvent(
    body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!
  )

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const { email } = session.metadata!

    // Mise à jour quota EspoCRM
    const quota = session.amount_total === 990 ? 3 : 999
    await espocrm.updateContactQuota(email, quota)

    // Email confirmation
    await sendConfirmationEmail(email, session)
  }

  return Response.json({ received: true })
}
```

### 3.3 Overlay premium (1j)

```tsx
// src/components/simulateur/resultats/PremiumOverlay.tsx
export function PremiumOverlay({ children, locked }) {
  if (!locked) return children

  return (
    <div className="relative">
      <div className="blur-sm pointer-events-none">{children}</div>
      <div className="absolute inset-0 flex items-center justify-center bg-background/80">
        <Card className="p-6 text-center">
          <Lock className="mx-auto h-8 w-8 text-muted-foreground" />
          <h3 className="mt-2 font-semibold">Contenu Premium</h3>
          <p className="text-sm text-muted-foreground">
            Débloquez l'accès complet
          </p>
          <Button className="mt-4">Acheter (9,90€)</Button>
        </Card>
      </div>
    </div>
  )
}
```

### 3.4 Export PDF (2j)

```typescript
// src/lib/pdf/generate-rapport.tsx
import { renderToBuffer } from '@react-pdf/renderer'
import { RapportPDF } from './RapportPDF'

export async function generateRapportPDF(simulation: SimulationResult) {
  const buffer = await renderToBuffer(
    <RapportPDF simulation={simulation} />
  )
  return buffer
}
```

---

## 4. Checklist

- [ ] Stripe Checkout test OK
- [ ] Webhook traite événements
- [ ] Quota mis à jour dans EspoCRM
- [ ] Overlay sur sections premium
- [ ] PDF généré correctement
- [ ] Email confirmation envoyé

---

**Date:** 30 janvier 2026
