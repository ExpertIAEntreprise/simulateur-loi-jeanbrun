import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqItems = [
  {
    id: "eligibilite",
    question: "Suis-je eligible a la Loi Jeanbrun ?",
    answer:
      "La Loi Jeanbrun s'adresse a tous les contribuables francais souhaitant investir dans l'immobilier locatif neuf ou ancien renove. Les conditions principales sont : etre domicilie fiscalement en France, s'engager a louer le bien pendant 9 ans minimum, et respecter les plafonds de loyers et de ressources des locataires selon la zone geographique.",
  },
  {
    id: "economie",
    question: "Combien puis-je economiser exactement ?",
    answer:
      "L'economie depend de votre tranche marginale d'imposition (TMI) et du montant investi. Pour un TMI de 45% avec un investissement de 300 000\u00A0\u20AC en zone tres sociale, vous pouvez economiser jusqu'a 48 600\u00A0\u20AC d'impots sur 9 ans, soit environ 5 400\u00A0\u20AC par an. Utilisez notre simulateur pour obtenir une estimation personnalisee.",
  },
  {
    id: "pinel",
    question: "Quelle difference avec la loi Pinel ?",
    answer:
      "Contrairement au Pinel (termine fin 2024), la Loi Jeanbrun fonctionne par amortissement et non par reduction d'impot. Cela signifie qu'elle n'est pas soumise au plafond des niches fiscales de 10 750\u00A0\u20AC/an. De plus, les amortissements ne sont jamais reintegres a la revente, contrairement au LMNP.",
  },
  {
    id: "urgence-2027",
    question: "Pourquoi investir avant le 31/12/2027 ?",
    answer:
      "Jusqu'au 31 decembre 2027, le plafond de deficit foncier deductible est DOUBLE : 21 400\u00A0\u20AC/an au lieu de 10 700\u00A0\u20AC. Cela signifie que vous pouvez deduire deux fois plus de charges de vos revenus imposables chaque annee. Apres cette date, le plafond reviendra a 10 700\u00A0\u20AC. C'est le moment ideal pour investir.",
  },
  {
    id: "retraite",
    question: "Pourquoi Jeanbrun est ideal pour la retraite ?",
    answer:
      "La Loi Jeanbrun est concue pour le long terme. Apres 9 ans d'engagement, vous conservez le bien et percevez des loyers comme complement de retraite. Apres 22 ans, vous etes exonere d'impot sur la plus-value (IR 19%). Apres 30 ans, vous etes egalement exonere des prelevements sociaux (17,2%). C'est un outil patrimonial complet.",
  },
  {
    id: "22-ans",
    question: "Que se passe-t-il apres 22 ans de detention ?",
    answer:
      "Apres 22 ans de detention, vous beneficiez d'une exoneration totale de l'impot sur le revenu (19%) sur la plus-value immobiliere en cas de revente. Apres 30 ans, vous etes egalement exonere des prelevements sociaux (17,2%). Ces abattements sont automatiques et progressifs.",
  },
  {
    id: "reintegration",
    question: "Les amortissements sont-ils reintegres a la revente ?",
    answer:
      "Non, c'est l'un des avantages majeurs de la Loi Jeanbrun par rapport au LMNP. Les amortissements deduits pendant la periode de location ne sont jamais reintegres dans le calcul de la plus-value lors de la revente. Vous conservez l'avantage fiscal acquis.",
  },
  {
    id: "gratuit",
    question: "La simulation est-elle vraiment gratuite ?",
    answer:
      "Oui, notre simulateur est 100% gratuit et sans engagement. Vous obtenez instantanement une estimation de votre economie d'impot. Si vous souhaitez aller plus loin, vous pouvez demander a etre recontacte par un conseiller pour affiner votre projet.",
  },
] as const

/**
 * Export FAQ items for JSON-LD schema
 */
export { faqItems }

/**
 * FAQAccordion - Section FAQ avec 8 questions
 *
 * Features:
 * - Utilise shadcn/ui Accordion (Radix)
 * - Accessibilite: aria-label, navigation clavier complete
 * - Questions sur la Loi Jeanbrun avec reponses detaillees
 * - Question urgence 2027 mise en avant
 */
export function FAQAccordion() {
  return (
    <section
      aria-labelledby="faq-section-title"
      className="py-16 md:py-24 bg-muted/30"
    >
      <div className="container mx-auto px-4">
        <h2
          id="faq-section-title"
          className="text-2xl md:text-3xl font-serif text-center mb-4"
        >
          Questions <span className="text-primary">frequentes</span>
        </h2>
        <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
          Tout ce que vous devez savoir sur la Loi Jeanbrun
        </p>

        <div className="max-w-3xl mx-auto">
          <Accordion
            type="single"
            collapsible
            className="w-full"
            aria-label="Questions frequentes sur la Loi Jeanbrun"
          >
            {faqItems.map((item) => (
              <AccordionItem
                key={item.id}
                value={item.id}
                className="border-border"
              >
                <AccordionTrigger className="text-left hover:no-underline hover:text-primary">
                  <span className="pr-4">{item.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}

export default FAQAccordion
