import PricingComponent14 from "@/components/shadcn-studio/blocks/pricing-component-14/pricing-component-14";

type Plan = {
  name: string;
  price: number;
  suffix: string;
  description: string;
  features: string[];
  buttonText: string;
  isPro?: boolean;
  badge?: string;
}[];

const pricingPlans: Plan = [
  {
    name: "Gratuit",
    price: 0,
    suffix: "",
    description: "Découvrez votre potentiel d'économie fiscale",
    features: [
      "Simulation fiscale de base",
      "Calcul de la réduction d'impôt",
      "Estimation des mensualités",
      "Guide Loi Jeanbrun",
      "Support par email"
    ],
    buttonText: "Commencer gratuitement"
  },
  {
    name: "Premium",
    price: 99,
    suffix: "€ TTC",
    description: "Remboursé si accompagnement projet immobilier",
    badge: "Intégralement remboursé",
    features: [
      "Tout du plan Gratuit",
      "Simulation détaillée personnalisée",
      "Comparaison avec LMNP et Pinel",
      "Export PDF professionnel",
      "Accompagnement téléphonique",
      "Mise en relation avec des experts",
      "Accès à plus de 6000 programmes Locaux et Nationaux"
    ],
    buttonText: "Démarrer maintenant",
    isPro: true
  }
];

export default function PricingWrapper() {
  return <PricingComponent14 plans={pricingPlans} />;
}
