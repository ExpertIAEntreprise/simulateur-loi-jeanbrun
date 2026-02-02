/**
 * Layout pour la landing page
 *
 * La landing page utilise ses propres composants LandingHeader/LandingFooter
 * au lieu du SiteHeader/SiteFooter standard. Les providers (Auth, Theme)
 * sont dans le root layout.
 *
 * Ce layout est intentionnellement vide car les composants header/footer
 * sont directement dans la page pour plus de controle.
 */
export default function LandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
