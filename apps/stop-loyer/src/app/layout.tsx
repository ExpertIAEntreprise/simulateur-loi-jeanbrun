import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Stop Loyer - Simulateur PTZ | Devenez propriétaire dans le neuf",
  description:
    "Simulez votre éligibilité au Prêt à Taux Zéro (PTZ) et découvrez comment devenir propriétaire dans le neuf en 2026. Gratuit et sans engagement.",
  keywords: "PTZ, prêt à taux zéro, primo-accédant, immobilier neuf, simulation, propriétaire",
  openGraph: {
    title: "Stop Loyer - Simulateur PTZ",
    description: "Devenez propriétaire dans le neuf grâce au PTZ",
    locale: "fr_FR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
