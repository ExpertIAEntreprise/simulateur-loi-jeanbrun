import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

/**
 * Layout pour les pages de l'application
 *
 * Inclut SiteHeader et SiteFooter pour les pages standard.
 * Les providers (Auth, Theme) sont dans le root layout.
 */
export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SiteHeader />
      <main id="main-content">{children}</main>
      <SiteFooter />
    </>
  );
}
