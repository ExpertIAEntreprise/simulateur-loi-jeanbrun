# Phase 2 - Moteur de Calcul

**Sprint:** 2
**Semaines:** S3-S4 (17-28 Février 2026)
**Effort estimé:** 12 jours
**Objectif:** Tous les calculs fiscaux implémentés et testés à 90%+

---

## 1. Objectifs du sprint

### 1.1 Livrables attendus

| Livrable | Description | Critère de validation |
|----------|-------------|----------------------|
| Module IR | Calcul impôt sur le revenu 2026 | Tests passent |
| Module TMI | Calcul automatique TMI | Précision 100% |
| Module Jeanbrun Neuf | Amortissement logement neuf | Formules validées |
| Module Jeanbrun Ancien | Amortissement logement ancien | Seuil 30% travaux |
| Module Déficit Foncier | Déficit bonifié 21 400€ | Plafond respecté |
| Module Crédit | Mensualités + tableau amort. | Calculs exacts |
| Module Plus-Value | PV immobilière avec abattements | Barèmes 2026 |
| Module LMNP | Comparatif LMNP | Résultats cohérents |
| Module Rendements | Brut, Net, Net-Net | 3 types calculés |
| Orchestrateur | Coordination tous calculs | Résultat complet |
| Tests unitaires | Couverture 90%+ | Coverage report |

### 1.2 Dépendances

- Sprint 1 terminé (infrastructure OK)
- Formules validées dans `/root/simulateur_loi_Jeanbrun/formules_calcul_simulateur_jeanbrun.md`
- Barèmes fiscaux 2026 confirmés

---

## 2. Formules critiques

### 2.1 Barèmes IR 2026

```typescript
// Barème progressif IR 2026 (revenus 2025)
const TRANCHES_IR_2026 = [
  { min: 0, max: 11_294, taux: 0 },
  { min: 11_294, max: 28_797, taux: 0.11 },
  { min: 28_797, max: 82_341, taux: 0.30 },
  { min: 82_341, max: 177_106, taux: 0.41 },
  { min: 177_106, max: Infinity, taux: 0.45 },
]

// Quotient familial
const PLAFOND_QF = 1_759 // par demi-part supplémentaire
```

### 2.2 Amortissement Jeanbrun Neuf

```typescript
// Base: 80% du prix d'acquisition (terrain exclu)
const BASE_AMORTISSEMENT = prixAcquisition * 0.80

// Taux et plafonds par niveau de loyer
const JEANBRUN_NEUF = {
  intermediaire: { taux: 0.035, plafond: 8_000 },
  social: { taux: 0.045, plafond: 10_000 },
  tres_social: { taux: 0.055, plafond: 12_000 },
}

// Durée engagement: 9 ans obligatoire
```

### 2.3 Amortissement Jeanbrun Ancien

```typescript
// Condition: travaux >= 30% du prix d'acquisition
const SEUIL_TRAVAUX = 0.30

// Taux et plafond unique
const JEANBRUN_ANCIEN = {
  intermediaire: { taux: 0.030, plafond: 10_700 },
  social: { taux: 0.035, plafond: 10_700 },
  tres_social: { taux: 0.040, plafond: 10_700 },
}
```

### 2.4 Déficit Foncier Bonifié

```typescript
// Plafond majoré jusqu'au 31/12/2027
const DEFICIT_FONCIER_BONIFIE = 21_400 // vs 10 700€ normal
const DATE_FIN_BONIFICATION = new Date('2027-12-31')

// Conditions d'application
// - Travaux énergétiques
// - Passage de classe E/F/G à A/B/C/D
```

### 2.5 Plafonds de Loyer par Zone

```typescript
const PLAFONDS_LOYER_M2_2026 = {
  A_bis: { intermediaire: 18.89, social: 15.11, tres_social: 13.22 },
  A: { intermediaire: 14.03, social: 11.22, tres_social: 9.82 },
  B1: { intermediaire: 11.31, social: 9.05, tres_social: 7.92 },
  B2: { intermediaire: 9.83, social: 7.86, tres_social: 6.88 },
  C: { intermediaire: 9.83, social: 7.86, tres_social: 6.88 },
}

// Coefficient de surface
// = 0.7 + (19 / surface)
// Plafonné à 1.2
```

---

## 3. Tâches détaillées

### 3.1 Module calcul IR 2026 (1,5j)

**ID:** 2.1
**Fichier:** `src/lib/calculs/ir.ts`

```typescript
import { TRANCHES_IR_2026, PLAFOND_QF } from './constants'

interface CalculIRInput {
  revenuNetImposable: number
  nombreParts: number
}

interface CalculIRResult {
  impotBrut: number
  impotNet: number
  tmi: number
  tauxMoyen: number
}

/**
 * Calcule l'impôt sur le revenu selon le barème 2026
 */
export function calculerIR(input: CalculIRInput): CalculIRResult {
  const { revenuNetImposable, nombreParts } = input

  // Quotient familial
  const quotient = revenuNetImposable / nombreParts

  // Calcul par tranches
  let impotQuotient = 0
  let tmi = 0

  for (const tranche of TRANCHES_IR_2026) {
    if (quotient > tranche.min) {
      const assiette = Math.min(quotient, tranche.max) - tranche.min
      impotQuotient += assiette * tranche.taux
      if (quotient >= tranche.min) {
        tmi = tranche.taux
      }
    }
  }

  // Impôt brut (avant plafonnement QF)
  const impotBrut = impotQuotient * nombreParts

  // Plafonnement quotient familial
  const impotSansQF = calculerImpotSansQF(revenuNetImposable)
  const avantageQF = impotSansQF - impotBrut
  const plafondAvantage = PLAFOND_QF * (nombreParts - 1) * 2

  const impotNet = avantageQF > plafondAvantage
    ? impotSansQF - plafondAvantage
    : impotBrut

  return {
    impotBrut,
    impotNet,
    tmi,
    tauxMoyen: impotNet / revenuNetImposable,
  }
}

function calculerImpotSansQF(revenu: number): number {
  let impot = 0
  for (const tranche of TRANCHES_IR_2026) {
    if (revenu > tranche.min) {
      const assiette = Math.min(revenu, tranche.max) - tranche.min
      impot += assiette * tranche.taux
    }
  }
  return impot
}

/**
 * Détermine la TMI depuis les revenus
 */
export function determinerTMI(revenuNetImposable: number, nombreParts: number): number {
  const quotient = revenuNetImposable / nombreParts

  for (let i = TRANCHES_IR_2026.length - 1; i >= 0; i--) {
    if (quotient > TRANCHES_IR_2026[i].min) {
      return TRANCHES_IR_2026[i].taux
    }
  }

  return 0
}
```

