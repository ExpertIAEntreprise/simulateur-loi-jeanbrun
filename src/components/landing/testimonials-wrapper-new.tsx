import TestimonialsGoogle from './testimonials-google'

const testimonials = [
  {
    name: 'Christophe P.',
    date: '2025-10-10',
    text: 'Monsieur Voirin nous avait déjà accompagnés lors de la mise en place d\'un investissement en loi Pinel en 2015. L\'opération s\'est parfaitement bien déroulée et une fois de plus on lui redonne notre confiance pour la mise en place de ce futur dispositif.',
    rating: 5,
    initials: 'CP',
    avatarColor: '#F5D6B3'
  },
  {
    name: 'Marc T.',
    date: '2025-10-08',
    text: 'Nous attendions impatiemment un nouveau dispositif de défiscalisation pour nous permettre de diminuer nos impôts. La simulation qui nous a été remise nous a convaincus. Je recommande.',
    rating: 5,
    initials: 'MT',
    avatarColor: '#B8E0D2'
  },
  {
    name: 'Max C.',
    date: '2025-10-03',
    text: 'Chaque année, nous avons l\'occasion de pouvoir échanger avec monsieur Voirin par rapport à notre déclaration d\'impôt. Nous ne pouvons que le recommander. Il a toujours été de très bons conseils.',
    rating: 5,
    initials: 'MC',
    avatarColor: '#A084CA'
  },
  {
    name: 'Christophe G.',
    date: '2025-09-28',
    text: 'Très bon accompagnement. Professionnel à l\'écoute, disponible, et ce même après la vente, qui est rare de nos jours.',
    rating: 5,
    initials: 'CG',
    avatarColor: '#FFB4B4'
  },
  {
    name: 'Véronique P.',
    date: '2025-09-22',
    text: 'Mon mari n\'était pas forcément convaincu qu\'un accompagnement était intéressant et important. Eh bien aujourd\'hui c\'est lui qui recommande Monsieur Voirin à ses collègues et amis.',
    rating: 5,
    initials: 'VP',
    avatarColor: '#B3D9FF'
  },
  {
    name: 'Loïc P.',
    date: '2025-09-18',
    text: 'La simulation personnalisée nous a effectivement apporté toutes les réponses. C\'est très pro ! Elle nous a permis de voir que malheureusement nous ne sommes plus finançables actuellement. Peut-être d\'ici un an.',
    rating: 5,
    initials: 'LP',
    avatarColor: '#FFE5B4'
  },
  {
    name: 'Émilie B.',
    date: '2025-09-12',
    text: 'Achat Pinel. Accompagnement d\'excellente qualité. Un grand professionnalisme.',
    rating: 5,
    initials: 'EB',
    avatarColor: '#D4A5A5'
  },
  {
    name: 'Olivier B.',
    date: '2025-09-05',
    text: 'Simulation très détaillée et réaliste. Explication claire. Sympathique. L\'accompagnement permet vraiment de pouvoir prendre de bonnes décisions et de ne pas aller dans le mur.',
    rating: 5,
    initials: 'OB',
    avatarColor: '#B8D8BA'
  },
  {
    name: 'Véronique F.',
    date: '2025-08-30',
    text: 'Achat dans le cadre d\'un investissement locatif. Parfait du début à la fin. Un interlocuteur très à l\'écoute. Pour un résultat à la hauteur de nos attentes. Merci.',
    rating: 5,
    initials: 'VF',
    avatarColor: '#FFCCE5'
  },
  {
    name: 'Clément B.',
    date: '2025-08-24',
    text: 'Très satisfait de mon investissement. Je souhaitais défiscaliser avec une société sérieuse et je suis satisfait d\'avoir été accompagné par Monsieur Voirin. Professionnel sérieux et réactif, toujours disponible pour ses clients.',
    rating: 5,
    initials: 'CB',
    avatarColor: '#E8B4C8'
  }
]

export default function TestimonialsWrapperNew() {
  return <TestimonialsGoogle testimonials={testimonials} />
}
