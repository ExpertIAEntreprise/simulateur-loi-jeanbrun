import FAQ from '@/components/shadcn-studio/blocks/faq-component-19/faq-component-19'

const faqItems = [
  {
    question: "Comment fonctionne le simulateur ?",
    answer: "Notre simulateur gratuit analyse votre situation fiscale en quelques clics : revenus, TMI, montant d'investissement et durée d'engagement. Il calcule instantanément votre réduction d'impôt, vos économies sur 9 ans et compare avec d'autres dispositifs comme le LMNP. Vous recevez un rapport détaillé par email."
  },
  {
    question: "La simulation est-elle vraiment gratuite ?",
    answer: "Oui ! La simulation est 100% gratuite et sans engagement. Vous obtenez votre estimation fiscale complete, le tableau d'amortissement, le comparatif Jeanbrun vs LMNP et le graphique d'evolution du patrimoine. Aucune carte bancaire requise."
  },
  {
    question: "Puis-je être accompagné dans mon projet ?",
    answer: "Absolument ! Avec plus de 20 ans d'expérience et un Master en Gestion de Patrimoine, je vous accompagne de A à Z : analyse de votre situation, sélection du bien optimal, montage du dossier et suivi sur 9 ans. Réponse sous 24h et premier rendez-vous gratuit."
  },
  {
    question: "Comment êtes-vous rémunéré ?",
    answer: "Notre modele de remuneration est totalement transparent : je suis remunere directement par les promoteurs immobiliers partenaires. Le simulateur et l'accompagnement sont donc entierement gratuits pour vous. Vous beneficiez d'un conseil expert personnalise sans aucun frais."
  },
  {
    question: "Vais-je bénéficier des mêmes avantages commerciaux que si je passais directement par le promoteur ?",
    answer: "Oui, absolument ! Vous bénéficiez exactement des mêmes conditions commerciales, prix et avantages que si vous contactiez directement le promoteur. En passant par mon accompagnement, vous ajoutez simplement une expertise indépendante et un conseil personnalisé, sans aucun surcoût. C'est une garantie de transparence totale."
  }
]

export default function FAQWrapper() {
  return <FAQ faqItems={faqItems} />
}
