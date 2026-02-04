/**
 * Layout pour la landing page
 *
 * La landing page utilise ses propres composants Header/Footer
 * directement dans la page pour plus de controle sur le rendu hero.
 * Les providers (Auth, Theme) sont dans le root layout.
 */
export default function LandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
