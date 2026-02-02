import Link from "next/link"
import { Calculator, Mail, Phone, MapPin } from "lucide-react"

const legalLinks = [
  { href: "/mentions-legales", label: "Mentions legales" },
  { href: "/cgu", label: "CGU" },
  { href: "/confidentialite", label: "Politique de confidentialite" },
] as const

const navigationLinks = [
  { href: "/simulateur", label: "Simulateur" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
] as const

/**
 * LandingFooter - Footer complet pour la landing page
 *
 * Features:
 * - Logo et description
 * - Liens de navigation
 * - Liens legaux
 * - Informations de contact
 * - Copyright
 * - Accessibilite: aria-label sur sections
 */
export function LandingFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link
              href="/"
              className="flex items-center gap-2 font-serif text-xl font-semibold mb-4"
            >
              <Calculator className="h-6 w-6 text-primary" aria-hidden="true" />
              <span>
                Loi <span className="text-primary">Jeanbrun</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Le simulateur de reference pour calculer votre economie d'impot
              avec la Loi Jeanbrun. Jusqu'a 50 000{"\u00A0"}\u20AC d'economie pour
              les TMI 45%.
            </p>
          </div>

          {/* Navigation */}
          <nav aria-label="Navigation footer" className="lg:col-span-1">
            <h3 className="font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              {navigationLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Legal */}
          <nav aria-label="Liens legaux" className="lg:col-span-1">
            <h3 className="font-semibold mb-4">Informations legales</h3>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div className="lg:col-span-1">
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:contact@loi-jeanbrun.fr"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  contact@loi-jeanbrun.fr
                </a>
              </li>
              <li>
                <a
                  href="tel:+33123456789"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  01 23 45 67 89
                </a>
              </li>
              <li>
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                  Paris, France
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              &copy; {currentYear} Simulateur Loi Jeanbrun. Tous droits reserves.
            </p>
            <p className="text-xs text-muted-foreground text-center md:text-right">
              Simulation a titre indicatif. Consultez un conseiller fiscal pour
              valider votre projet.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default LandingFooter
