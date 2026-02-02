import { Geist, Geist_Mono, DM_Serif_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth/auth-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Landing page typography - distinctive serif for headings
const dmSerifDisplay = DM_Serif_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

// Landing page typography - monospace for financial figures
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

/**
 * Metadata par defaut - sera override par les pages individuelles
 */
export const metadata: Metadata = {
  title: {
    default: "Simulateur Loi Jeanbrun - Calcul Avantages Fiscaux Immobilier",
    template: "%s | Simulateur Loi Jeanbrun",
  },
  description:
    "Simulez gratuitement vos avantages fiscaux avec la Loi Jeanbrun (PLF 2026). Calculez la reduction d'impot sur votre investissement immobilier neuf en France.",
  keywords: [
    "loi jeanbrun",
    "simulation fiscale",
    "reduction impot",
    "investissement immobilier",
    "defiscalisation",
    "PLF 2026",
    "immobilier neuf",
    "avantage fiscal",
    "calculateur impot",
  ],
  authors: [{ name: "Expert IA Entreprise" }],
  creator: "Expert IA Entreprise",
  publisher: "Expert IA Entreprise",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Simulateur Loi Jeanbrun",
  },
  robots: {
    index: true,
    follow: true,
  },
};

/**
 * Root Layout - Providers wrapper
 *
 * Ce layout racine contient les elements HTML de base, les polices,
 * et les providers globaux (Auth, Theme, Toaster).
 *
 * Les headers/footers sont geres par:
 * - (landing)/layout.tsx - Landing page avec LandingHeader/LandingFooter
 * - Routes standards - Utilisent le wrapper dans chaque page ou (app) layout
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head />
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${dmSerifDisplay.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster richColors position="top-right" />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
