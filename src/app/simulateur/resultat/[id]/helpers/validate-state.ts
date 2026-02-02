/**
 * Helper pour valider le state du wizard
 * @module simulateur/resultat/helpers/validate-state
 */

import type { WizardState } from "../types";

/**
 * Validate that wizard state has all required fields for calculation
 * @param state - Wizard state to validate
 * @returns Type guard indicating if state is valid
 */
export function isValidWizardState(state: WizardState | null): state is WizardState {
  if (!state) return false;

  const { step1, step2, step3, step4, step5, step6 } = state;

  return Boolean(
    step1?.revenuNet &&
    step1?.parts &&
    step2?.prixAcquisition &&
    step2?.surface &&
    step2?.zoneFiscale &&
    step3?.dureeCredit &&
    step3?.tauxCredit !== undefined &&
    step4?.loyerMensuel &&
    step4?.niveauLoyer &&
    step5?.dureeDetention &&
    step6?.structure
  );
}
