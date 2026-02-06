/**
 * FaqVille.tsx
 * Accordeon FAQ avec JSON-LD FAQPage pour Google Rich Snippets
 *
 * CRITIQUE SEO: Ce composant genere le schema JSON-LD FAQPage
 * qui permet d'afficher les FAQ directement dans les resultats Google
 */

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqVilleProps {
  faqItems: FaqItem[];
  villeNom: string;
}

/**
 * Escape JSON string for safe injection in script tags (XSS protection)
 * Replaces < and > with Unicode escapes to prevent script injection
 */
function safeJsonLd(data: object): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e');
}

/**
 * Genere le schema JSON-LD FAQPage pour Google Rich Snippets
 * @see https://developers.google.com/search/docs/appearance/structured-data/faqpage
 */
function generateFaqJsonLd(faqItems: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

/**
 * Composant FAQ avec accordeon et JSON-LD structure
 * Affiche les questions/reponses dans un accordeon accessible
 * Injecte automatiquement le schema FAQPage pour le SEO
 */
export function FaqVille({ faqItems, villeNom }: FaqVilleProps) {
  if (faqItems.length === 0) {
    return null;
  }

  const jsonLdData = generateFaqJsonLd(faqItems);

  return (
    <section aria-labelledby="faq-heading">
      {/* JSON-LD FAQPage pour Google Rich Snippets (XSS protected) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLd(jsonLdData),
        }}
      />

      <h2 id="faq-heading" className="mb-6 text-2xl font-bold">
        Questions frequentes sur l&apos;investissement a {villeNom}
      </h2>

      <Accordion
        type="single"
        collapsible
        className="w-full"
        aria-label={`FAQ sur l'investissement immobilier a ${villeNom}`}
      >
        {faqItems.map((item, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left font-medium">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}

/**
 * Version serveur du JSON-LD pour injection dans le head via metadata
 * Utiliser cette fonction dans generateMetadata() de la page
 *
 * @example
 * // Dans app/villes/[slug]/page.tsx
 * export async function generateMetadata({ params }) {
 *   const ville = await getVille(params.slug);
 *   const faqItems = getVilleFaq(ville);
 *   return {
 *     other: {
 *       'script:ld+json': JSON.stringify(getFaqJsonLdForMetadata(faqItems)),
 *     },
 *   };
 * }
 */
export function getFaqJsonLdForMetadata(faqItems: FaqItem[]) {
  return generateFaqJsonLd(faqItems);
}
