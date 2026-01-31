import Link from "next/link";
import { FooterVilles, FooterVillesCompact } from "@/components/villes/FooterVilles";

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/30 py-8 text-sm text-muted-foreground">
      <div className="container mx-auto px-4">
        {/* Section villes populaires (maillage interne SEO) */}
        <div className="mb-8">
          <h2 className="mb-4 text-base font-semibold text-foreground">
            Villes eligibles a la loi Jeanbrun
          </h2>
          {/* Version complete sur desktop */}
          <div className="hidden md:block">
            <FooterVilles />
          </div>
          {/* Version compacte sur mobile */}
          <div className="md:hidden">
            <FooterVillesCompact />
          </div>
        </div>

        <div className="border-t pt-6">
          <div className="flex flex-col space-y-6 md:flex-row md:items-center md:justify-between md:space-y-0">
            {/* Logo et description */}
            <div className="flex flex-col space-y-2">
              <span className="font-semibold text-foreground">
                Simulateur Loi Jeanbrun
              </span>
              <p className="max-w-xs text-xs">
                Simulez vos avantages fiscaux pour l&apos;investissement immobilier
                neuf (PLF 2026)
              </p>
            </div>

            {/* Liens légaux */}
            <nav className="flex flex-wrap gap-x-6 gap-y-2" aria-label="Liens legaux">
              <Link
                href="/mentions-legales"
                className="hover:text-foreground hover:underline"
              >
                Mentions legales
              </Link>
              <Link href="/cgv" className="hover:text-foreground hover:underline">
                CGV
              </Link>
              <Link
                href="/politique-confidentialite"
                className="hover:text-foreground hover:underline"
              >
                Politique de confidentialite
              </Link>
              <Link
                href="/villes"
                className="hover:text-foreground hover:underline"
              >
                Toutes les villes
              </Link>
              <Link
                href="/barometre"
                className="hover:text-foreground hover:underline"
              >
                Barometre
              </Link>
            </nav>
          </div>

          {/* Copyright */}
          <div className="mt-6 border-t pt-6 text-center text-xs">
            <p>
              © {currentYear} Expert IA Entreprise. Tous droits reserves.
            </p>
            <p className="mt-1 text-muted-foreground/70">
              Les simulations sont fournies a titre indicatif et ne constituent
              pas un conseil fiscal.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
