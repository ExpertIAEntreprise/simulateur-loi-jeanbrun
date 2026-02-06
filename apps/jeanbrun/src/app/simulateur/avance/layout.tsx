import { SimulationProvider } from "@/contexts/SimulationContext"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Simulateur Avancé | Loi Jeanbrun",
  description:
    "Simulez votre investissement immobilier avec notre simulateur avancé en 6 étapes. Calculez vos économies fiscales sous le dispositif Loi Jeanbrun PLF 2026.",
  robots: {
    index: false, // Don't index wizard pages
    follow: true,
  },
}

interface SimulateurAvanceLayoutProps {
  children: React.ReactNode
}

export default function SimulateurAvanceLayout({
  children,
}: SimulateurAvanceLayoutProps) {
  return <SimulationProvider>{children}</SimulationProvider>
}