---

### 3.2 Module TMI automatique (0,5j)

**ID:** 2.2
**Fichier:** `src/lib/calculs/tmi.ts`

```typescript
import { TRANCHES_IR_2026 } from './constants'

interface TMIResult {
  tmi: number
  trancheBasse: number
  trancheHaute: number
  revenuRestantDansLaTranche: number
}

/**
 * Calcule la TMI et informations de tranche
 */
export function calculerTMI(
  revenuNetImposable: number,
  nombreParts: number
): TMIResult {
  const quotient = revenuNetImposable / nombreParts

  let trancheActive = TRANCHES_IR_2026[0]

  for (const tranche of TRANCHES_IR_2026) {
    if (quotient > tranche.min) {
      trancheActive = tranche
    }
  }

  const revenuRestant = trancheActive.max === Infinity
    ? 0
    : (trancheActive.max - quotient) * nombreParts

  return {
    tmi: trancheActive.taux,
    trancheBasse: trancheActive.min * nombreParts,
    trancheHaute: trancheActive.max === Infinity
      ? Infinity
      : trancheActive.max * nombreParts,
    revenuRestantDansLaTranche: revenuRestant,
  }
}

/**
 * Calcule l'économie d'impôt pour une déduction
 */
export function calculerEconomieImpot(
  deduction: number,
  tmi: number
): number {
  return deduction * tmi
}
```

---

### 3.3 Module amortissement Jeanbrun neuf (1j)

**ID:** 2.3
**Fichier:** `src/lib/calculs/jeanbrun-neuf.ts`

```typescript
import { JEANBRUN_NEUF } from './constants'

type NiveauLoyer = 'intermediaire' | 'social' | 'tres_social'

interface JeanbrunNeufInput {
  prixAcquisition: number
  niveauLoyer: NiveauLoyer
  dureeEngagement?: number // 9 ans par défaut
}

interface JeanbrunNeufResult {
  baseAmortissement: number
  tauxApplique: number
  amortissementBrut: number
  amortissementPlafonne: number
  plafondApplique: number
  depassePlafond: boolean
  dureeEngagement: number
}

/**
 * Calcule l'amortissement Jeanbrun pour un logement neuf
 */
export function calculerJeanbrunNeuf(
  input: JeanbrunNeufInput
): JeanbrunNeufResult {
  const { prixAcquisition, niveauLoyer, dureeEngagement = 9 } = input

  // Base: 80% du prix (terrain exclu)
  const baseAmortissement = prixAcquisition * 0.80

  // Taux et plafond selon niveau de loyer
  const { taux, plafond } = JEANBRUN_NEUF[niveauLoyer]

  // Amortissement brut
  const amortissementBrut = baseAmortissement * taux

  // Application du plafond
  const amortissementPlafonne = Math.min(amortissementBrut, plafond)

  return {
    baseAmortissement,
    tauxApplique: taux,
    amortissementBrut,
    amortissementPlafonne,
    plafondApplique: plafond,
    depassePlafond: amortissementBrut > plafond,
    dureeEngagement,
  }
}

/**
 * Calcule le tableau d'amortissement sur 9 ans
 */
export function tableauAmortissementNeuf(
  input: JeanbrunNeufInput
): AmortissementAnnuel[] {
  const result = calculerJeanbrunNeuf(input)
  const tableau: AmortissementAnnuel[] = []

  for (let annee = 1; annee <= result.dureeEngagement; annee++) {
    tableau.push({
      annee,
      amortissement: result.amortissementPlafonne,
      cumulAmortissement: result.amortissementPlafonne * annee,
    })
  }

  return tableau
}

interface AmortissementAnnuel {
  annee: number
  amortissement: number
  cumulAmortissement: number
}
```

---

### 3.4 Module amortissement Jeanbrun ancien (1j)

**ID:** 2.4
**Fichier:** `src/lib/calculs/jeanbrun-ancien.ts`

