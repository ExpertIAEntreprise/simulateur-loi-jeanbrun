'use client'

import { HelpCircle } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { faqItems } from './data/faq-data'

export function FaqLoi() {
  return (
    <section id="faq" className="bg-muted/30 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl">
          {/* Section Header */}
          <div className="mb-12 text-center">
            <Badge variant="outline" className="mb-4">
              <HelpCircle className="mr-2 h-4 w-4" />
              Questions frequentes
            </Badge>
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Tout savoir sur la loi Jeanbrun
            </h2>
            <p className="text-lg text-muted-foreground">
              Retrouvez les reponses aux questions les plus frequentes sur ce nouveau
              dispositif de defiscalisation.
            </p>
          </div>

          {/* FAQ Accordion */}
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
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
