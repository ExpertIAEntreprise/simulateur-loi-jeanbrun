import { Heart, Target, Shield, Lightbulb } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const values = [
  {
    icon: Heart,
    title: "Passion",
    description: "L'immobilier est ma passion depuis plus de 15 ans. J'accompagne mes clients avec enthousiasme.",
  },
  {
    icon: Target,
    title: "Precision",
    description: "Chaque simulation est realisee avec rigueur pour vous offrir des resultats fiables.",
  },
  {
    icon: Shield,
    title: "Transparence",
    description: "Pas de frais caches, pas de mauvaises surprises. Je vous explique tout en detail.",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "J'utilise les derniers outils technologiques pour optimiser votre investissement.",
  },
] as const

interface BiographieProps {
  bio?: string
  missionStatement?: string
}

export function Biographie({
  bio = "Apres plus de 15 ans d'experience dans le conseil en gestion de patrimoine et l'investissement immobilier, j'ai decide de creer ce simulateur pour democratiser l'acces a la defiscalisation immobiliere. Mon objectif : rendre la loi Jeanbrun accessible a tous les investisseurs, qu'ils soient debutants ou experimentes.\n\nJ'ai accompagne plus de 500 clients dans leurs projets d'investissement locatif, les aidant a reduire leurs impots tout en se constituant un patrimoine solide. Ma methode repose sur une approche personnalisee, ou chaque projet est analyse en fonction de la situation fiscale et des objectifs de l'investisseur.\n\nAvec l'arrivee de la loi Jeanbrun en 2026, j'ai vu une opportunite unique de simplifier l'acces a ce nouveau dispositif grace a un outil de simulation gratuit et intuitif.",
  missionStatement = "Ma mission : vous aider a prendre les bonnes decisions d'investissement immobilier en vous fournissant des simulations precises et des conseils personnalises.",
}: BiographieProps) {
  return (
    <section id="biographie" className="bg-muted/30 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          {/* Section Header */}
          <div className="mb-12 text-center">
            <Badge variant="outline" className="mb-4">
              <Heart className="mr-2 h-4 w-4" />
              Qui suis-je
            </Badge>
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Mon histoire
            </h2>
            <p className="text-lg text-muted-foreground">
              {missionStatement}
            </p>
          </div>

          {/* Biography Text */}
          <Card className="mb-12">
            <CardContent className="p-6 md:p-8">
              <div className="space-y-4">
                {bio.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="leading-relaxed text-muted-foreground">
                    {paragraph}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Values Grid */}
          <div className="mb-12">
            <h3 className="mb-6 text-center text-2xl font-semibold">
              Mes valeurs
            </h3>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {values.map((value) => (
                <Card key={value.title} className="text-center">
                  <CardHeader className="pb-2">
                    <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <value.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
