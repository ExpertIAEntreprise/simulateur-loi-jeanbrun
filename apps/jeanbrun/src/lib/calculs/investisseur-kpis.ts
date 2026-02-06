/**
 * KPIs investisseur pour le hero de la page programme
 *
 * Calculs server-side pour afficher des estimations rapides :
 * - Loyer estime mensuel
 * - Economie impot annuelle (TMI 30% par defaut)
 * - Effort mensuel estime (mensualite credit - loyer)
 *
 * Ces KPIs sont des estimations. Le simulateur avance donne le calcul personnalise.
 */

import { calculerLoyerEstime } from "./orchestrateur";
import { JEANBRUN_NEUF, FRAIS_ACQUISITION } from "./constants";
import type { ZoneFiscale } from "./types/common";
import type { NiveauLoyerJeanbrun } from "./types/jeanbrun";
import type { EspoProgramme } from "@/lib/espocrm/types";
import type { EspoVille } from "@/lib/espocrm/types";

/**
 * Resultat des KPIs investisseur
 */
export interface KPIsInvestisseur {
  /** Loyer mensuel estime en euros */
  loyerEstimeMensuel: number;
  /** Economie d'impot annuelle estimee en euros (TMI 30%) */
  economieImpotAnnuelle: number;
  /** Mensualite credit estimee en euros */
  mensualiteCredit: number;
  /** Effort mensuel estime = mensualite - loyer */
  effortMensuelEstime: number;
  /** Zone fiscale du programme */
  zoneFiscale: ZoneFiscale;
  /** Niveau de loyer utilise pour le calcul */
  niveauLoyer: NiveauLoyerJeanbrun;
}

/** TMI par defaut pour les estimations (30% = tranche la plus courante) */
const TMI_DEFAUT = 0.3;

/** Taux credit par defaut (3.4% en 2026) */
const TAUX_CREDIT_DEFAUT = 0.034;

/** Duree credit par defaut (20 ans) */
const DUREE_CREDIT_DEFAUT = 20;

/** Apport par defaut (10%) */
const APPORT_DEFAUT_RATIO = 0.1;

/**
 * Calcule la mensualite d'un credit immobilier (formule amortissement)
 *
 * Formule : M = C * (t / (1 - (1 + t)^-n))
 * Ou : C = capital, t = taux mensuel, n = nombre de mois
 */
function calculerMensualite(
  capital: number,
  tauxAnnuel: number,
  dureeAnnees: number
): number {
  if (capital <= 0 || tauxAnnuel <= 0 || dureeAnnees <= 0) return 0;

  const tauxMensuel = tauxAnnuel / 12;
  const nbMois = dureeAnnees * 12;

  const mensualite =
    capital * (tauxMensuel / (1 - Math.pow(1 + tauxMensuel, -nbMois)));

  return Math.round(mensualite);
}

/**
 * Calcule les KPIs investisseur pour un programme
 *
 * Utilise les donnees du programme et de la ville pour estimer :
 * - Le loyer via les baremes Jeanbrun (niveau intermediaire par defaut)
 * - L'economie d'impot via TMI 30% par defaut
 * - L'effort mensuel via un credit type (20 ans, 3.4%, 10% apport)
 */
export function calculerKPIsInvestisseur(
  programme: EspoProgramme,
  ville: EspoVille | null
): KPIsInvestisseur | null {
  const prix = programme.prixMin;
  if (!prix || prix <= 0) return null;

  // Determiner la zone fiscale (programme > ville > defaut B1)
  const zoneFiscaleRaw = programme.zoneFiscale ?? ville?.zoneFiscale ?? "B1";
  const zoneFiscale = zoneFiscaleRaw as ZoneFiscale;

  // Surface moyenne estimee (moyenne min/max ou surfaceMin seul)
  const surface = estimerSurface(programme);
  if (!surface || surface <= 0) return null;

  // Niveau de loyer par defaut : intermediaire (le plus courant)
  const niveauLoyer: NiveauLoyerJeanbrun = "intermediaire";

  // 1. Loyer estime
  const loyerEstimeMensuel = calculerLoyerEstime(surface, zoneFiscale, niveauLoyer);

  // 2. Economie d'impot annuelle (TMI 30% * amortissement Jeanbrun neuf)
  const baseAmortissement = prix * JEANBRUN_NEUF.baseAmortissement;
  const tauxAmortissement = JEANBRUN_NEUF.niveaux[niveauLoyer].taux;
  const plafondAmortissement = JEANBRUN_NEUF.niveaux[niveauLoyer].plafond;
  const amortissementBrut = baseAmortissement * tauxAmortissement;
  const amortissementNet = Math.min(amortissementBrut, plafondAmortissement);
  const economieImpotAnnuelle = Math.round(amortissementNet * TMI_DEFAUT);

  // 3. Mensualite credit (20 ans, 3.4%, 10% apport)
  const apport = prix * APPORT_DEFAUT_RATIO;
  const fraisNotaire = prix * FRAIS_ACQUISITION.tauxNeuf;
  const capitalEmprunte = prix + fraisNotaire - apport;
  const mensualiteCredit = calculerMensualite(
    capitalEmprunte,
    TAUX_CREDIT_DEFAUT,
    DUREE_CREDIT_DEFAUT
  );

  // 4. Effort mensuel = mensualite - loyer
  const effortMensuelEstime = mensualiteCredit - loyerEstimeMensuel;

  return {
    loyerEstimeMensuel,
    economieImpotAnnuelle,
    mensualiteCredit,
    effortMensuelEstime,
    zoneFiscale,
    niveauLoyer,
  };
}

/**
 * Estime la surface representative du programme
 * Utilise surfaceMin/surfaceMax ou prixM2Moyen
 */
function estimerSurface(programme: EspoProgramme): number | null {
  const { surfaceMin, surfaceMax, prixMin, prixM2Moyen } = programme;

  // Si on a min et max, prendre la moyenne
  if (surfaceMin != null && surfaceMax != null) {
    return Math.round((surfaceMin + surfaceMax) / 2);
  }

  // Si on a juste surfaceMin
  if (surfaceMin != null) return surfaceMin;

  // Si on a juste surfaceMax
  if (surfaceMax != null) return surfaceMax;

  // Fallback : estimer depuis prix/m2
  if (prixMin != null && prixM2Moyen != null && prixM2Moyen > 0) {
    return Math.round(prixMin / prixM2Moyen);
  }

  // Defaut : 45m2 (T2 type)
  return 45;
}
