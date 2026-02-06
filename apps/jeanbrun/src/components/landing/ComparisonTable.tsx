import { Check, X, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

type ComparisonValue = 'check' | 'cross' | 'partial' | string

interface ComparisonRow {
  criterion: string
  jeanbrun: ComparisonValue
  pinel: ComparisonValue
  lmnp: ComparisonValue
}

const comparisonData: ComparisonRow[] = [
  {
    criterion: "Amortissement max/an",
    jeanbrun: "12 000\u00A0\u20AC",
    pinel: "cross",
    lmnp: "Variable",
  },
  {
    criterion: "Plafond deficit foncier",
    jeanbrun: "21 400\u00A0\u20AC",
    pinel: "cross",
    lmnp: "10 700\u00A0\u20AC",
  },
  {
    criterion: "Economie sur 9 ans (TMI 45%)",
    jeanbrun: "~50 000\u00A0\u20AC",
    pinel: "54 000\u00A0\u20AC (12 ans)",
    lmnp: "Variable",
  },
  {
    criterion: "Hors plafond niches (10 750\u00A0\u20AC)",
    jeanbrun: "check",
    pinel: "cross",
    lmnp: "check",
  },
  {
    criterion: "Exoneration PV 22 ans",
    jeanbrun: "check",
    pinel: "check",
    lmnp: "cross",
  },
  {
    criterion: "Amortissements non reintegres",
    jeanbrun: "check",
    pinel: "partial",
    lmnp: "cross",
  },
  {
    criterion: "Ideal preparation retraite",
    jeanbrun: "check",
    pinel: "partial",
    lmnp: "partial",
  },
] as const

function renderValue(value: ComparisonValue, isHighlight: boolean = false) {
  if (value === 'check') {
    return (
      <span className={cn("flex items-center justify-center", isHighlight && "text-success")}>
        <Check className="h-5 w-5" aria-hidden="true" />
        <span className="sr-only">Oui</span>
      </span>
    )
  }
  if (value === 'cross') {
    return (
      <span className="flex items-center justify-center text-destructive">
        <X className="h-5 w-5" aria-hidden="true" />
        <span className="sr-only">Non</span>
      </span>
    )
  }
  if (value === 'partial') {
    return (
      <span className="flex items-center justify-center text-warning">
        <Minus className="h-5 w-5" aria-hidden="true" />
        <span className="sr-only">Partiel</span>
      </span>
    )
  }
  return <span className={cn(isHighlight && "font-semibold text-primary")}>{value}</span>
}

/**
 * ComparisonTable - Tableau comparatif Jeanbrun vs Pinel vs LMNP
 *
 * Features:
 * - Tableau accessible avec scope="col" et scope="row"
 * - Highlight sur la colonne Jeanbrun
 * - Icones check/cross avec texte sr-only pour lecteurs d'ecran
 * - Responsive: scroll horizontal sur mobile
 */
export function ComparisonTable() {
  return (
    <section
      aria-labelledby="comparison-table-title"
      className="py-16 md:py-24 bg-muted/30"
    >
      <div className="container mx-auto px-4">
        <h2
          id="comparison-table-title"
          className="text-2xl md:text-3xl font-serif text-center mb-4"
        >
          Comparatif des <span className="text-primary">dispositifs fiscaux</span>
        </h2>
        <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
          Decouvrez pourquoi la Loi Jeanbrun est le meilleur choix pour votre investissement locatif
        </p>

        <div className="max-w-4xl mx-auto overflow-x-auto">
          <table
            aria-label="Comparatif des dispositifs fiscaux immobiliers"
            className="w-full border-collapse"
          >
            <thead>
              <tr>
                <th
                  scope="col"
                  className="p-4 text-left text-sm font-semibold text-muted-foreground border-b border-border"
                >
                  Critere
                </th>
                <th
                  scope="col"
                  className={cn(
                    "p-4 text-center text-sm font-semibold border-b",
                    "bg-primary/10 border-primary/30 text-primary"
                  )}
                >
                  Loi Jeanbrun
                </th>
                <th
                  scope="col"
                  className="p-4 text-center text-sm font-semibold text-muted-foreground border-b border-border"
                >
                  Pinel (termine)
                </th>
                <th
                  scope="col"
                  className="p-4 text-center text-sm font-semibold text-muted-foreground border-b border-border"
                >
                  LMNP
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map((row, index) => (
                <tr
                  key={row.criterion}
                  className={cn(
                    "transition-colors hover:bg-muted/50",
                    index % 2 === 0 && "bg-card/50"
                  )}
                >
                  <th
                    scope="row"
                    className="p-4 text-left text-sm font-medium border-b border-border"
                  >
                    {row.criterion}
                  </th>
                  <td
                    className={cn(
                      "p-4 text-center text-sm border-b",
                      "bg-primary/5 border-primary/20"
                    )}
                  >
                    {renderValue(row.jeanbrun, true)}
                  </td>
                  <td className="p-4 text-center text-sm border-b border-border">
                    {renderValue(row.pinel)}
                  </td>
                  <td className="p-4 text-center text-sm border-b border-border">
                    {renderValue(row.lmnp)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-6">
          * Pinel a pris fin au 31/12/2024. Les comparaisons sont basees sur les conditions historiques du dispositif.
        </p>
      </div>
    </section>
  )
}

export default ComparisonTable
