import { UserIcon, BriefcaseIcon, BuildingIcon, UsersIcon } from 'lucide-react'

import Features from '@/components/shadcn-studio/blocks/features-section-09/features-section-09'

const tabsData = [
  {
    name: 'Primo-accédant',
    icon: UserIcon,
    value: 'primo-accedant',
    content: {
      buttonIcon: UserIcon,
      title: 'Studio T1 neuf à Lyon - TMI 30%',
      description:
        'Investissement : 150 000 € | Studio 35 m² en zone A\n\n' +
        '• Amortissement annuel : 4 200 €\n' +
        '• Loyer perçu : 9 000 €/an\n' +
        '• Charges + intérêts : 4 300 €/an\n' +
        '• Économie d\'impôt : 1 260 €/an\n\n' +
        'Économie totale sur 9 ans : 11 340 €',
      image: '/loi-jeanbrun-dispositif-fiscal-salon.webp',
      documentationLink: '/simulateur'
    }
  },
  {
    name: 'Cadre supérieur',
    icon: BriefcaseIcon,
    value: 'cadre-superieur',
    content: {
      buttonIcon: BriefcaseIcon,
      title: 'T2 neuf à Bordeaux - TMI 41%',
      description:
        'Investissement : 250 000 € | T2 de 45 m² en zone B1\n\n' +
        '• Amortissement annuel : 8 000 € (plafonné)\n' +
        '• Loyer perçu : 11 000 €/an\n' +
        '• Déficit foncier créé : 4 700 €/an\n' +
        '• Économie d\'impôt : 5 207 €/an\n\n' +
        'Économie totale sur 9 ans : 46 863 €',
      image: '/loi-jeanbrun-fonctionnement-investissement.webp',
      documentationLink: '/simulateur'
    }
  },
  {
    name: 'Patrimoine établi',
    icon: BuildingIcon,
    value: 'patrimoine-etabli',
    content: {
      buttonIcon: BuildingIcon,
      title: 'T3 ancien rénové à Toulouse - TMI 45%',
      description:
        'Investissement : 260 000 € (180k + 80k travaux) | T3 de 65 m²\n\n' +
        '• Amortissement annuel : 8 320 €\n' +
        '• Loyer perçu : 10 500 €/an\n' +
        '• Déficit foncier créé : 7 320 €/an\n' +
        '• Économie d\'impôt : 7 038 €/an\n\n' +
        'Économie totale sur 9 ans : 63 342 €',
      image: '/loi-jeanbrun-conditions-location.webp',
      documentationLink: '/simulateur'
    }
  },
  {
    name: 'Couple avec enfants',
    icon: UsersIcon,
    value: 'couple-enfants',
    content: {
      buttonIcon: UsersIcon,
      title: 'T2 neuf à Villeurbanne - Cas réel',
      description:
        'Couple, 2 enfants, revenus 6 500 €/mois net\n' +
        'Investissement : 195 000 € | T2 de 42 m²\n\n' +
        '• Mensualité crédit : 1 095 €/mois\n' +
        '• Loyer perçu : 750 €/mois\n' +
        '• Réduction fiscale Jeanbrun : 397 €/mois\n' +
        '• Effort réel mensuel : 33 €\n\n' +
        'Économie totale sur 9 ans : 39 000 €',
      image: '/loi-jeanbrun-dispositif-fiscal-salon.webp',
      documentationLink: '/simulateur'
    }
  }
]

const PersonasSection = () => {
  return <Features tabs={tabsData} />
}

export default PersonasSection
