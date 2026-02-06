/**
 * Interface générique pour les modules de calcul
 *
 * Ce fichier définit le contrat commun que doivent respecter tous les modules
 * de calcul du simulateur. Ce pattern facilite:
 * - L'injection de dépendances dans l'orchestrateur
 * - Les tests unitaires avec des mocks
 * - L'ajout de nouveaux modules de calcul
 * - La validation des entrées de manière cohérente
 *
 * Les modules existants (ir.ts, jeanbrun-neuf.ts, etc.) n'ont PAS besoin
 * d'être modifiés pour implémenter cette interface - c'est un pattern
 * pour les futures implémentations et refactorings.
 *
 * @version 1.0
 * @date 30 janvier 2026
 */

import type {
  CreditInput,
  CreditResult,
  CapaciteEmpruntResult,
  TauxEndettementResult,
} from "./credit";
import type { DeficitFoncierInput, DeficitFoncierResult } from "./deficit-foncier";
import type { IRInput, IRResult } from "./ir";
import type {
  JeanbrunNeufInput,
  JeanbrunNeufResult,
  JeanbrunAncienInput,
  JeanbrunAncienResult,
} from "./jeanbrun";
import type { LMNPInput, LMNPResult, ComparatifJeanbrunLMNP } from "./lmnp";
import type { PlusValueInput, PlusValueResult } from "./plus-value";
import type { RendementsInput, RendementsResult } from "./rendements";
import type { SimulationCalculInput, SimulationCalculResult } from "./simulation";
import type { TMIInput, TMIResult } from "./tmi";

// ============================================
// INTERFACE GÉNÉRIQUE DE MODULE
// ============================================

/**
 * Résultat de validation d'une entrée
 */
export interface ValidationResult {
  /** Indique si l'entrée est valide */
  valid: boolean;
  /** Liste des erreurs de validation (si non valide) */
  errors?: string[];
}

/**
 * Interface générique pour un module de calcul
 *
 * Chaque module de calcul peut implémenter cette interface pour
 * bénéficier d'un contrat commun facilitant les tests et l'injection.
 *
 * @typeParam TInput - Type des données d'entrée du calcul
 * @typeParam TResult - Type du résultat du calcul
 *
 * @example
 * ```typescript
 * // Implémentation d'un module personnalisé
 * const myModule: CalculationModule<MyInput, MyResult> = {
 *   name: "my-module",
 *   calculate: (input) => ({ ...result }),
 *   validate: (input) => ({ valid: true }),
 * };
 *
 * // Utilisation dans l'orchestrateur
 * if (myModule.validate?.(input).valid) {
 *   const result = myModule.calculate(input);
 * }
 * ```
 */
export interface CalculationModule<TInput, TResult> {
  /**
   * Nom unique du module (pour logging et debugging)
   * @example "ir", "jeanbrun-neuf", "credit"
   */
  name: string;

  /**
   * Effectue le calcul principal du module
   *
   * @param input - Données d'entrée validées
   * @returns Résultat du calcul
   */
  calculate(input: TInput): TResult;

  /**
   * Valide les données d'entrée avant le calcul (optionnel)
   *
   * Si non implémentée, le calcul est effectué sans validation préalable.
   * Recommandé pour les modules avec des contraintes complexes.
   *
   * @param input - Données d'entrée à valider
   * @returns Résultat de la validation
   */
  validate?(input: TInput): ValidationResult;
}

// ============================================
// INTERFACES SPÉCIFIQUES PAR MODULE
// ============================================

/**
 * Module de calcul de l'Impôt sur le Revenu
 *
 * Calcule l'IR avec quotient familial, plafonnement et décote.
 */
export type IRModule = CalculationModule<IRInput, IRResult>;

/**
 * Module de calcul de la Tranche Marginale d'Imposition
 *
 * Détermine la TMI et les seuils de tranche.
 */
export type TMIModule = CalculationModule<TMIInput, TMIResult>;

/**
 * Module de calcul Jeanbrun pour bien NEUF
 *
 * Calcule l'amortissement annuel selon le niveau de loyer choisi.
 */
export type JeanbrunNeufModule = CalculationModule<JeanbrunNeufInput, JeanbrunNeufResult>;

/**
 * Module de calcul Jeanbrun pour bien ANCIEN avec travaux
 *
 * Vérifie l'éligibilité (travaux >= 30%) et calcule l'amortissement.
 * Le résultat peut être éligible ou inéligible (discriminated union).
 */
export type JeanbrunAncienModule = CalculationModule<JeanbrunAncienInput, JeanbrunAncienResult>;

/**
 * Module de calcul de crédit immobilier
 *
 * Calcule mensualités, tableau d'amortissement et coût total.
 */
