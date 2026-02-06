import { redirect } from "next/navigation"

/**
 * Page index simulateur
 * Redirige vers le wizard avance (etape 1)
 */
export default function SimulateurPage() {
  redirect("/simulateur/avance")
}
