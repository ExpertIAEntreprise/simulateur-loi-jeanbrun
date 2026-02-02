# Stripe Paiement - Plan d'implementation

**Feature:** Monetisation Stripe + Gestion Quotas + Export PDF
**Estimation totale:** 8 jours
**Date:** 02 fevrier 2026
**Sprint:** 5 (S9-S10)

---

## Vue d'ensemble des phases

| Phase | Description | Effort | Dependances | Statut |
|-------|-------------|--------|-------------|--------|
| A | Configuration Stripe | 0,5j | - | A faire |
| B | Checkout API | 1j | Phase A | A faire |
| C | Webhook Stripe | 1,5j | Phase B | A faire |
| D | Gestion Quotas | 1j | Phase C | A faire |
| E | Overlay Premium | 1j | - | A faire |
| F | Export PDF | 2j | Phase D | A faire |
| G | Email Confirmation | 0,5j | Phase C | A faire |
| H | Tests + Integration | 0,5j | Toutes | A faire |

---

## Phase A - Configuration Stripe (0,5j)

**Objectif:** Configurer Stripe Dashboard et variables d'environnement.

### Taches

- [ ] **A.1** Creer produits Stripe Dashboard (0,25j)
  - Pack 3: 9,90 EUR, one-time, metadata: {type: "pack3", simulations: 3}
  - Pack Duo: 14,90 EUR, one-time, metadata: {type: "duo30", simulations: 999, validity: 30}
  - Mode test d'abord, puis live

- [ ] **A.2** Configurer variables d'environnement (0,25j)
  - Ajouter dans `.env.local`:
    ```env
    STRIPE_SECRET_KEY=sk_test_...
    STRIPE_PUBLISHABLE_KEY=pk_test_...
    STRIPE_WEBHOOK_SECRET=whsec_...
    STRIPE_PRICE_PACK3=price_...
    STRIPE_PRICE_DUO30=price_...
    ```
  - Ajouter dans Vercel Dashboard (production)
  - Fichier: `src/lib/env.ts` (ajouter validation)

### Livrables

- Produits Stripe crees (test)
- Variables d'environnement configurees

---

## Phase B - Checkout API (1j)

**Objectif:** Creer endpoint pour initier Stripe Checkout.

### Taches

- [ ] **B.1** Creer lib Stripe (0,25j)
  - Instance Stripe singleton
  - Types TypeScript
  - Fichier: `src/lib/stripe.ts`

```typescript
import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
})

export type ProductType = 'pack3' | 'duo30'

export const STRIPE_PRICES: Record<ProductType, string> = {
  pack3: process.env.STRIPE_PRICE_PACK3!,
  duo30: process.env.STRIPE_PRICE_DUO30!,
}
```

- [ ] **B.2** Creer types Stripe (0,25j)
  - Request/Response types
  - Fichier: `src/types/stripe.ts`

```typescript
export interface CreateCheckoutRequest {
  priceId: string
  email?: string
  simulationId: string
}

export interface CreateCheckoutResponse {
  sessionUrl: string
  sessionId: string
}
```

- [ ] **B.3** Creer endpoint checkout (0,5j)
  - Route: `/api/checkout/create-session`
  - Validation Zod
  - Creation session Stripe
  - Fichier: `src/app/api/checkout/create-session/route.ts`

```typescript
import { stripe, STRIPE_PRICES } from '@/lib/stripe'
import { z } from 'zod'

const requestSchema = z.object({
  productType: z.enum(['pack3', 'duo30']),
  email: z.string().email().optional(),
  simulationId: z.string().uuid(),
})

export async function POST(request: Request) {
  const body = await request.json()
  const { productType, email, simulationId } = requestSchema.parse(body)

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{ price: STRIPE_PRICES[productType], quantity: 1 }],
    mode: 'payment',
    customer_email: email,
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/compte/succes?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/simulateur/resultat/${simulationId}`,
    metadata: { email: email || '', simulationId, productType },
  })

  return Response.json({ sessionUrl: session.url, sessionId: session.id })
}
```

### Livrables

- Lib Stripe configuree
- Endpoint checkout fonctionnel
- Redirection vers Stripe Checkout

---

## Phase C - Webhook Stripe (1,5j)

**Objectif:** Traiter les paiements valides via webhook.

### Taches

- [ ] **C.1** Creer endpoint webhook (0,5j)
  - Route: `/api/webhooks/stripe`
  - Verification signature
  - Fichier: `src/app/api/webhooks/stripe/route.ts`

```typescript
import { stripe } from '@/lib/stripe'
import { headers } from 'next/headers'

