import { Star, Quote } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter } from '@/components/ui/card'

interface Testimonial {
  name: string
  role: string
  content: string
  rating: number
  avatar?: string
}

const defaultTestimonials: Testimonial[] = [
  {
    name: "Marie D.",
    role: "Premiere investisseuse",
    content: "Grace au simulateur et aux conseils personnalises, j'ai pu realiser mon premier investissement en loi Jeanbrun. La reduction d'impot a ete exactement celle annoncee !",
    rating: 5,
  },
  {
    name: "Pierre M.",
    role: "Investisseur experimente",
    content: "Apres 3 investissements Pinel, je cherchais une alternative. Le simulateur m'a permis de comparer et de choisir Jeanbrun en toute confiance.",
    rating: 5,
  },
  {
    name: "Sophie L.",
    role: "Chef d'entreprise",
    content: "Un accompagnement professionnel et humain. Les explications sont claires et le simulateur est tres intuitif. Je recommande vivement !",
    rating: 5,
  },
  {
    name: "Jean-Marc R.",
    role: "Cadre superieur",
    content: "Excellente experience ! L'accompagnement personnalise m'a permis d'avoir des reponses precises a toutes mes questions. Tres professionnel.",
    rating: 5,
  },
]

interface TemoignagesProps {
  testimonials?: Testimonial[]
}

export function Temoignages({ testimonials = defaultTestimonials }: TemoignagesProps) {
  return (
    <section id="temoignages" className="bg-muted/30 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-5xl">
          {/* Section Header */}
          <div className="mb-12 text-center">
            <Badge variant="outline" className="mb-4">
              <Star className="mr-2 h-4 w-4" />
              Temoignages
            </Badge>
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Ce qu&apos;ils disent de moi
            </h2>
            <p className="text-lg text-muted-foreground">
              Decouvrez les retours de clients qui m&apos;ont fait confiance
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="relative overflow-hidden">
                {/* Quote decoration */}
                <div className="absolute right-4 top-4 text-primary/10">
                  <Quote className="h-12 w-12" />
                </div>

                <CardContent className="pt-6">
                  {/* Rating */}
                  <div className="mb-4 flex gap-1">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>

                  {/* Content */}
                  <p className="text-muted-foreground">
                    &ldquo;{testimonial.content}&rdquo;
                  </p>
                </CardContent>

                <CardFooter className="flex items-center gap-4 border-t pt-4">
                  <Avatar>
                    {testimonial.avatar ? (
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    ) : null}
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
