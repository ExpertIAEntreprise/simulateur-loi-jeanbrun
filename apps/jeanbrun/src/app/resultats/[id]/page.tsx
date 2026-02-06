/**
 * Page resultats de simulation - URL canonique
 * Server Component minimal qui rend le client component
 *
 * @module resultats/[id]/page
 */

import { ResultatClient } from "./resultat-client";

// Force dynamic rendering as results depend on client-side localStorage
export const dynamic = "force-dynamic";
export const revalidate = 0;

interface ResultatsPageProps {
  params: Promise<{ id: string }>;
}

export default function ResultatsPage(_props: ResultatsPageProps) {
  return <ResultatClient />;
}