export async function POST(request: Request) {
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')!

  let event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return new Response('Invalid signature', { status: 400 })
  }

  // Traitement evenement
  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutCompleted(event.data.object)
      break
    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  return Response.json({ received: true })
}
```

- [ ] **C.2** Implementer handleCheckoutCompleted (0,5j)
  - Extraire metadata
  - Mettre a jour quota
  - Declencher email
  - Fichier: `src/lib/stripe/handlers.ts`

```typescript
import type Stripe from 'stripe'
import { updateContactQuota } from '@/lib/api/espocrm'
import { sendConfirmationEmail } from '@/lib/email/send-confirmation'

export async function handleCheckoutCompleted(
  session: Stripe.Checkout.Session
) {
  const { email, simulationId, productType } = session.metadata || {}

  if (!email) {
    console.error('No email in session metadata')
    return
  }

  // Determiner quota selon pack
  const quota = productType === 'pack3' ? 3 : 999
  const expiresAt = productType === 'duo30'
    ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    : null

  // Mise a jour EspoCRM
  await updateContactQuota(email, quota, expiresAt)

  // Email confirmation
  await sendConfirmationEmail({
    email,
    productType: productType as 'pack3' | 'duo30',
    amount: session.amount_total! / 100,
    simulationId,
  })
}
```

- [ ] **C.3** Configurer webhook Stripe Dashboard (0,25j)
  - URL: `https://simulateur-loi-jeanbrun.vercel.app/api/webhooks/stripe`
  - Evenements: `checkout.session.completed`
  - Recuperer `STRIPE_WEBHOOK_SECRET`

- [ ] **C.4** Ajouter idempotence (0,25j)
  - Stocker event.id traites
  - Eviter double traitement
  - Cache Redis ou table DB

### Livrables

- Webhook endpoint fonctionnel
- Signature verifiee
- Quota mis a jour
- Email declenche

---

## Phase D - Gestion Quotas (1j)

**Objectif:** Gerer les quotas de simulations utilisateur.

### Taches

- [ ] **D.1** Ajouter champ EspoCRM (0,25j)
  - Champ: `cSimulationsQuota` (Integer, default 0)
  - Champ: `cQuotaExpiresAt` (DateTime, nullable)
  - Via admin EspoCRM ou API

- [ ] **D.2** Creer API EspoCRM quota (0,25j)
  - Fonction: `updateContactQuota(email, quota, expiresAt)`
  - Fonction: `getContactQuota(email)`
  - Fichier: `src/lib/api/espocrm/quota.ts`

```typescript
export async function updateContactQuota(
  email: string,
  quota: number,
  expiresAt: Date | null
) {
  // Trouver contact par email
  const contact = await findContactByEmail(email)
  if (!contact) {
    throw new Error(`Contact not found: ${email}`)
  }

  // Mise a jour quota
  await espocrm.put(`/Contact/${contact.id}`, {
    cSimulationsQuota: quota,
    cQuotaExpiresAt: expiresAt?.toISOString() || null,
  })
}

export async function getContactQuota(email: string): Promise<{
  quota: number
  expiresAt: Date | null
}> {
  const contact = await findContactByEmail(email)
  if (!contact) {
    return { quota: 0, expiresAt: null }
  }

  return {
    quota: contact.cSimulationsQuota || 0,
    expiresAt: contact.cQuotaExpiresAt
      ? new Date(contact.cQuotaExpiresAt)
      : null,
  }
}
```

