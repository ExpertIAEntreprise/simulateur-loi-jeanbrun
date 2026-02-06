import { redirect } from "next/navigation"

/**
 * Backwards compatibility redirect
 * Old URL: /simulateur/resultat → New URL: /resultats
 */
export default function ResultatRedirectPage() {
  redirect("/resultats")
}