```typescript
import { JEANBRUN_ANCIEN, SEUIL_TRAVAUX } from './constants'

type NiveauLoyer = 'intermediaire' | 'social' | 'tres_social'

interface JeanbrunAncienInput {
  prixAcquisition: number
  montantTravaux: number
  niveauLoyer: NiveauLoyer
  dureeEngagement?: number
}

interface JeanbrunAncienResult {
  eligible: boolean
  raisonIneligibilite?: string
  ratioTravaux: number
  seuilRequis: number
  baseAmortissement: number
  tauxApplique: number
  amortissementBrut: number
  amortissementPlafonne: number
  plafondApplique: number
}

/**
 * Calcule l'amortissement Jeanbrun pour un logement ancien
 * Condition: travaux >= 30% du prix d'acquisition
 */
export function calculerJeanbrunAncien(
  input: JeanbrunAncienInput
): JeanbrunAncienResult {
  const { prixAcquisition, montantTravaux, niveauLoyer } = input

  // Vérification seuil travaux 30%
  const ratioTravaux = montantTravaux / prixAcquisition
  const seuilRequis = prixAcquisition * SEUIL_TRAVAUX
  const eligible = ratioTravaux >= SEUIL_TRAVAUX

  if (!eligible) {
    return {
      eligible: false,
      raisonIneligibilite: `Travaux insuffisants: ${(ratioTravaux * 100).toFixed(1)}% (minimum requis: 30%)`,
      ratioTravaux,
      seuilRequis,
      baseAmortissement: 0,
      tauxApplique: 0,
      amortissementBrut: 0,
      amortissementPlafonne: 0,
      plafondApplique: 0,
    }
  }

  // Base: 80% du prix total (acquisition + travaux)
  const prixTotal = prixAcquisition + montantTravaux
  const baseAmortissement = prixTotal * 0.80

  // Taux et plafond selon niveau de loyer
  const { taux, plafond } = JEANBRUN_ANCIEN[niveauLoyer]

  // Amortissement brut
  const amortissementBrut = baseAmortissement * taux

  // Application du plafond unique (10 700€)
  const amortissementPlafonne = Math.min(amortissementBrut, plafond)

  return {
    eligible: true,
    ratioTravaux,
    seuilRequis,
    baseAmortissement,
    tauxApplique: taux,
    amortissementBrut,
    amortissementPlafonne,
    plafondApplique: plafond,
  }
}

/**
 * Calcule le montant minimum de travaux requis
 */
export function calculerTravauxMinimum(prixAcquisition: number): number {
  return prixAcquisition * SEUIL_TRAVAUX
}

/**
 * Vérifie l'éligibilité travaux
 */
export function verifierEligibiliteTravaux(
  prixAcquisition: number,
  montantTravaux: number
): { eligible: boolean; manquant: number } {
  const minimum = calculerTravauxMinimum(prixAcquisition)
  const eligible = montantTravaux >= minimum
  const manquant = eligible ? 0 : minimum - montantTravaux

  return { eligible, manquant }
}
```

---

### 3.5 Module déficit foncier bonifié (1j)

**ID:** 2.5
**Fichier:** `src/lib/calculs/deficit-foncier.ts`

```typescript
import { DEFICIT_FONCIER_BONIFIE, DATE_FIN_BONIFICATION } from './constants'

interface DeficitFoncierInput {
  revenusFonciers: number
  chargesDeductibles: number
  dateAcquisition: Date
  travauxEnergetiques: boolean
}

interface DeficitFoncierResult {
  deficitBrut: number
  deficitImputableRevenuGlobal: number
  deficitReportable: number
  plafondApplique: number
  bonificationActive: boolean
  anneesBonification: number
}

/**
 * Calcule le déficit foncier avec bonification éventuelle
 * Plafond bonifié: 21 400€ jusqu'au 31/12/2027
 */
export function calculerDeficitFoncier(
  input: DeficitFoncierInput
): DeficitFoncierResult {
  const {
    revenusFonciers,
    chargesDeductibles,
    dateAcquisition,
    travauxEnergetiques
  } = input

  // Calcul déficit brut
  const deficitBrut = Math.max(0, chargesDeductibles - revenusFonciers)

  if (deficitBrut === 0) {
    return {
      deficitBrut: 0,
      deficitImputableRevenuGlobal: 0,
      deficitReportable: 0,
      plafondApplique: 0,
      bonificationActive: false,
      anneesBonification: 0,
    }
  }

  // Vérification bonification
  const bonificationActive =
    travauxEnergetiques &&
    dateAcquisition <= DATE_FIN_BONIFICATION

  const plafondApplique = bonificationActive
    ? DEFICIT_FONCIER_BONIFIE
    : 10_700

  // Imputation sur revenu global (plafonné)
  const deficitImputableRevenuGlobal = Math.min(deficitBrut, plafondApplique)

  // Report sur revenus fonciers futurs (10 ans)
  const deficitReportable = deficitBrut - deficitImputableRevenuGlobal

  // Années restantes de bonification
  const anneesBonification = bonificationActive
    ? Math.max(0, DATE_FIN_BONIFICATION.getFullYear() - new Date().getFullYear())
    : 0

  return {
    deficitBrut,
    deficitImputableRevenuGlobal,
    deficitReportable,
    plafondApplique,
    bonificationActive,
    anneesBonification,
  }
}

/**
 * Calcule le tableau de report du déficit sur 10 ans
 */
export function tableauReportDeficit(
  deficitReportable: number,
  revenusFonciersFuturs: number[]
): ReportDeficitAnnuel[] {
  const tableau: ReportDeficitAnnuel[] = []
  let deficitRestant = deficitReportable

  for (let i = 0; i < 10 && deficitRestant > 0; i++) {
    const revenuAnnee = revenusFonciersFuturs[i] || 0
    const imputationAnnee = Math.min(deficitRestant, revenuAnnee)
    deficitRestant -= imputationAnnee

    tableau.push({
      annee: i + 1,
      revenuFoncier: revenuAnnee,
      imputationDeficit: imputationAnnee,
      deficitRestant,
    })
  }

  return tableau
}

interface ReportDeficitAnnuel {
  annee: number
  revenuFoncier: number
  imputationDeficit: number
  deficitRestant: number
}
```

---

