/**
 * Schémas de validation Zod pour la simulation Jeanbrun
 *
 * Valide les données entrées par l'utilisateur avant calcul fiscal.
 * Utilisé à la fois côté client (React Hook Form) et côté serveur (API).
 *
 * @version 1.0
 * @date 30 janvier 2026
 */

import { z } from "zod";

// ============================================
// ENUMS POUR VALIDATION
// ============================================

/**
 * Zone fiscale (Pinel/Jeanbrun)
 */
export const zoneFiscaleSchema = z.enum(["A_BIS", "A", "B1", "B2", "C"], {
  error: "Zone fiscale invalide",
});

/**
 * Niveau de loyer pour le dispositif Jeanbrun
 */
export const niveauLoyerSchema = z.enum(
  ["intermediaire", "social", "tres_social"],
  {
    error: "Niveau de loyer invalide",
  }
);

/**
 * Type de bien immobilier
 */
export const typeBienSchema = z.enum(["neuf", "ancien"], {
  error: "Type de bien invalide",
});

// ============================================
// SCHEMA PRINCIPAL DE SIMULATION
// ============================================

/**
 * Schéma de validation pour la simulation Jeanbrun
 *
 * Valide l'ensemble des données nécessaires au calcul fiscal :
 * - Situation fiscale (revenu, parts)
 * - Bien immobilier (type, prix, surface, zone)
 * - Financement (apport, crédit, assurance)
 * - Revenus locatifs (loyer, charges, taxes)
 * - Options (comparaison LMNP, plus-value)
 */
export const simulationCalculInputSchema = z
  .object({
    // ----------------------------------------
    // SITUATION FISCALE (obligatoire)
    // ----------------------------------------
    revenuNetImposable: z
      .number({
        error: "Le revenu net imposable est requis",
      })
      .min(0, "Le revenu doit être positif ou nul")
      .max(10_000_000, "Le revenu doit être inférieur à 10 millions d'euros"),

    nombreParts: z
      .number({
        error: "Le nombre de parts est requis",
      })
      .min(1, "Le nombre de parts doit être au minimum 1")
      .max(10, "Le nombre de parts doit être au maximum 10"),

    // ----------------------------------------
    // BIEN IMMOBILIER (obligatoire)
    // ----------------------------------------
    typeBien: typeBienSchema,

    prixAcquisition: z
      .number({
        error: "Le prix d'acquisition est requis",
      })
      .min(10_000, "Le prix minimum est de 10 000€")
      .max(10_000_000, "Le prix maximum est de 10 millions d'euros"),

    surface: z
      .number({
        error: "La surface est requise",
      })
      .min(9, "La surface minimum est de 9m² (loi Carrez)")
      .max(1000, "La surface maximum est de 1 000m²"),

    zoneFiscale: zoneFiscaleSchema,

    // ----------------------------------------
    // TRAVAUX (obligatoire pour ancien)
    // ----------------------------------------
    montantTravaux: z
      .number({
        error: "Le montant des travaux doit être un nombre",
      })
      .min(0, "Le montant des travaux doit être positif ou nul")
      .optional(),

    // ----------------------------------------
    // NIVEAU DE LOYER (obligatoire)
    // ----------------------------------------
    niveauLoyer: niveauLoyerSchema,

    // ----------------------------------------
    // FINANCEMENT (optionnel)
    // ----------------------------------------
    apportPersonnel: z
      .number({
        error: "L'apport personnel doit être un nombre",
      })
      .min(0, "L'apport personnel doit être positif ou nul")
      .optional(),

    tauxCredit: z
      .number({
        error: "Le taux de crédit doit être un nombre",
      })
      .min(0, "Le taux de crédit doit être positif ou nul")
      .max(15, "Le taux de crédit doit être inférieur à 15%")
      .optional(),

    dureeCredit: z
      .number({
        error: "La durée du crédit doit être un nombre",
      })
      .min(5, "La durée du crédit doit être au minimum 5 ans")
      .max(30, "La durée du crédit doit être au maximum 30 ans")
      .optional(),

    tauxAssurance: z
      .number({
        error: "Le taux d'assurance doit être un nombre",
      })
      .min(0, "Le taux d'assurance doit être positif ou nul")
      .max(2, "Le taux d'assurance doit être inférieur à 2%")
      .optional(),

    // ----------------------------------------
    // REVENUS LOCATIFS (optionnel - estimés si non fournis)
    // ----------------------------------------
    loyerMensuelEstime: z
      .number({
        error: "Le loyer mensuel doit être un nombre",
      })
      .min(0, "Le loyer mensuel doit être positif ou nul")
      .optional(),

    chargesCopropriete: z
      .number({
        error: "Les charges de copropriété doivent être un nombre",
      })
      .min(0, "Les charges de copropriété doivent être positives ou nulles")
      .optional(),

    taxeFonciere: z
      .number({
        error: "La taxe foncière doit être un nombre",
      })
      .min(0, "La taxe foncière doit être positive ou nulle")
      .optional(),

    // ----------------------------------------
    // OPTIONS (optionnel)
    // ----------------------------------------
    comparerLMNP: z.boolean().optional().default(false),

    calculerPlusValue: z.boolean().optional().default(false),

    dureeDetentionPrevue: z
      .number({
        error: "La durée de détention doit être un nombre",
      })
      .min(1, "La durée de détention doit être au minimum 1 an")
      .max(50, "La durée de détention doit être au maximum 50 ans")
      .optional(),

    prixReventeEstime: z
      .number({
        error: "Le prix de revente doit être un nombre",
      })
      .min(0, "Le prix de revente doit être positif ou nul")
      .optional(),
  })
  .strict() // Empêche les propriétés non définies
  // ----------------------------------------
  // VALIDATIONS CROISÉES (refine)
  // ----------------------------------------
  .refine(
    (data) => {
      // Pour un bien ancien, les travaux doivent représenter au moins 30% du prix
      if (data.typeBien === "ancien") {
        if (data.montantTravaux === undefined) {
          return false;
        }
        return data.montantTravaux >= data.prixAcquisition * 0.3;
      }
      return true;
    },
    {
      message:
        "Pour un bien ancien, les travaux doivent représenter au moins 30% du prix d'acquisition (loi Jeanbrun)",
      path: ["montantTravaux"],
    }
  )
  .refine(
    (data) => {
      // Si calculerPlusValue = true, dureeDetentionPrevue et prixReventeEstime sont requis
      if (data.calculerPlusValue === true) {
        return (
          data.dureeDetentionPrevue !== undefined &&
          data.prixReventeEstime !== undefined
        );
      }
      return true;
    },
    {
      message:
        "Pour calculer la plus-value, veuillez renseigner la durée de détention prévue et le prix de revente estimé",
      path: ["calculerPlusValue"],
    }
  )
  .refine(
    (data) => {
      // Si apportPersonnel est fourni, il doit être inférieur au prix d'acquisition
      if (data.apportPersonnel !== undefined) {
        return data.apportPersonnel <= data.prixAcquisition;
      }
      return true;
    },
    {
      message:
        "L'apport personnel ne peut pas être supérieur au prix d'acquisition",
      path: ["apportPersonnel"],
    }
  )
  .refine(
    (data) => {
      // Si tauxCredit, dureeCredit ou tauxAssurance sont fournis, tous les champs crédit doivent être fournis
      const hasCreditField =
        data.tauxCredit !== undefined ||
        data.dureeCredit !== undefined ||
        data.tauxAssurance !== undefined;

      if (hasCreditField) {
        return (
          data.tauxCredit !== undefined &&
          data.dureeCredit !== undefined &&
          data.tauxAssurance !== undefined
        );
      }
      return true;
    },
    {
      message:
        "Si vous renseignez des informations de crédit, veuillez compléter tous les champs (taux, durée, assurance)",
      path: ["tauxCredit"],
    }
  );

