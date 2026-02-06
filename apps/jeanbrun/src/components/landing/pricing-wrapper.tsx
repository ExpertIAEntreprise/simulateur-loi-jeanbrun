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
    description: "Simulez votre investissement Loi Jeanbrun sans engagement",
    badge: "100% gratuit",
    features: [
      "Simulation fiscale complete",
      "Calcul de la reduction d'impot",
      "Estimation des mensualites",
      "Tableau d'amortissement annuel",
      "Comparatif Jeanbrun vs LMNP",
      "Graphique evolution patrimoine",
      "Guide Loi Jeanbrun",
      "Support par email"
    ],
    buttonText: "Commencer gratuitement"
  },
];

export default function PricingWrapper() {
  return <PricingComponent14 plans={pricingPlans} />;
}