### 3.6 Module calcul crédit immobilier (1j)

**ID:** 2.6
**Fichier:** `src/lib/calculs/credit.ts`

```typescript
interface CreditInput {
  montantEmprunte: number
  tauxAnnuel: number // en décimal (0.035 pour 3.5%)
  dureeAnnees: number
  assuranceAnnuelle: number // en décimal (0.0036 pour 0.36%)
  differeMois?: number
}

interface CreditResult {
  mensualiteHorsAssurance: number
  mensualiteAssurance: number
  mensualiteTotale: number
  coutTotalCredit: number
  coutTotalInterets: number
  coutTotalAssurance: number
  tauxEffectifGlobal: number
  tableauAmortissement: LigneAmortissement[]
}

interface LigneAmortissement {
  mois: number
  mensualite: number
  capital: number
  interets: number
  assurance: number
  capitalRestant: number
}

/**
 * Calcule les mensualités et le tableau d'amortissement
 */
export function calculerCredit(input: CreditInput): CreditResult {
  const {
    montantEmprunte,
    tauxAnnuel,
    dureeAnnees,
    assuranceAnnuelle,
    differeMois = 0
  } = input

  const tauxMensuel = tauxAnnuel / 12
  const nbMensualites = dureeAnnees * 12

  // Mensualité hors assurance (formule standard)
  const mensualiteHorsAssurance =
    (montantEmprunte * tauxMensuel) /
    (1 - Math.pow(1 + tauxMensuel, -nbMensualites))

  // Assurance mensuelle
  const mensualiteAssurance = (montantEmprunte * assuranceAnnuelle) / 12

  // Mensualité totale
  const mensualiteTotale = mensualiteHorsAssurance + mensualiteAssurance

  // Tableau d'amortissement
  const tableauAmortissement: LigneAmortissement[] = []
  let capitalRestant = montantEmprunte
  let coutTotalInterets = 0

  for (let mois = 1; mois <= nbMensualites; mois++) {
    const interetsMois = capitalRestant * tauxMensuel
    const capitalMois = mensualiteHorsAssurance - interetsMois
    capitalRestant -= capitalMois
    coutTotalInterets += interetsMois

    // Gestion du différé
    const enDiffere = mois <= differeMois

    tableauAmortissement.push({
      mois,
      mensualite: enDiffere ? interetsMois + mensualiteAssurance : mensualiteTotale,
      capital: enDiffere ? 0 : capitalMois,
      interets: interetsMois,
      assurance: mensualiteAssurance,
      capitalRestant: Math.max(0, capitalRestant),
    })
  }

  const coutTotalAssurance = mensualiteAssurance * nbMensualites
  const coutTotalCredit = coutTotalInterets + coutTotalAssurance

  // TAEG simplifié
  const tauxEffectifGlobal =
    (coutTotalCredit / montantEmprunte / dureeAnnees) + tauxAnnuel

  return {
    mensualiteHorsAssurance: Math.round(mensualiteHorsAssurance * 100) / 100,
    mensualiteAssurance: Math.round(mensualiteAssurance * 100) / 100,
    mensualiteTotale: Math.round(mensualiteTotale * 100) / 100,
    coutTotalCredit: Math.round(coutTotalCredit),
    coutTotalInterets: Math.round(coutTotalInterets),
    coutTotalAssurance: Math.round(coutTotalAssurance),
    tauxEffectifGlobal: Math.round(tauxEffectifGlobal * 10000) / 10000,
    tableauAmortissement,
  }
}

/**
 * Calcule la capacité d'emprunt
 */
export function calculerCapaciteEmprunt(
  revenuMensuel: number,
  chargesMensuelles: number,
  tauxEndettementMax: number = 0.35,
  tauxAnnuel: number,
  dureeAnnees: number
): number {
  const mensualiteMax = (revenuMensuel * tauxEndettementMax) - chargesMensuelles
  const tauxMensuel = tauxAnnuel / 12
  const nbMensualites = dureeAnnees * 12

  const capacite = mensualiteMax *
    (1 - Math.pow(1 + tauxMensuel, -nbMensualites)) /
    tauxMensuel

  return Math.round(capacite)
}

/**
 * Calcule le taux d'endettement
 */
export function calculerTauxEndettement(
  revenuMensuel: number,
  mensualiteCredit: number,
  autresCharges: number = 0
): number {
  return (mensualiteCredit + autresCharges) / revenuMensuel
}
```

---

### 3.7 Module plus-value immobilière (1,5j)

**ID:** 2.7
**Fichier:** `src/lib/calculs/plus-value.ts`

