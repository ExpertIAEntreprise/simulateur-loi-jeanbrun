import Link from "next/link";

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/30 py-8 text-sm text-muted-foreground">
      <div className="container mx-auto px-4">
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
          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            <Link
              href="/mentions-legales"
              className="hover:text-foreground hover:underline"
            >
              Mentions légales
            </Link>
            <Link href="/cgv" className="hover:text-foreground hover:underline">
              CGV
            </Link>
            <Link
              href="/politique-confidentialite"
              className="hover:text-foreground hover:underline"
            >
              Politique de confidentialité
            </Link>
          </nav>
        </div>

        {/* Copyright */}
        <div className="mt-6 border-t pt-6 text-center text-xs">
          <p>
            © {currentYear} Expert IA Entreprise. Tous droits réservés.
          </p>
          <p className="mt-1 text-muted-foreground/70">
            Les simulations sont fournies à titre indicatif et ne constituent
            pas un conseil fiscal.
          </p>
        </div>
      </div>
    </footer>
  );
}
