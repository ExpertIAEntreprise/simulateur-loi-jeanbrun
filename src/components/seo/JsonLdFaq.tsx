/**
 * JsonLdFaq.tsx
 * FAQPage Schema.org pour Google Rich Snippets
 *
 * CRITIQUE SEO: Ce composant genere le schema JSON-LD FAQPage
 * qui permet d'afficher les questions/reponses dans les resultats Google
 *
 * @see https://developers.google.com/search/docs/appearance/structured-data/faqpage
 */

interface FaqItem {
  question: string;
  answer: string;
}

interface JsonLdFaqProps {
  items: readonly FaqItem[] | FaqItem[];
  pageUrl?: string | undefined;
}

/**
 * Genere le schema JSON-LD FAQPage
 */
function generateFaqJsonLd({ items, pageUrl }: JsonLdFaqProps) {
  const baseSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  if (pageUrl) {
    return {
      ...baseSchema,
      url: pageUrl,
    };
  }

  return baseSchema;
}

/**
 * Composant JSON-LD FAQPage
 * Injecte le schema structure pour la FAQ
 *
 * @example
 * import { faqItems } from "@/components/landing/FAQAccordion"
 *
 * <JsonLdFaq items={faqItems} />
 */
export function JsonLdFaq({ items, pageUrl }: JsonLdFaqProps) {
  if (items.length === 0) {
    return null;
  }

  const jsonLdData = generateFaqJsonLd({ items, pageUrl });

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLdData),
      }}
    />
  );
}

/**
 * Version serveur du JSON-LD pour injection dans le head via metadata
 */
export function getFaqJsonLdForMetadata(props: JsonLdFaqProps) {
  return generateFaqJsonLd(props);
}

export type { JsonLdFaqProps, FaqItem };