```typescript
/**
 * Barème des abattements pour durée de détention
 * IR: exonération totale après 22 ans
 * PS: exonération totale après 30 ans
 */
const ABATTEMENTS_PV = {
  ir: [
    { annees: 5, abattement: 0 },      // 0-5 ans: 0%
    { annees: 21, abattement: 0.06 },  // 6-21 ans: 6%/an
    { annees: 22, abattement: 0.04 },  // 22e année: 4%
    // Au-delà: exonération totale
  ],
  ps: [
    { annees: 5, abattement: 0 },      // 0-5 ans: 0%
    { annees: 21, abattement: 0.0165 }, // 6-21 ans: 1.65%/an
    { annees: 22, abattement: 0.0160 }, // 22e année: 1.6%
    { annees: 30, abattement: 0.09 },   // 23-30 ans: 9%/an
    // Au-delà: exonération totale
  ],
}

interface PlusValueInput {
  prixVente: number
  prixAcquisition: number
  fraisAcquisition?: number // Forfait 7.5% ou réel
  travauxDeductibles?: number
  anneesDetention: number
}

interface PlusValueResult {
  plusValueBrute: number
  abattementIR: number
  abattementPS: number
  plusValueImposableIR: number
  plusValueImposablePS: number
  impotIR: number // 19%
  prelevementsSociaux: number // 17.2%
  surtaxe: number
  impotTotal: number
  netVendeur: number
}

/**
 * Calcule la plus-value immobilière avec abattements
 */
export function calculerPlusValue(input: PlusValueInput): PlusValueResult {
  const {
    prixVente,
    prixAcquisition,
    fraisAcquisition = prixAcquisition * 0.075, // Forfait 7.5%
    travauxDeductibles = 0,
    anneesDetention,
  } = input

  // Prix de revient
  const prixRevient = prixAcquisition + fraisAcquisition + travauxDeductibles

  // Plus-value brute
  const plusValueBrute = Math.max(0, prixVente - prixRevient)

  if (plusValueBrute === 0) {
    return createZeroResult(prixVente)
  }

  // Calcul abattements
  const abattementIR = calculerAbattementIR(anneesDetention)
  const abattementPS = calculerAbattementPS(anneesDetention)

  // Plus-values imposables
  const plusValueImposableIR = plusValueBrute * (1 - abattementIR)
  const plusValueImposablePS = plusValueBrute * (1 - abattementPS)

  // Impôts
  const impotIR = plusValueImposableIR * 0.19
  const prelevementsSociaux = plusValueImposablePS * 0.172

  // Surtaxe (PV imposable > 50 000€)
  const surtaxe = calculerSurtaxe(plusValueImposableIR)

  const impotTotal = impotIR + prelevementsSociaux + surtaxe
  const netVendeur = prixVente - impotTotal

  return {
    plusValueBrute,
    abattementIR,
    abattementPS,
    plusValueImposableIR,
    plusValueImposablePS,
    impotIR: Math.round(impotIR),
    prelevementsSociaux: Math.round(prelevementsSociaux),
    surtaxe: Math.round(surtaxe),
    impotTotal: Math.round(impotTotal),
    netVendeur: Math.round(netVendeur),
  }
}

function calculerAbattementIR(annees: number): number {
  if (annees >= 22) return 1 // Exonération totale
  if (annees <= 5) return 0
  return 0.06 * (annees - 5) + (annees >= 22 ? 0.04 : 0)
}

function calculerAbattementPS(annees: number): number {
  if (annees >= 30) return 1 // Exonération totale
  if (annees <= 5) return 0

  let abattement = 0
  if (annees > 5) abattement += 0.0165 * Math.min(annees - 5, 16)
  if (annees > 21) abattement += 0.016
  if (annees > 22) abattement += 0.09 * Math.min(annees - 22, 8)

  return abattement
}

function calculerSurtaxe(pvImposable: number): number {
  if (pvImposable <= 50_000) return 0
  if (pvImposable <= 100_000) return pvImposable * 0.02
  if (pvImposable <= 150_000) return pvImposable * 0.03
  if (pvImposable <= 200_000) return pvImposable * 0.04
  if (pvImposable <= 250_000) return pvImposable * 0.05
  return pvImposable * 0.06
}

function createZeroResult(prixVente: number): PlusValueResult {
  return {
    plusValueBrute: 0,
    abattementIR: 0,
    abattementPS: 0,
    plusValueImposableIR: 0,
    plusValueImposablePS: 0,
    impotIR: 0,
    prelevementsSociaux: 0,
    surtaxe: 0,
    impotTotal: 0,
    netVendeur: prixVente,
  }
}
```

---

### 3.8 Module LMNP (1j)

**ID:** 2.8
**Fichier:** `src/lib/calculs/lmnp.ts`

```typescript
interface LMNPInput {
  loyerAnnuel: number
  chargesAnnuelles: number
  prixAcquisition: number
  valeurMobilier: number // 10-15% du prix généralement
  dureeAmortissementImmo: number // 25-30 ans
  dureeAmortissementMobilier: number // 5-10 ans
}

interface LMNPResult {
  recettesBrutes: number
  chargesDeductibles: number
  amortissementImmo: number
  amortissementMobilier: number
  amortissementTotal: number
  resultatFiscal: number
  impotLMNP: number
  cashFlowNet: number
}

/**
 * Calcule le résultat fiscal en LMNP (réel simplifié)
 */
export function calculerLMNP(input: LMNPInput): LMNPResult {
  const {
    loyerAnnuel,
    chargesAnnuelles,
    prixAcquisition,
    valeurMobilier,
    dureeAmortissementImmo = 30,
    dureeAmortissementMobilier = 7,
  } = input

  // Amortissements
  const amortissementImmo = (prixAcquisition - valeurMobilier) / dureeAmortissementImmo
  const amortissementMobilier = valeurMobilier / dureeAmortissementMobilier
  const amortissementTotal = amortissementImmo + amortissementMobilier

  // Résultat fiscal
  const resultatAvantAmort = loyerAnnuel - chargesAnnuelles

  // En LMNP, l'amortissement ne peut pas créer de déficit
  const amortissementImputable = Math.min(amortissementTotal, resultatAvantAmort)
  const resultatFiscal = Math.max(0, resultatAvantAmort - amortissementImputable)

  // Impôt (IR + PS sur BIC)
  // Note: dépend de la TMI du contribuable, ici estimation moyenne
  const impotLMNP = resultatFiscal * 0.30 // TMI 30% + PS approximatif

  // Cash-flow net
  const cashFlowNet = loyerAnnuel - chargesAnnuelles - impotLMNP

  return {
    recettesBrutes: loyerAnnuel,
    chargesDeductibles: chargesAnnuelles,
    amortissementImmo: Math.round(amortissementImmo),
    amortissementMobilier: Math.round(amortissementMobilier),
    amortissementTotal: Math.round(amortissementTotal),
    resultatFiscal: Math.round(resultatFiscal),
    impotLMNP: Math.round(impotLMNP),
    cashFlowNet: Math.round(cashFlowNet),
  }
}

/**
 * Compare Jeanbrun vs LMNP
 */
export function comparerJeanbrunLMNP(
  jeanbrunResult: { economieFiscale: number; cashFlow: number },
  lmnpResult: LMNPResult
): ComparatifResult {
  const avantageJeanbrun = jeanbrunResult.economieFiscale + jeanbrunResult.cashFlow
  const avantageLMNP = lmnpResult.cashFlowNet

  return {
    avantageJeanbrun,
    avantageLMNP,
    difference: avantageJeanbrun - avantageLMNP,
    recommandation: avantageJeanbrun > avantageLMNP ? 'Jeanbrun' : 'LMNP',
    details: {
      jeanbrun: {
        economieFiscale: jeanbrunResult.economieFiscale,
        cashFlow: jeanbrunResult.cashFlow,
        total: avantageJeanbrun,
      },
      lmnp: {
        resultatFiscal: lmnpResult.resultatFiscal,
        impot: lmnpResult.impotLMNP,
        cashFlow: lmnpResult.cashFlowNet,
        total: avantageLMNP,
      },
    },
  }
}

interface ComparatifResult {
  avantageJeanbrun: number
  avantageLMNP: number
  difference: number
  recommandation: 'Jeanbrun' | 'LMNP'
  details: {
    jeanbrun: { economieFiscale: number; cashFlow: number; total: number }
    lmnp: { resultatFiscal: number; impot: number; cashFlow: number; total: number }
  }
}
```

