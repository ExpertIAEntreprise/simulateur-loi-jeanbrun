import TestimonialsComponent from '@/components/shadcn-studio/blocks/testimonials-component-01/testimonials-component-01'
import type { TestimonialItem } from '@/components/shadcn-studio/blocks/testimonials-component-01/testimonials-component-01'

const testimonials: TestimonialItem[] = [
  {
    name: "Sophie Martin",
    role: "Investisseur",
    company: "Particulier",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie",
    rating: 5,
    content: "J'ai pu simuler mon investissement en moins de 2 minutes. Le calcul est précis et m'a aidé à prendre ma décision d'investir dans un T2 neuf à Lyon."
  },
  {
    name: "Marc Dubois",
    role: "Chef d'entreprise",
    company: "TMI 45%",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marc",
    rating: 5,
    content: "Le simulateur explique bien tous les avantages fiscaux. J'ai enfin compris comment fonctionne la Loi Jeanbrun et l'impact sur ma déclaration d'impôts."
  },
  {
    name: "Isabelle Leroux",
    role: "Cadre supérieur",
    company: "Préparation retraite",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Isabelle",
    rating: 5,
    content: "Jusqu'à 21 400€ de déduction par an, c'est énorme ! Le simulateur m'a montré le potentiel de ce dispositif pour préparer ma retraite sereinement."
  }
]

export default function TestimonialsWrapper() {
  return <TestimonialsComponent testimonials={testimonials} />
}