- [ ] **D.3** Creer hook useQuota (0,25j)
  - Fetch quota utilisateur
  - Cache SWR
  - Fichier: `src/hooks/useQuota.ts`

```typescript
import useSWR from 'swr'

export function useQuota(email: string | undefined) {
  const { data, error, mutate } = useSWR(
    email ? `/api/quota?email=${email}` : null,
    fetcher
  )

  return {
    quota: data?.quota ?? 0,
    expiresAt: data?.expiresAt ? new Date(data.expiresAt) : null,
    isLoading: !error && !data,
    isExpired: data?.expiresAt && new Date(data.expiresAt) < new Date(),
    mutate,
  }
}
```

- [ ] **D.4** Creer endpoint quota API (0,25j)
  - Route: `/api/quota`
  - GET: Recuperer quota
  - POST: Decrementer quota
  - Fichier: `src/app/api/quota/route.ts`

### Livrables

- Champ EspoCRM cree
- API quota fonctionnelle
- Hook useQuota

---

## Phase E - Overlay Premium (1j)

**Objectif:** Creer composant overlay pour sections premium.

### Taches

- [ ] **E.1** Creer composant PremiumOverlay (0,5j)
  - Props: children, locked, onUnlock
  - Blur sur contenu
  - Card CTA centree
  - Fichier: `src/components/simulateur/resultats/PremiumOverlay.tsx`

```tsx
import { Lock } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface PremiumOverlayProps {
  children: React.ReactNode
  locked: boolean
  onUnlock: () => void
  price?: string
  title?: string
}

export function PremiumOverlay({
  children,
  locked,
  onUnlock,
  price = '9,90 EUR',
  title = 'Contenu Premium',
}: PremiumOverlayProps) {
  if (!locked) return <>{children}</>

  return (
    <div className="relative">
      <div className="blur-sm pointer-events-none select-none">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        <Card className="p-6 text-center max-w-sm mx-4">
          <Lock className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Debloquez l'acces complet a cette section
          </p>
          <Button onClick={onUnlock} className="mt-4 w-full">
            Debloquer ({price})
          </Button>
        </Card>
      </div>
    </div>
  )
}
```

- [ ] **E.2** Creer hook useCheckout (0,25j)
  - Fonction initiateCheckout
  - Gestion loading/error
  - Fichier: `src/hooks/useCheckout.ts`

```typescript
import { useState } from 'react'

export function useCheckout() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function initiateCheckout(
    productType: 'pack3' | 'duo30',
    simulationId: string,
    email?: string
  ) {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/checkout/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productType, simulationId, email }),
      })

      const { sessionUrl } = await response.json()
      window.location.href = sessionUrl
    } catch (err) {
      setError('Erreur lors de la creation du checkout')
      setIsLoading(false)
    }
  }

  return { initiateCheckout, isLoading, error }
}
```

- [ ] **E.3** Integrer overlay dans page resultats (0,25j)
  - Wrapper TableauAnnuel
  - Wrapper ComparatifLMNP
  - Fichier: `src/app/simulateur/resultat/[id]/page.tsx` (modification)

### Livrables

- Composant PremiumOverlay
- Hook useCheckout
- Integration page resultats

---

## Phase F - Export PDF (2j)

**Objectif:** Generer et telecharger rapport PDF.

### Taches

- [ ] **F.1** Installer @react-pdf/renderer (0,25j)
  ```bash
  pnpm add @react-pdf/renderer
  ```

- [ ] **F.2** Creer composant RapportPDF (1j)
  - Document structure
  - Styles coherents
  - Fichier: `src/lib/pdf/RapportPDF.tsx`

```tsx
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#0A0A0B',
    padding: 40,
    color: '#FAFAFA',
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#F5A623',
  },
  // ... autres styles
})

interface RapportPDFProps {
  simulation: SimulationResult
  generatedAt: Date
}

export function RapportPDF({ simulation, generatedAt }: RapportPDFProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Simulation Loi Jeanbrun</Text>
            <Text>Generee le {generatedAt.toLocaleDateString('fr-FR')}</Text>
          </View>
        </View>

        {/* Section Synthese */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Synthese</Text>
          {/* KPIs */}
        </View>

        {/* Section Details fiscaux */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Details fiscaux</Text>
          {/* Tableau */}
        </View>

        {/* ... autres sections */}
      </Page>
    </Document>
  )
}
```