---

### 3.9 Module rendements (0,5j)

**ID:** 2.9
**Fichier:** `src/lib/calculs/rendements.ts`

```typescript
interface RendementInput {
  prixAcquisition: number
  loyerAnnuel: number
  chargesAnnuelles: number
  taxeFonciere: number
  fraisGestion: number
  vacanceLocative: number // pourcentage
  fraisAcquisition?: number // notaire ~8%
}

interface RendementResult {
  rendementBrut: number
  rendementNet: number
  rendementNetNet: number
  loyerNetAnnuel: number
  chargesProprietaire: number
}

/**
 * Calcule les 3 types de rendement locatif
 */
export function calculerRendements(input: RendementInput): RendementResult {
  const {
    prixAcquisition,
    loyerAnnuel,
    chargesAnnuelles,
    taxeFonciere,
    fraisGestion,
    vacanceLocative,
    fraisAcquisition = prixAcquisition * 0.08,
  } = input

  // Prix total d'investissement
  const investissementTotal = prixAcquisition + fraisAcquisition

  // Loyer effectif (après vacance)
  const loyerEffectif = loyerAnnuel * (1 - vacanceLocative)

  // Charges propriétaire
  const chargesProprietaire = chargesAnnuelles + taxeFonciere + fraisGestion

  // Rendement brut
  const rendementBrut = loyerAnnuel / prixAcquisition

  // Rendement net (charges déduites)
  const loyerNetAnnuel = loyerEffectif - chargesProprietaire
  const rendementNet = loyerNetAnnuel / investissementTotal

  // Rendement net-net (après impôts - estimation)
  // Suppose TMI 30% et pas de déficit
  const impotEstime = Math.max(0, loyerNetAnnuel * 0.30)
  const rendementNetNet = (loyerNetAnnuel - impotEstime) / investissementTotal

  return {
    rendementBrut: Math.round(rendementBrut * 10000) / 100,
    rendementNet: Math.round(rendementNet * 10000) / 100,
    rendementNetNet: Math.round(rendementNetNet * 10000) / 100,
    loyerNetAnnuel: Math.round(loyerNetAnnuel),
    chargesProprietaire: Math.round(chargesProprietaire),
  }
}
```

---

### 3.10 Tests unitaires calculs (2j)

**ID:** 2.10
**Fichier:** `src/lib/calculs/__tests__/ir.test.ts`

```typescript
import { calculerIR, determinerTMI } from '../ir'

describe('Module IR', () => {
  describe('calculerIR', () => {
    test('célibataire revenus 30000€ → TMI 11%', () => {
      const result = calculerIR({ revenuNetImposable: 30000, nombreParts: 1 })
      expect(result.tmi).toBe(0.11)
      expect(result.impotNet).toBeCloseTo(2059, 0)
    })

    test('couple 2 parts revenus 60000€ → TMI 11%', () => {
      const result = calculerIR({ revenuNetImposable: 60000, nombreParts: 2 })
      expect(result.tmi).toBe(0.11)
    })

    test('célibataire revenus 50000€ → TMI 30%', () => {
      const result = calculerIR({ revenuNetImposable: 50000, nombreParts: 1 })
      expect(result.tmi).toBe(0.30)
    })

    test('revenus très élevés → TMI 45%', () => {
      const result = calculerIR({ revenuNetImposable: 200000, nombreParts: 1 })
      expect(result.tmi).toBe(0.45)
    })
  })

  describe('determinerTMI', () => {
    test.each([
      [10000, 1, 0],
      [20000, 1, 0.11],
      [40000, 1, 0.30],
      [100000, 1, 0.41],
      [200000, 1, 0.45],
    ])('revenus %i, %i part(s) → TMI %p', (revenus, parts, tmi) => {
      expect(determinerTMI(revenus, parts)).toBe(tmi)
    })
  })
})
```

