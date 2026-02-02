"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Calculator } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navigationLinks = [
  { href: "#simulateur", label: "Simulateur" },
  { href: "#avantages", label: "Avantages" },
  { href: "#comparatif", label: "Comparatif" },
  { href: "#faq", label: "FAQ" },
] as const

/**
 * LandingHeader - Header simplifie pour la landing page
 *
 * Features:
 * - Logo avec lien vers accueil
 * - Navigation simplifiee (ancres)
 * - Bouton connexion
 * - Menu hamburger responsive mobile
 * - Accessibilite: aria-expanded, aria-controls
 */
export function LandingHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-serif text-xl font-semibold"
            onClick={closeMobileMenu}
          >
            <Calculator className="h-6 w-6 text-primary" aria-hidden="true" />
            <span>
              Loi <span className="text-primary">Jeanbrun</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav
            className="hidden md:flex items-center gap-6"
            aria-label="Navigation principale"
          >
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Connexion</Link>
            </Button>
            <Button asChild>
              <Link href="/simulateur">Simuler</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            onClick={toggleMobileMenu}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <nav
          id="mobile-menu"
          className={cn(
            "md:hidden overflow-hidden transition-all duration-300",
            isMobileMenuOpen ? "max-h-96 pb-4" : "max-h-0"
          )}
          aria-label="Navigation mobile"
        >
          <div className="flex flex-col gap-2 pt-2">
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-muted-foreground rounded-md hover:text-foreground hover:bg-muted transition-colors"
                onClick={closeMobileMenu}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-border">
              <Button variant="ghost" asChild className="justify-start">
                <Link href="/login" onClick={closeMobileMenu}>
                  Connexion
                </Link>
              </Button>
              <Button asChild>
                <Link href="/simulateur" onClick={closeMobileMenu}>
                  Simuler maintenant
                </Link>
              </Button>
            </div>
          </div>
        </nav>
      </div>
    </header>
  )
}

export default LandingHeader
