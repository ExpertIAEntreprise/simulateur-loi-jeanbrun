import { Scale, CheckCircle2, XCircle, AlertCircle } from 'lucide-react'
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

type FeatureStatus = 'yes' | 'no' | 'partial'

interface ComparaisonRow {
  critere: string
  jeanbrun: string
  pinel: string
  lmnp: string
  jeanbrunStatus?: FeatureStatus
  pinelStatus?: FeatureStatus
  lmnpStatus?: FeatureStatus
}

const comparaison: ComparaisonRow[] = [
  {
    critere: 'Type de reduction',
    jeanbrun: 'Reduction d\'impot',
    pinel: 'Reduction d\'impot',
    lmnp: 'Amortissement',
  },
  {
    critere: 'Taux maximum',
    jeanbrun: '12% sur 12 ans',
    pinel: '14% sur 12 ans (2024)',
    lmnp: 'Variable selon charges',
  },
  {
    critere: 'Plafond d\'investissement',
    jeanbrun: '300 000 EUR/an',
    pinel: '300 000 EUR/an',
    lmnp: 'Pas de plafond',
  },
  {
    critere: 'Duree d\'engagement',
    jeanbrun: '6, 9 ou 12 ans',
    pinel: '6, 9 ou 12 ans',
    lmnp: 'Pas de duree minimum',
  },
  {
    critere: 'Zones eligibles',
    jeanbrun: 'A bis, A, B1',
    pinel: 'A bis, A, B1',
    lmnp: 'Toutes zones',
  },
  {
    critere: 'Type de bien',
    jeanbrun: 'Neuf (RE2020)',
    pinel: 'Neuf ou assimile',
    lmnp: 'Neuf ou ancien',
  },
  {
    critere: 'Plafond de loyer',
    jeanbrun: 'Oui (par zone)',
    pinel: 'Oui (par zone)',
    lmnp: 'Non',
    jeanbrunStatus: 'partial',
    pinelStatus: 'partial',
    lmnpStatus: 'yes',
  },
  {
    critere: 'Plafond ressources locataire',
    jeanbrun: 'Oui',
    pinel: 'Oui',
    lmnp: 'Non',
    jeanbrunStatus: 'partial',
    pinelStatus: 'partial',
    lmnpStatus: 'yes',
  },
  {
    critere: 'Cumul avec deficit foncier',
    jeanbrun: 'Non',
    pinel: 'Non',
    lmnp: 'Oui (amortissement)',
    jeanbrunStatus: 'no',
    pinelStatus: 'no',
    lmnpStatus: 'yes',
  },
  {
    critere: 'Report des avantages',
    jeanbrun: 'Non',
    pinel: 'Non',
    lmnp: 'Oui (deficits)',
    jeanbrunStatus: 'no',
    pinelStatus: 'no',
    lmnpStatus: 'yes',
  },
  {
    critere: 'Disponible en 2026',
    jeanbrun: 'Oui',
    pinel: 'Non (arret fin 2024)',
    lmnp: 'Oui',
    jeanbrunStatus: 'yes',
    pinelStatus: 'no',
    lmnpStatus: 'yes',
  },
] as const

const quandChoisir = [
  {
    dispositif: 'Loi Jeanbrun',
    icon: '🏠',
    ideal: 'Vous souhaitez investir dans le neuf en zone tendue',
    avantages: [
      'Reduction d\'impot immediate',
      'Fiscalite claire et previsible',
      'Investissement dans un bien neuf aux normes RE2020',
    ],
    inconvenients: [
      'Engagement locatif sur 6 a 12 ans',
      'Plafonds de loyers contraignants',
      'Zones geographiques limitees',
    ],
  },
  {
    dispositif: 'LMNP (ancien)',
    icon: '🏢',
    ideal: 'Vous recherchez plus de flexibilite et un meilleur rendement',
    avantages: [
      'Pas de plafond de loyer',
      'Pas de duree minimum d\'engagement',
      'Possibilite d\'investir dans l\'ancien',
      'Amortissement du bien et des meubles',
    ],
    inconvenients: [
      'Pas de reduction d\'impot directe',
      'Gestion plus complexe',
      'Necessite de meubler le logement',
    ],
  },
  {
    dispositif: 'Deficit foncier',
    icon: '🔧',
    ideal: 'Vous avez des revenus fonciers existants et souhaitez renover',
    avantages: [
      'Deduction des travaux de vos revenus fonciers',
      'Investissement dans l\'ancien a renover',
      'Possibilite de defiscaliser jusqu\'a 10 700 EUR/an',
    ],
    inconvenients: [
      'Necessite des revenus fonciers existants',
      'Engagement de location sur 3 ans apres les travaux',
      'Gestion des travaux',
    ],
  },
] as const

