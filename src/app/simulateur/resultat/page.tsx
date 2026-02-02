import { redirect } from "next/navigation"

/**
 * Redirect page for /simulateur/resultat
 *
 * Server Component that generates a UUID and redirects to /simulateur/resultat/[id]
 * Uses server-side redirect for better SEO and no client-side flash
 * The actual simulation data is stored in localStorage and loaded by the target page
 */
export default function ResultatRedirectPage() {
  const uuid = crypto.randomUUID()
  redirect(`/simulateur/resultat/${uuid}`)
}