**Fichier:** `src/lib/calculs/__tests__/jeanbrun-neuf.test.ts`

```typescript
import { calculerJeanbrunNeuf } from '../jeanbrun-neuf'

describe('Module Jeanbrun Neuf', () => {
  describe('calculerJeanbrunNeuf', () => {
    test('200k€ intermédiaire → 5600€/an plafonné à 8000€', () => {
      const result = calculerJeanbrunNeuf({
        prixAcquisition: 200000,
        niveauLoyer: 'intermediaire',
      })

      expect(result.baseAmortissement).toBe(160000)
      expect(result.tauxApplique).toBe(0.035)
      expect(result.amortissementBrut).toBe(5600)
      expect(result.amortissementPlafonne).toBe(5600)
      expect(result.depassePlafond).toBe(false)
    })

    test('300k€ intermédiaire → plafonné à 8000€', () => {
      const result = calculerJeanbrunNeuf({
        prixAcquisition: 300000,
        niveauLoyer: 'intermediaire',
      })

      expect(result.amortissementBrut).toBe(8400)
      expect(result.amortissementPlafonne).toBe(8000)
      expect(result.depassePlafond).toBe(true)
    })

    test('200k€ social → 7200€/an plafonné à 10000€', () => {
      const result = calculerJeanbrunNeuf({
        prixAcquisition: 200000,
        niveauLoyer: 'social',
      })

      expect(result.tauxApplique).toBe(0.045)
      expect(result.amortissementBrut).toBe(7200)
      expect(result.plafondApplique).toBe(10000)
    })

    test('200k€ très social → 8800€/an plafonné à 12000€', () => {
      const result = calculerJeanbrunNeuf({
        prixAcquisition: 200000,
        niveauLoyer: 'tres_social',
      })

      expect(result.tauxApplique).toBe(0.055)
      expect(result.amortissementBrut).toBe(8800)
      expect(result.plafondApplique).toBe(12000)
    })
  })
})
```

**Fichier:** `src/lib/calculs/__tests__/jeanbrun-ancien.test.ts`

```typescript
import { calculerJeanbrunAncien, verifierEligibiliteTravaux } from '../jeanbrun-ancien'

describe('Module Jeanbrun Ancien', () => {
  describe('verifierEligibiliteTravaux', () => {
    test('travaux 25% → inéligible', () => {
      const result = verifierEligibiliteTravaux(100000, 25000)
      expect(result.eligible).toBe(false)
      expect(result.manquant).toBe(5000)
    })

    test('travaux 30% → éligible', () => {
      const result = verifierEligibiliteTravaux(100000, 30000)
      expect(result.eligible).toBe(true)
      expect(result.manquant).toBe(0)
    })

    test('travaux 50% → éligible', () => {
      const result = verifierEligibiliteTravaux(100000, 50000)
      expect(result.eligible).toBe(true)
    })
  })

  describe('calculerJeanbrunAncien', () => {
    test('travaux insuffisants → inéligible', () => {
      const result = calculerJeanbrunAncien({
        prixAcquisition: 150000,
        montantTravaux: 30000, // 20% < 30%
        niveauLoyer: 'intermediaire',
      })

      expect(result.eligible).toBe(false)
      expect(result.amortissementPlafonne).toBe(0)
    })

    test('150k€ + 50k€ travaux intermédiaire → amort plafonné 10700€', () => {
      const result = calculerJeanbrunAncien({
        prixAcquisition: 150000,
        montantTravaux: 50000, // 33% >= 30%
        niveauLoyer: 'intermediaire',
      })

      expect(result.eligible).toBe(true)
      expect(result.baseAmortissement).toBe(160000) // (150+50)*0.80
      expect(result.amortissementBrut).toBe(4800) // 160000*0.03
      expect(result.amortissementPlafonne).toBe(4800)
      expect(result.plafondApplique).toBe(10700)
    })
  })
})
```

---

### 3.11 Orchestrateur simulation (1j)

**ID:** 2.11
**Fichier:** `src/lib/calculs/orchestrateur.ts`