function StatusIcon({ status }: { status: FeatureStatus | undefined }) {
  if (status === undefined) return null
  switch (status) {
    case 'yes':
      return <CheckCircle2 className="inline h-4 w-4 text-green-600" />
    case 'no':
      return <XCircle className="inline h-4 w-4 text-red-600" />
    case 'partial':
      return <AlertCircle className="inline h-4 w-4 text-yellow-600" />
  }
}

export function ComparaisonDispositifs() {
  return (
    <section id="comparaison" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-5xl">
          {/* Section Header */}
          <div className="mb-12 text-center">
            <Badge variant="outline" className="mb-4">
              <Scale className="mr-2 h-4 w-4" />
              Comparatif
            </Badge>
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Jeanbrun vs Pinel vs LMNP
            </h2>
            <p className="text-lg text-muted-foreground">
              Comparez les differents dispositifs de defiscalisation immobiliere
              pour choisir celui qui correspond le mieux a votre situation.
            </p>
          </div>

          {/* Tableau comparatif */}
          <div className="mb-12">
            <Card>
              <CardContent className="pt-6">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[200px]">Critere</TableHead>
                        <TableHead className="bg-primary/5">
                          <div className="flex flex-col">
                            <span className="font-bold text-primary">Loi Jeanbrun</span>
                            <span className="text-xs font-normal text-muted-foreground">PLF 2026</span>
                          </div>
                        </TableHead>
                        <TableHead>
                          <div className="flex flex-col">
                            <span className="font-bold">Loi Pinel</span>
                            <span className="text-xs font-normal text-muted-foreground">Fin 2024</span>
                          </div>
                        </TableHead>
                        <TableHead>
                          <div className="flex flex-col">
                            <span className="font-bold">LMNP</span>
                            <span className="text-xs font-normal text-muted-foreground">Location meublee</span>
                          </div>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {comparaison.map((row) => (
                        <TableRow key={row.critere}>
                          <TableCell className="font-medium">{row.critere}</TableCell>
                          <TableCell className="bg-primary/5">
                            <StatusIcon status={row.jeanbrunStatus} />
                            <span className={row.jeanbrunStatus ? 'ml-2' : ''}>{row.jeanbrun}</span>
                          </TableCell>
                          <TableCell>
                            <StatusIcon status={row.pinelStatus} />
                            <span className={row.pinelStatus ? 'ml-2' : ''}>{row.pinel}</span>
                          </TableCell>
                          <TableCell>
                            <StatusIcon status={row.lmnpStatus} />
                            <span className={row.lmnpStatus ? 'ml-2' : ''}>{row.lmnp}</span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quand choisir chaque dispositif */}
          <div>
            <h3 className="mb-6 text-2xl font-semibold">Quel dispositif choisir ?</h3>
            <div className="grid gap-6 lg:grid-cols-3">
              {quandChoisir.map((dispositif) => (
                <Card key={dispositif.dispositif} className="flex flex-col">
                  <CardHeader>
                    <div className="mb-2 text-3xl">{dispositif.icon}</div>
                    <CardTitle>{dispositif.dispositif}</CardTitle>
                    <CardDescription className="font-medium text-foreground">
                      {dispositif.ideal}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 space-y-4">
                    <div>
                      <p className="mb-2 text-sm font-semibold text-green-600">Avantages</p>
                      <ul className="space-y-1">
                        {dispositif.avantages.map((avantage) => (
                          <li key={avantage} className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                            <span>{avantage}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="mb-2 text-sm font-semibold text-red-600">Points d&apos;attention</p>
                      <ul className="space-y-1">
                        {dispositif.inconvenients.map((inconvenient) => (
                          <li key={inconvenient} className="flex items-start gap-2 text-sm">
                            <XCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-600" />
                            <span>{inconvenient}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
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
