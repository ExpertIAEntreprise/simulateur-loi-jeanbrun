'use client'

import { BadgePercentIcon, TrendingUpIcon, CrownIcon } from 'lucide-react'
import Features from '@/components/shadcn-studio/blocks/features-section-27/features-section-27'

const featuresData = [
  {
    name: 'Dispositif',
    value: 'dispositif',
    image: '/loi-jeanbrun-dispositif-fiscal-salon.webp',
    icon: <BadgePercentIcon />,
    title: 'Disponible pendant les 3 prochaines années',
    description:
      'Le dispositif fiscal Relance logement, aussi appelé Jeanbrun, est ouvert à tous les particuliers souhaitant investir dans un logement locatif.\n\nLe dispositif concerne les logements situés dans des immeubles collectifs partout en France.\n\nIl est applicable :\n• aux logements neufs ;\n• aux logements anciens, à condition de réaliser des travaux représentant au moins 30 % de la valeur du bien.',
    link: '#',
    testimonials: [
      {
        id: '1',
        review: "Un dispositif fiscal avantageux pour préparer sa retraite tout en réduisant ses impôts."
      },
      { id: '2', review: "Jusqu'à 63 000€ d'économie d'impôt sur 9 ans." },
      {
        id: '3',
        review: "Applicable dans toute la France, en zone tendue comme en zone détendue."
      }
    ]
  },
  {
    name: 'Fonctionnement',
    value: 'fonctionnement',
    image: '/loi-jeanbrun-fonctionnement-investissement.webp',
    icon: <TrendingUpIcon />,
    title: 'Comment fonctionne-t-il ?',
    description:
      'Lorsqu\'un ménage achètera un appartement pour le mettre en location, il pourra déduire de ses revenus locatifs (c\'est-à-dire des loyers) :\n\n• une partie du prix d\'achat du bien ;\n• l\'intégralité des charges liées à la location : travaux, intérêts d\'emprunt, taxe foncière.\n\nLe dispositif permet :\n• jusqu\'à 12 000 euros d\'amortissement par an ;\n• jusqu\'à 21 400 euros de déduction des autres revenus (salaire, pension de retraite...).',
    link: '#',
    testimonials: [
      { id: '1', review: "Déduisez jusqu'à 100% de vos charges locatives." },
      {
        id: '2',
        review: "Amortissez une partie du prix d'achat de votre bien."
      },
      {
        id: '3',
        review: "Optimisez votre fiscalité sur les revenus locatifs."
      }
    ]
  },
  {
    name: 'Conditions',
    value: 'conditions',
    image: '/loi-jeanbrun-conditions-location.webp',
    icon: <CrownIcon />,
    title: 'Quelles sont les conditions à respecter ?',
    description:
      'Pour bénéficier du dispositif, plusieurs conditions doivent être respectées :\n\n• le logement doit être situé dans un immeuble collectif ;\n• le bien doit être loué en tant que résidence principale pendant une durée de 9 ans (sur le modèle des dispositifs antérieurs) ;\n• en cas de location, un plafond de loyers (intermédiaire, social, très social) doit être respecté ;\n• pour prévenir les fraudes, les locations dans le cercle familial proche sont interdites.',
    link: '#',
    testimonials: [
      {
        id: '1',
        review: "Location en résidence principale obligatoire pendant 9 ans."
      },
      {
        id: '2',
        review: "Plafonds de loyers à respecter selon la zone."
      },
      {
        id: '3',
        review: "Un investissement sécurisé et encadré par la loi."
      }
    ]
  }
]

export default function FeaturesWrapper() {
  return <Features tabs={featuresData} />
}
