import { Geist, Geist_Mono, DM_Serif_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth/auth-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
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

export const metadata: Metadata = {
  title: {
    default: "Simulateur Loi Jeanbrun - Calcul Avantages Fiscaux Immobilier",
    template: "%s | Simulateur Loi Jeanbrun",
  },
  description:
    "Simulez gratuitement vos avantages fiscaux avec la Loi Jeanbrun (PLF 2026). Calculez la réduction d'impôt sur votre investissement immobilier neuf en France.",
  keywords: [
    "loi jeanbrun",
    "simulation fiscale",
    "réduction impôt",
    "investissement immobilier",
    "défiscalisation",
    "PLF 2026",
    "immobilier neuf",
    "avantage fiscal",
    "calculateur impôt",
    "loi pinel",
  ],
  authors: [{ name: "Expert IA Entreprise" }],
  creator: "Expert IA Entreprise",
  publisher: "Expert IA Entreprise",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Simulateur Loi Jeanbrun",
    title: "Simulateur Loi Jeanbrun - Calcul Avantages Fiscaux",
    description:
      "Simulez gratuitement vos avantages fiscaux avec la Loi Jeanbrun. Jusqu'à 14% de réduction d'impôt sur 12 ans.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Simulateur Loi Jeanbrun",
    description:
      "Simulez gratuitement vos avantages fiscaux avec la Loi Jeanbrun (PLF 2026).",
  },
  robots: {
    index: true,
    follow: true,
  },
};

// URL de l'application (utilise variable d'environnement ou fallback)
const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://simulateur-loi-jeanbrun.vercel.app";

// JSON-LD structured data for SEO
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Simulateur Loi Jeanbrun",
  description:
    "Simulez gratuitement vos avantages fiscaux avec la Loi Jeanbrun (PLF 2026). Calculez la réduction d'impôt sur votre investissement immobilier neuf.",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Any",
  inLanguage: "fr-FR",
  url: appUrl,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "EUR",
    description: "Simulation gratuite",
  },
  author: {
    "@type": "Organization",
    name: "Expert IA Entreprise",
    url: "https://expert-ia-entreprise.fr",
  },
  potentialAction: {
    "@type": "UseAction",
    target: appUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${dmSerifDisplay.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <SiteHeader />
            <main id="main-content">{children}</main>
            <SiteFooter />
            <Toaster richColors position="top-right" />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

