import Header from "@/components/shadcn-studio/blocks/hero-section-18/header";
import FooterComponent03 from "@/components/shadcn-studio/blocks/footer-component-03/footer-component-03";
import { navigationData } from "@/config/navigation";

/**
 * Layout pour les pages de l'application
 *
 * Utilise le meme Header/Footer que la landing page pour une experience coherente.
 * Les providers (Auth, Theme) sont dans le root layout.
 */
export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header navigationData={navigationData} />
      <main id="main-content" className="pt-16">{children}</main>
      <FooterComponent03 />
    </>
  );
}
