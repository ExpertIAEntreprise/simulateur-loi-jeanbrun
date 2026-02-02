/**
 * Page wrapper pour les resultats de simulation
 * Server Component minimal qui rend le client component
 *
 * @module simulateur/resultat/[id]/page
 */

import { ResultatClient } from "./resultat-client";

// ============================================================================
// Route Segment Config (G.3.5)
// Force dynamic rendering as results depend on client-side localStorage
// ============================================================================

export const dynamic = "force-dynamic";
export const revalidate = 0;

// ============================================================================
// Page Component
// ============================================================================

interface ResultatPageProps {
  params: Promise<{ id: string }>;
}

export default function ResultatPage(_props: ResultatPageProps) {
  // The id param is available for future server-side data fetching
  // Currently all data comes from localStorage in the client component
  return <ResultatClient />;
}