export type CreditModule = CalculationModule<CreditInput, CreditResult>;

/**
 * Input pour le calcul de capacité d'emprunt
 */
export interface CapaciteEmpruntInput {
  revenus: number;
  chargesExistantes: number;
  tauxAnnuel: number;
  dureeMois: number;
}

/**
 * Module de calcul de capacité d'emprunt
 *
 * Calcule la capacité d'emprunt maximale selon les revenus.
 */
export type CapaciteEmpruntModule = CalculationModule<CapaciteEmpruntInput, CapaciteEmpruntResult>;

/**
 * Input pour le calcul du taux d'endettement
 */
export interface TauxEndettementInput {
  revenus: number;
  chargesExistantes: number;
  nouvelleMensualite: number;
}

/**
 * Module de calcul du taux d'endettement
 *
 * Vérifie si le projet respecte les seuils d'endettement (33%/35%).
 */
export type TauxEndettementModule = CalculationModule<TauxEndettementInput, TauxEndettementResult>;

/**
 * Module de calcul de plus-value immobilière
 *
 * Calcule l'imposition sur la plus-value avec abattements selon durée.
 */
export type PlusValueModule = CalculationModule<PlusValueInput, PlusValueResult>;

/**
 * Module de calcul LMNP
 *
 * Calcule le bénéfice imposable en régime micro-BIC ou réel.
 */
export type LMNPModule = CalculationModule<LMNPInput, LMNPResult>;

/**
 * Input pour la comparaison Jeanbrun vs LMNP
 */
export interface ComparatifLMNPInput {
  economieJeanbrun: number;
  economieLMNP: number;
  tmi: number;
}

/**
 * Module de comparaison Jeanbrun vs LMNP
 *
 * Compare les deux dispositifs et recommande le plus avantageux.
 */
export type ComparatifLMNPModule = CalculationModule<ComparatifLMNPInput, ComparatifJeanbrunLMNP>;

/**
 * Module de calcul du déficit foncier
 *
 * Calcule l'imputation sur le revenu global et le report.
 */
export type DeficitFoncierModule = CalculationModule<DeficitFoncierInput, DeficitFoncierResult>;

/**
 * Module de calcul des rendements
 *
 * Calcule les rendements brut, net et net-net.
 */
export type RendementsModule = CalculationModule<RendementsInput, RendementsResult>;

/**
 * Module orchestrateur de simulation complète
 *
 * Coordonne tous les modules pour produire une simulation complète.
 */
export type SimulationModule = CalculationModule<SimulationCalculInput, SimulationCalculResult>;

// ============================================
// TYPES UTILITAIRES
// ============================================

/**
 * Extrait le type d'entrée d'un module
 *
 * @example
 * type IRInputType = ModuleInput<IRModule>; // IRInput
 */
export type ModuleInput<T> = T extends CalculationModule<infer TInput, unknown> ? TInput : never;

/**
 * Extrait le type de résultat d'un module
 *
 * @example
 * type IRResultType = ModuleResult<IRModule>; // IRResult
 */
export type ModuleResult<T> = T extends CalculationModule<unknown, infer TResult>
  ? TResult
  : never;

/**
 * Type pour une collection de modules nommés
 *
 * Utile pour l'injection de dépendances dans l'orchestrateur.
 *
 * @example
 * const modules: ModuleRegistry = {
 *   ir: irModule,
 *   tmi: tmiModule,
 *   jeanbrunNeuf: jeanbrunNeufModule,
 * };
 */
export interface ModuleRegistry {
  ir?: IRModule;
  tmi?: TMIModule;
  jeanbrunNeuf?: JeanbrunNeufModule;
  jeanbrunAncien?: JeanbrunAncienModule;
  credit?: CreditModule;
  capaciteEmprunt?: CapaciteEmpruntModule;
  tauxEndettement?: TauxEndettementModule;
  plusValue?: PlusValueModule;
  lmnp?: LMNPModule;
  comparatifLMNP?: ComparatifLMNPModule;
  deficitFoncier?: DeficitFoncierModule;
  rendements?: RendementsModule;
  simulation?: SimulationModule;
}

// ============================================
// FACTORY TYPE
// ============================================

/**
 * Type pour une factory de module
 *
 * Permet de créer des modules avec configuration ou dépendances.
 *
 * @example
 * const createIRModule: ModuleFactory<IRModule, { annee: number }> = (config) => ({
 *   name: `ir-${config.annee}`,
 *   calculate: (input) => calculerIR(input),
 * });
 */
export type ModuleFactory<
  TModule extends CalculationModule<unknown, unknown>,
  TConfig = void,
> = (config: TConfig) => TModule;
