"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Redirect page for /simulateur/resultat
 *
 * Generates a UUID and redirects to /simulateur/resultat/[id]
 * The actual data is stored in localStorage and loaded by the target page
 */
export default function ResultatRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Generate a simple UUID
    const uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });

    // Redirect to the dynamic route
    router.replace(`/simulateur/resultat/${uuid}`);
  }, [router]);

  // Show loading state while redirecting
  return (
    <div className="container max-w-5xl mx-auto px-4 py-8 flex items-center justify-center min-h-[50vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground">Calcul de vos resultats en cours...</p>
      </div>
    </div>
  );
}