```typescript
import { calculerIR, determinerTMI } from './ir'
import { calculerJeanbrunNeuf } from './jeanbrun-neuf'
import { calculerJeanbrunAncien } from './jeanbrun-ancien'
import { calculerCredit } from './credit'
import { calculerRendements } from './rendements'
import { calculerLMNP, comparerJeanbrunLMNP } from './lmnp'
import { calculerPlusValue } from './plus-value'
import type { SimulationInput, SimulationResult } from '@/types/simulation'

/**
 * Orchestre tous les calculs pour une simulation complète
 */
export async function orchestrerSimulation(
  input: SimulationInput
): Promise<SimulationResult> {
  // 1. Calcul TMI
  const tmi = determinerTMI(input.revenuNetImposable, input.partsFiscales)

  // 2. Calcul amortissement Jeanbrun
  const amortissement = input.typeBien === 'neuf'
    ? calculerJeanbrunNeuf({
        prixAcquisition: input.prixAcquisition,
        niveauLoyer: input.niveauLoyer,
      })
    : calculerJeanbrunAncien({
        prixAcquisition: input.prixAcquisition,
        montantTravaux: input.montantTravaux || 0,
        niveauLoyer: input.niveauLoyer,
      })

  // 3. Économie fiscale
  const economieFiscaleAnnuelle = amortissement.amortissementPlafonne * tmi
  const economieFiscaleTotale = economieFiscaleAnnuelle * 9 // 9 ans engagement

  // 4. Calcul crédit
  const montantEmprunte = input.prixAcquisition - input.apport
  const credit = calculerCredit({
    montantEmprunte,
    tauxAnnuel: input.tauxEmprunt,
    dureeAnnees: input.dureeEmprunt,
    assuranceAnnuelle: input.assuranceEmprunt,
    differeMois: input.differeMois,
  })

  // 5. Estimation loyer
  const loyerMensuelEstime = calculerLoyerEstime(
    input.surface,
    input.niveauLoyer,
    input.zoneFiscale
  )

  // 6. Rendements
  const rendements = calculerRendements({
    prixAcquisition: input.prixAcquisition,
    loyerAnnuel: loyerMensuelEstime * 12,
    chargesAnnuelles: input.chargesCopro,
    taxeFonciere: input.taxeFonciere,
    fraisGestion: input.fraisGestion,
    vacanceLocative: input.vacanceLocative,
  })

  // 7. Cash-flow
  const cashFlowMensuel =
    loyerMensuelEstime -
    credit.mensualiteTotale -
    (input.chargesCopro + input.taxeFonciere + input.fraisGestion) / 12

  // 8. Comparatif LMNP (optionnel)
  let comparatifLMNP = undefined
  if (input.comparerLMNP) {
    const lmnpResult = calculerLMNP({
      loyerAnnuel: loyerMensuelEstime * 12,
      chargesAnnuelles: input.chargesCopro + input.taxeFonciere + input.fraisGestion,
      prixAcquisition: input.prixAcquisition,
      valeurMobilier: input.prixAcquisition * 0.10,
      dureeAmortissementImmo: 30,
      dureeAmortissementMobilier: 7,
    })

    comparatifLMNP = comparerJeanbrunLMNP(
      { economieFiscale: economieFiscaleAnnuelle, cashFlow: cashFlowMensuel * 12 },
      lmnpResult
    )
  }

  // 9. Plus-value estimée à la sortie
  const revalorisationTotale = Math.pow(1 + input.revalorisationAnnuelle, input.dureeDetention)
  const prixVenteEstime = input.prixAcquisition * revalorisationTotale

  const plusValue = calculerPlusValue({
    prixVente: prixVenteEstime,
    prixAcquisition: input.prixAcquisition,
    anneesDetention: input.dureeDetention,
  })

  return {
    tmi,
    economieFiscaleAnnuelle: Math.round(economieFiscaleAnnuelle),
    economieFiscaleTotale: Math.round(economieFiscaleTotale),
    loyerMensuelEstime: Math.round(loyerMensuelEstime),
    mensualiteCredit: credit.mensualiteTotale,
    cashFlowMensuel: Math.round(cashFlowMensuel),
    rendementBrut: rendements.rendementBrut,
    rendementNet: rendements.rendementNet,
    baseAmortissement: amortissement.baseAmortissement,
    amortissementAnnuel: amortissement.amortissementBrut,
    amortissementPlafonne: amortissement.amortissementPlafonne,
    comparatifLMNP,
    plusValueEstimee: Math.round(plusValue.plusValueBrute),
    impotPlusValue: plusValue.impotTotal,
  }
}

function calculerLoyerEstime(
  surface: number,
  niveauLoyer: string,
  zoneFiscale: string
): number {
  const PLAFONDS = {
    A_bis: { intermediaire: 18.89, social: 15.11, tres_social: 13.22 },
    A: { intermediaire: 14.03, social: 11.22, tres_social: 9.82 },
    B1: { intermediaire: 11.31, social: 9.05, tres_social: 7.92 },
    B2: { intermediaire: 9.83, social: 7.86, tres_social: 6.88 },
    C: { intermediaire: 9.83, social: 7.86, tres_social: 6.88 },
  }

  const coefficient = Math.min(1.2, 0.7 + 19 / surface)
  const plafond = PLAFONDS[zoneFiscale]?.[niveauLoyer] || 10

  return surface * plafond * coefficient
}
```

---

## 4. Checklist de fin de sprint

### 4.1 Validations techniques

- [ ] Tous les modules de calcul créés
- [ ] TypeScript strict sans erreur
- [ ] ESLint sans warning
- [ ] Build production OK

### 4.2 Validations fonctionnelles

- [ ] Tests unitaires >= 90% coverage sur /lib/calculs/
- [ ] Calculs validés contre exemples du PRD (tolérance 1€)
- [ ] TMI automatique correct sur tous les cas
- [ ] Plafonds Jeanbrun correctement appliqués
- [ ] Seuil 30% travaux vérifié (ancien)
- [ ] Déficit bonifié 21 400€ pour 2026-2027

### 4.3 API

- [ ] `POST /api/simulation/calcul` fonctionnel
- [ ] Temps réponse < 100ms (P95)
- [ ] Validation Zod des inputs

---

## 5. Cas de test de référence

| Scénario | Entrées | Résultat attendu |
|----------|---------|------------------|
| Neuf intermédiaire 200k€ | TMI 30% | Économie 1 680€/an |
| Neuf social 200k€ | TMI 30% | Économie 2 160€/an |
| Neuf très social 200k€ | TMI 30% | Économie 2 640€/an |
| Ancien 150k€ + 50k€ travaux | TMI 30%, intermédiaire | Économie 1 440€/an |
| Ancien travaux insuffisants | 150k€ + 30k€ | Inéligible |

---

## 6. Ressources

| Ressource | Chemin |
|-----------|--------|
| Formules complètes | /root/simulateur_loi_Jeanbrun/formules_calcul_simulateur_jeanbrun.md |
| Barèmes IR 2026 | BOFiP à jour |
| Plafonds loyers | Arrêté du X/X/2026 |

---

**Auteur:** Équipe Claude Code
**Date:** 30 janvier 2026
