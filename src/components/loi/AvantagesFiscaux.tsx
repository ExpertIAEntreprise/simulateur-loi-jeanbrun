import Link from 'next/link'
import { Percent, Euro, TrendingUp, ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const tauxReduction = [
  {
    duree: '6 ans',
    taux: '6%',
    reductionMax: '18 000 EUR',
    reductionAnnuelle: '3 000 EUR/an',
  },
  {
    duree: '9 ans',
    taux: '9%',
    reductionMax: '27 000 EUR',
    reductionAnnuelle: '3 000 EUR/an',
  },
  {
    duree: '12 ans',
    taux: '12%',
    reductionMax: '36 000 EUR',
    reductionAnnuelle: '3 000 EUR/an',
  },
] as const

const exemplesInvestissement = [
  {
    titre: 'Investissement Studio',
    prix: 150000,
    duree: 6,
    taux: 6,
    surface: 25,
    ville: 'Lyon (Zone A)',
    loyerMensuel: 351,
  },
  {
    titre: 'Investissement T2',
    prix: 220000,
    duree: 9,
    taux: 9,
    surface: 45,
    ville: 'Nantes (Zone B1)',
    loyerMensuel: 509,
  },
  {
    titre: 'Investissement T3',
    prix: 300000,
    duree: 12,
    taux: 12,
    surface: 65,
    ville: 'Paris (Zone A bis)',
    loyerMensuel: 1228,
  },
] as const

function calculerReduction(prix: number, taux: number, duree: number) {
  const plafond = 300000
  const montantEligible = Math.min(prix, plafond)
  const reductionTotale = montantEligible * (taux / 100)
  const reductionAnnuelle = reductionTotale / duree
  return { reductionTotale, reductionAnnuelle }
}

export function AvantagesFiscaux() {
  return (
    <section id="avantages-fiscaux" className="bg-muted/30 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          {/* Section Header */}
          <div className="mb-12 text-center">
            <Badge variant="outline" className="mb-4">
              <Percent className="mr-2 h-4 w-4" />
              Avantages fiscaux
            </Badge>
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Combien pouvez-vous economiser ?
            </h2>
            <p className="text-lg text-muted-foreground">
              La loi Jeanbrun vous permet de reduire vos impots proportionnellement
              a la duree de votre engagement locatif.
            </p>
          </div>

          {/* Tableau des taux */}
          <div className="mb-12">
            <h3 className="mb-6 text-2xl font-semibold">Taux de reduction selon la duree d&apos;engagement</h3>
            <Card>
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Duree d&apos;engagement</TableHead>
                      <TableHead className="text-center">Taux de reduction</TableHead>
                      <TableHead className="text-right">Reduction max.</TableHead>
                      <TableHead className="text-right">Par an</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tauxReduction.map((row) => (
                      <TableRow key={row.duree}>
                        <TableCell className="font-medium">{row.duree}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant="secondary" className="text-lg font-bold">
                            {row.taux}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium">{row.reductionMax}</TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          {row.reductionAnnuelle}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Plafond d'investissement */}
          <div className="mb-12">
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Euro className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Plafond d&apos;investissement</CardTitle>
                    <CardDescription>
                      Montant maximum pris en compte pour le calcul de la reduction
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg bg-background p-4">
                    <p className="text-sm text-muted-foreground">Investissement annuel maximum</p>
                    <p className="text-3xl font-bold text-primary">300 000 EUR</p>
                  </div>
                  <div className="rounded-lg bg-background p-4">
                    <p className="text-sm text-muted-foreground">Nombre de logements par an</p>
                    <p className="text-3xl font-bold text-primary">2 maximum</p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  Le prix au metre carre est egalement plafonne a 5 500 EUR/m² pour eviter
                  les abus et garantir un investissement raisonnable.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Exemples chiffres */}
          <div className="mb-12">
            <h3 className="mb-6 text-2xl font-semibold">Exemples d&apos;investissements</h3>
            <div className="grid gap-6 md:grid-cols-3">
              {exemplesInvestissement.map((exemple) => {
                const { reductionTotale, reductionAnnuelle } = calculerReduction(
                  exemple.prix,
                  exemple.taux,
                  exemple.duree
                )
                return (
                  <Card key={exemple.titre} className="relative overflow-hidden">
                    <div className="absolute right-0 top-0 rounded-bl-lg bg-primary px-3 py-1">
                      <span className="text-sm font-semibold text-primary-foreground">
                        {exemple.duree} ans
                      </span>
                    </div>
                    <CardHeader className="pt-10">
                      <CardTitle className="text-lg">{exemple.titre}</CardTitle>
                      <CardDescription>{exemple.ville}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Prix d&apos;achat</span>
                          <span className="font-medium">{exemple.prix.toLocaleString('fr-FR')} EUR</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Surface</span>
                          <span className="font-medium">{exemple.surface} m²</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Loyer mensuel</span>
                          <span className="font-medium">{exemple.loyerMensuel} EUR</span>
                        </div>
                      </div>
                      <div className="border-t pt-4">
                        <div className="mb-2 flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium text-green-600">Avantage fiscal</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Reduction totale</span>
                          <span className="font-bold text-primary">
                            {reductionTotale.toLocaleString('fr-FR')} EUR
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Par an</span>
                          <span className="font-medium">
                            {reductionAnnuelle.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} EUR
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Formule de calcul */}
          <Card>
            <CardHeader>
              <CardTitle>Comment est calculee la reduction ?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg bg-muted p-4 font-mono text-sm">
                Reduction annuelle = (Prix d&apos;achat x Taux) / Duree d&apos;engagement
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                <strong>Exemple :</strong> Pour un investissement de 200 000 EUR sur 9 ans
                (taux 9%), la reduction annuelle est de (200 000 x 9%) / 9 = 2 000 EUR par an,
                soit 18 000 EUR au total.
              </p>
              <div className="mt-6 flex justify-center">
                <Button asChild>
                  <Link href="/dashboard">
                    Simuler mon investissement
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