/**
 * Type TypeScript inféré depuis le schéma Zod
 * Utilisé pour garantir la cohérence entre validation et types
 */
export type SimulationCalculInputValidated = z.infer<
  typeof simulationCalculInputSchema
>;

// ============================================
// SCHEMA DE REPONSE API
// ============================================

/**
 * Schéma de validation pour la réponse API de simulation
 * Utilisé pour documenter et valider les réponses du serveur
 */
/**
 * Schéma pour le résultat de simulation (structure typée)
 */
export const simulationResultSchema = z.object({
  // IR et TMI
  impotAvantJeanbrun: z.number(),
  impotApresJeanbrun: z.number(),
  economieImpot: z.number(),
  tmi: z.number(),

  // Détails amortissement Jeanbrun
  amortissementJeanbrun: z.object({
    annee1: z.number(),
    annee2a10: z.number(),
    annee11a12: z.number().optional(),
    total: z.number(),
  }),

  // Cashflow
  cashflowMensuel: z.number().optional(),
  cashflowAnnuel: z.number().optional(),

  // Comparaison LMNP (optionnel)
  comparaisonLMNP: z.object({
    economieJeanbrun: z.number(),
    economieLMNP: z.number(),
    difference: z.number(),
    recommendation: z.string(),
  }).optional(),

  // Plus-value (optionnel)
  plusValue: z.object({
    plusValueBrute: z.number(),
    abattement: z.number(),
    plusValueNette: z.number(),
    impotPlusValue: z.number(),
  }).optional(),

  // Projection annuelle
  projection: z.array(z.object({
    annee: z.number(),
    reductionImpot: z.number(),
    cumulReduction: z.number(),
    cashflowNet: z.number().optional(),
  })).optional(),
});

export const simulationApiResponseSchema = z.object({
  success: z.boolean(),
  data: simulationResultSchema.optional(),
  error: z.string().optional(),
  details: z.record(z.string(), z.array(z.string())).optional(), // Erreurs de validation
});

/**
 * Type TypeScript pour la réponse API
 */
export type SimulationApiResponse = z.infer<typeof simulationApiResponseSchema>;
