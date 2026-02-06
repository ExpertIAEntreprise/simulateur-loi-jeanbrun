import Blog from '@/components/shadcn-studio/blocks/blog-component-06/blog-component-06'

const blogCards = [
  {
    image: '/images/blog/loi-jeanbrun-2026.webp',
    alt: 'Illustration de la loi Jeanbrun 2026 pour l\'investissement immobilier',
    tags: ['Loi Jeanbrun', 'PLF 2026', 'Défiscalisation'],
    title: 'Loi Jeanbrun 2026 : Guide Complet pour Investir dans l\'Immobilier',
    date: '15 janvier 2026',
    blogLink: '/blog/loi-jeanbrun-2026-guide-complet'
  },
  {
    image: '/images/blog/top-10-villes-investir-jeanbrun.webp',
    alt: 'Carte de France avec les meilleures villes pour investir en loi Jeanbrun',
    tags: ['Investissement', 'Villes', 'Rendement'],
    title: 'Top 10 des Villes où Investir avec la Loi Jeanbrun en 2026',
    date: '31 janvier 2026',
    blogLink: '/blog/top-10-villes-investir-jeanbrun'
  },
  {
    image: '/images/blog/calculer-reduction-impot-jeanbrun.webp',
    alt: 'Calculatrice et documents pour simuler la réduction d\'impôt Jeanbrun',
    tags: ['Calcul', 'Simulation', 'RE2020'],
    title: 'Comment Calculer sa Réduction d\'Impôt avec la Loi Jeanbrun',
    date: '31 janvier 2026',
    blogLink: '/blog/calculer-reduction-impot-jeanbrun'
  }
]

export default function BlogWrapper() {
  return <Blog blogCards={blogCards} />
}
