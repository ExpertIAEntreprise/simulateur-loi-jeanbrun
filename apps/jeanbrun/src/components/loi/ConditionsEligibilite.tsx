import { MapPin, Home, Users, Building } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const zones = [
  {
    name: 'Zone A bis',
    description: 'Paris et 76 communes d\'Ile-de-France',
    cities: 'Paris, Boulogne-Billancourt, Saint-Denis, Montreuil...',
    tension: 'Tres tendue',
    color: 'bg-red-500',
  },
  {
    name: 'Zone A',
    description: 'Grandes agglomerations francaises',
    cities: 'Lyon, Marseille, Lille, Montpellier, Nice, Toulouse...',
    tension: 'Tendue',
    color: 'bg-orange-500',
  },
  {
    name: 'Zone B1',
    description: 'Grandes agglomerations de plus de 250 000 habitants',
    cities: 'Nantes, Rennes, Bordeaux, Strasbourg, Grenoble...',
    tension: 'Moderement tendue',
    color: 'bg-yellow-500',
  },
] as const

const plafondLoyers = [
  { zone: 'A bis', plafond: '18,89' },
  { zone: 'A', plafond: '14,03' },
  { zone: 'B1', plafond: '11,31' },
] as const

const plafondRessources = [
  { composition: 'Personne seule', abis: '43 475', a: '43 475', b1: '35 435' },
  { composition: 'Couple', abis: '64 976', a: '64 976', b1: '47 321' },
  { composition: 'Couple ou personne seule + 1 enfant', abis: '85 175', a: '78 104', b1: '56 905' },
  { composition: 'Couple ou personne seule + 2 enfants', abis: '101 693', a: '93 556', b1: '68 699' },
  { composition: 'Couple ou personne seule + 3 enfants', abis: '120 995', a: '110 753', b1: '80 816' },
  { composition: 'Couple ou personne seule + 4 enfants', abis: '136 151', a: '124 630', b1: '91 078' },
  { composition: 'Majoration par personne supplementaire', abis: '+15 168', a: '+13 886', b1: '+10 161' },
] as const

const biensEligibles = [
  {
    icon: Building,
    title: 'Logement neuf',
    description: 'Acquisition d\'un logement neuf ou en l\'etat futur d\'achevement (VEFA)',
  },
  {
    icon: Home,
    title: 'Performance energetique',
    description: 'Le bien doit respecter la norme RE2020 (Reglementation Environnementale 2020)',
  },
  {
    icon: Users,
    title: 'Residence principale',
    description: 'Le logement doit etre loue nu comme residence principale du locataire',
  },
  {
    icon: MapPin,
    title: 'Localisation',
    description: 'Le bien doit etre situe dans une zone eligible (A bis, A ou B1)',
  },
] as const

export function ConditionsEligibilite() {
  return (
    <section id="conditions-eligibilite" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          {/* Section Header */}
          <div className="mb-12 text-center">
            <Badge variant="outline" className="mb-4">
              <MapPin className="mr-2 h-4 w-4" />
              Conditions d&apos;eligibilite
            </Badge>
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Qui peut beneficier de la loi Jeanbrun ?
            </h2>
            <p className="text-lg text-muted-foreground">
              Decouvrez les conditions a remplir pour profiter de cet avantage fiscal.
            </p>
          </div>

          {/* Zones fiscales */}
          <div className="mb-12">
            <h3 className="mb-6 text-2xl font-semibold">Zones fiscales eligibles</h3>
            <div className="grid gap-4 md:grid-cols-3">
              {zones.map((zone) => (
                <Card key={zone.name} className="relative overflow-hidden">
                  <div className={`absolute left-0 top-0 h-full w-1 ${zone.color}`} />
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {zone.name}
                      <Badge variant="secondary" className="text-xs">
                        {zone.tension}
                      </Badge>
                    </CardTitle>
                    <CardDescription>{zone.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      <strong>Exemples :</strong> {zone.cities}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Plafonds de loyers */}
          <div className="mb-12">
            <h3 className="mb-6 text-2xl font-semibold">Plafonds de loyers 2026</h3>
            <Card>
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Zone</TableHead>
                      <TableHead className="text-right">Plafond (par m² / mois)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {plafondLoyers.map((row) => (
                      <TableRow key={row.zone}>
                        <TableCell className="font-medium">Zone {row.zone}</TableCell>
                        <TableCell className="text-right">{row.plafond} EUR</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <p className="mt-4 text-sm text-muted-foreground">
                  Ces plafonds sont revises chaque annee. Un coefficient multiplicateur s&apos;applique
                  en fonction de la surface du logement.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Plafonds de ressources */}
          <div className="mb-12">
            <h3 className="mb-6 text-2xl font-semibold">Plafonds de ressources des locataires 2026</h3>
            <Card>
              <CardContent className="pt-6">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Composition du foyer</TableHead>
                        <TableHead className="text-right">Zone A bis</TableHead>
                        <TableHead className="text-right">Zone A</TableHead>
                        <TableHead className="text-right">Zone B1</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {plafondRessources.map((row) => (
                        <TableRow key={row.composition}>
                          <TableCell className="font-medium">{row.composition}</TableCell>
                          <TableCell className="text-right">{row.abis} EUR</TableCell>
                          <TableCell className="text-right">{row.a} EUR</TableCell>
                          <TableCell className="text-right">{row.b1} EUR</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  Revenu fiscal de reference de l&apos;annee N-2 du locataire. Pour les couples, les revenus
                  sont additionnes.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Types de biens eligibles */}
          <div>
            <h3 className="mb-6 text-2xl font-semibold">Types de biens eligibles</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {biensEligibles.map((bien) => (
                <Card key={bien.title}>
                  <CardHeader>
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <bien.icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{bien.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{bien.description}</p>
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
