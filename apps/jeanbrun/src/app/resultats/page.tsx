import { redirect } from "next/navigation"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Resultats de votre simulation | Simulateur Loi Jeanbrun",
  description:
    "Decouvrez les resultats de votre simulation fiscale Loi Jeanbrun : economie d'impot, rendement net, effort d'epargne et comparatif avec le LMNP.",
  robots: {
    index: false,
    follow: true,
  },
}

/**
 * Redirect page for /resultats
 *
 * Server Component that generates a UUID and redirects to /resultats/[id]
 * Uses server-side redirect for better SEO and no client-side flash.
 * Simulation data is stored in localStorage and loaded by the target page.
 */
export default function ResultatsRedirectPage() {
  const uuid = crypto.randomUUID()
  redirect(`/resultats/${uuid}`)
}
