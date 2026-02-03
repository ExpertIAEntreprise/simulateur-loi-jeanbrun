import { CoinsIcon, ShieldCheckIcon, PalmtreeIcon, TrendingDownIcon } from 'lucide-react'
import Features from '@/components/shadcn-studio/blocks/features-section-23/features-section-23'
import type { Process } from '@/components/shadcn-studio/blocks/features-section-23/process-flow'

const features: Process[] = [
  {
    id: '1',
    icon: <CoinsIcon />,
    title: 'Revenus 100% défiscalisés',
    description: "Seule loi permettant de percevoir des revenus fonciers entièrement défiscalisés, sans aucun prélèvement social."
  },
  {
    id: '2',
    icon: <ShieldCheckIcon />,
    title: 'Protection familiale totale',
    description: "Assurance décès-invalidité incluse : en cas de coup dur, l'appartement est payé + complément de revenu pour protéger votre conjoint et vos enfants."
  },
  {
    id: '3',
    icon: <PalmtreeIcon />,
    title: 'Retraite sereine garantie',
    description: "Préparez votre retraite avec un effort d'épargne minimal. L'effet de levier du crédit + les loyers perçus = patrimoine au meilleur coût."
  },
  {
    id: '4',
    icon: <TrendingDownIcon />,
    title: 'Réduction d\'impôts immédiate',
    description: "Et tout cela en réduisant vos impôts jusqu'à 50 000€ sur 9 ans selon votre TMI. Économie fiscale dès la première année."
  }
]

export default function WhyInvestWrapper() {
  return <Features features={features} />
}