- [ ] **F.3** Creer fonction generation PDF (0,25j)
  - Render to buffer
  - Fichier: `src/lib/pdf/generate-rapport.ts`

```typescript
import { renderToBuffer } from '@react-pdf/renderer'
import { RapportPDF } from './RapportPDF'

export async function generateRapportPDF(
  simulation: SimulationResult
): Promise<Buffer> {
  const buffer = await renderToBuffer(
    <RapportPDF simulation={simulation} generatedAt={new Date()} />
  )
  return buffer
}
```

- [ ] **F.4** Creer endpoint download PDF (0,25j)
  - Route: `/api/pdf/download`
  - Headers Content-Disposition
  - Fichier: `src/app/api/pdf/download/route.ts`

```typescript
import { generateRapportPDF } from '@/lib/pdf/generate-rapport'

export async function POST(request: Request) {
  const { simulation } = await request.json()

  const buffer = await generateRapportPDF(simulation)

  return new Response(buffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="simulation-jeanbrun-${simulation.id}.pdf"`,
    },
  })
}
```

- [ ] **F.5** Creer bouton ExportPDFButton (0,25j)
  - Loading state
  - Download declenchement
  - Fichier: `src/components/simulateur/resultats/ExportPDFButton.tsx`

```tsx
export function ExportPDFButton({
  simulation,
  disabled = false,
}: ExportPDFButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  async function handleDownload() {
    setIsGenerating(true)
    try {
      const response = await fetch('/api/pdf/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ simulation }),
      })

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `simulation-jeanbrun-${simulation.id}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Button onClick={handleDownload} disabled={disabled || isGenerating}>
      {isGenerating ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generation...
        </>
      ) : (
        <>
          <Download className="mr-2 h-4 w-4" />
          Telecharger PDF
        </>
      )}
    </Button>
  )
}
```

### Livrables

- Composant RapportPDF
- Endpoint download
- Bouton export fonctionnel

---

## Phase G - Email Confirmation (0,5j)

**Objectif:** Envoyer email de confirmation apres achat.

### Taches

- [ ] **G.1** Configurer Mailjet/Resend (0,25j)
  - Variables d'environnement
  - Fichier: `src/lib/email/client.ts`

```typescript
import Mailjet from 'node-mailjet'

export const mailjet = Mailjet.apiConnect(
  process.env.MAILJET_API_KEY!,
  process.env.MAILJET_SECRET_KEY!
)
```

- [ ] **G.2** Creer template email (0,25j)
  - HTML responsive
  - Fichier: `src/lib/email/templates/achat-confirmation.tsx`

```typescript
export function generateConfirmationEmail({
  productType,
  amount,
  simulationUrl,
}: {
  productType: 'pack3' | 'duo30'
  amount: number
  simulationUrl: string
}) {
  const productName = productType === 'pack3' ? 'Pack 3 Simulations' : 'Pack Duo 30 jours'

  return `
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; background: #0A0A0B; color: #FAFAFA; padding: 40px;">
      <div style="max-width: 600px; margin: 0 auto;">
        <h1 style="color: #F5A623;">Merci pour votre achat !</h1>
        <p>Votre achat de <strong>${productName}</strong> (${amount} EUR) a ete confirme.</p>
        <p>Vous pouvez maintenant acceder a toutes les fonctionnalites premium.</p>
        <a href="${simulationUrl}" style="display: inline-block; background: #F5A623; color: #0A0A0B; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 20px;">
          Acceder a mes simulations
        </a>
        <p style="margin-top: 40px; font-size: 12px; color: #A1A1AA;">
          Simulateur Loi Jeanbrun - Expert IA Entreprise<br/>
          Contact: support@expert-ia-entreprise.fr
        </p>
      </div>
    </body>
    </html>
  `
}
```

- [ ] **G.3** Creer fonction envoi (0,25j)
  - Fichier: `src/lib/email/send-confirmation.ts`

```typescript
import { mailjet } from './client'
import { generateConfirmationEmail } from './templates/achat-confirmation'

export async function sendConfirmationEmail({
  email,
  productType,
  amount,
  simulationId,
}: {
  email: string
  productType: 'pack3' | 'duo30'
  amount: number
  simulationId: string
}) {
  const simulationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/simulateur/resultat/${simulationId}`

  const html = generateConfirmationEmail({ productType, amount, simulationUrl })

  await mailjet.post('send', { version: 'v3.1' }).request({
    Messages: [
      {
        From: {
          Email: process.env.EMAIL_FROM,
          Name: 'Simulateur Loi Jeanbrun',
        },
        To: [{ Email: email }],
        Subject: 'Confirmation de votre achat - Simulateur Loi Jeanbrun',
        HTMLPart: html,
      },
    ],
  })
}
```

### Livrables

- Client email configure
- Template email
- Fonction envoi

---

## Phase H - Tests + Integration (0,5j)

**Objectif:** Tests et verification parcours complet.

### Taches

- [ ] **H.1** Tests unitaires (0,25j)
  - Test webhook handler
  - Test quota functions
  - Test PDF generation
  - Fichiers: `src/lib/__tests__/stripe.test.ts`, etc.

- [ ] **H.2** Test integration E2E (0,25j)
  - Parcours achat complet (mode test)
  - Verification deblocage sections
  - Fichier: `e2e/checkout.spec.ts`

```typescript
test('should complete checkout and unlock premium', async ({ page }) => {
  // 1. Aller sur page resultats
  await page.goto('/simulateur/resultat/test-id')

  // 2. Cliquer sur debloquer
  await page.click('text=Debloquer')

  // 3. Verifier redirection Stripe
  await page.waitForURL(/checkout.stripe.com/)

  // 4. (Mode test) Remplir carte test
  // 4242 4242 4242 4242

  // 5. Verifier retour success
  // 6. Verifier sections debloquees
})
```

### Livrables

- Tests unitaires passes
- Parcours E2E valide
- Mode test/live fonctionnel

---

## Calendrier suggere

| Jour | Phases | Description |
|------|--------|-------------|
| J1 | A + B | Configuration + Checkout API |
| J2 | C.1-C.2 | Webhook creation |
| J3 | C.3-C.4 + D.1-D.2 | Webhook config + EspoCRM quota |
| J4 | D.3-D.4 + E.1 | Hook quota + Overlay debut |
| J5 | E.2-E.3 + F.1-F.2 | Overlay fin + PDF debut |
| J6 | F.2-F.3 | PDF composant |
| J7 | F.4-F.5 + G | PDF endpoint + Email |
| J8 | H | Tests + Integration finale |

---

## Risques identifies

| Risque | Impact | Mitigation |
|--------|--------|------------|
| Webhook non recu | Paiement sans quota | Logs detailles, retry Stripe |
| PDF trop lourd | Timeout | Optimiser images, pagination |
| Email spam | Non delivre | SPF/DKIM configure, Mailjet reputation |
| EspoCRM indisponible | Quota non sauve | Fallback localStorage + sync ulterieure |

---

## Definition of Done

- [ ] Stripe Checkout test OK
- [ ] Webhook traite checkout.session.completed
- [ ] Quota mis a jour dans EspoCRM
- [ ] Overlay sur sections premium
- [ ] PDF genere et telecharge
- [ ] Email confirmation envoye
- [ ] Tests passes >= 70% coverage
- [ ] Mode test + live configures

---

**References:**
- Requirements: `docs/features/stripe-paiement/requirements.md`
- Phase spec: `docs/phases/PHASE-5-MONETISATION.md`
- Stripe Checkout: https://stripe.com/docs/checkout/quickstart
- React PDF: https://react-pdf.org/repl
