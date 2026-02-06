/**
 * Tests pour le module feature-flags
 *
 * @version 1.0
 * @date 30 janvier 2026
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  getFeatureFlags,
  getFeatureFlag,
  setRuntimeFlags,
  resetRuntimeFlags,
  getRuntimeFlags,
  getSeuilExonerationIR,
  getSeuilExonerationPS,
  getPlafondDeficitFoncier,
  isJeanbrunApplicable,
  DEFAULT_FEATURE_FLAGS,
  type TaxFeatureFlags,
} from "../feature-flags";

describe("feature-flags", () => {
  // Reset runtime flags avant chaque test
  beforeEach(() => {
    resetRuntimeFlags();
  });

  afterEach(() => {
    resetRuntimeFlags();
  });

  describe("DEFAULT_FEATURE_FLAGS", () => {
    it("devrait avoir les valeurs par défaut correctes", () => {
      expect(DEFAULT_FEATURE_FLAGS.plusValue17YearsRule).toBe(false);
      expect(DEFAULT_FEATURE_FLAGS.plusValuePS25YearsRule).toBe(false);
      expect(DEFAULT_FEATURE_FLAGS.deficitFoncierBonifie).toBe(true);
      expect(DEFAULT_FEATURE_FLAGS.jeanbrunEnabled).toBe(true);
      expect(DEFAULT_FEATURE_FLAGS.lmnpAmortissementReintegration).toBe(false);
      expect(DEFAULT_FEATURE_FLAGS.irBareme2026).toBe(true);
    });
  });

  describe("getFeatureFlags", () => {
    it("devrait retourner les flags par défaut", () => {
      const flags = getFeatureFlags();
      expect(flags.plusValue17YearsRule).toBe(false);
      expect(flags.jeanbrunEnabled).toBe(true);
    });

    it("devrait inclure les flags runtime", () => {
      setRuntimeFlags({ plusValue17YearsRule: true });
      const flags = getFeatureFlags();
      expect(flags.plusValue17YearsRule).toBe(true);
    });
  });

  describe("getFeatureFlag", () => {
    it("devrait retourner un flag spécifique", () => {
      expect(getFeatureFlag("jeanbrunEnabled")).toBe(true);
      expect(getFeatureFlag("plusValue17YearsRule")).toBe(false);
    });
  });

  describe("setRuntimeFlags / resetRuntimeFlags", () => {
    it("devrait permettre de surcharger les flags", () => {
      expect(getFeatureFlag("plusValue17YearsRule")).toBe(false);

      setRuntimeFlags({ plusValue17YearsRule: true });
      expect(getFeatureFlag("plusValue17YearsRule")).toBe(true);

      resetRuntimeFlags();
      expect(getFeatureFlag("plusValue17YearsRule")).toBe(false);
    });

    it("devrait permettre de cumuler les surcharges", () => {
      setRuntimeFlags({ plusValue17YearsRule: true });
      setRuntimeFlags({ jeanbrunEnabled: false });

      const flags = getFeatureFlags();
      expect(flags.plusValue17YearsRule).toBe(true);
      expect(flags.jeanbrunEnabled).toBe(false);
    });
  });

  describe("getRuntimeFlags", () => {
    it("devrait retourner une copie des flags runtime", () => {
      setRuntimeFlags({ plusValue17YearsRule: true });
      const runtime = getRuntimeFlags();

      expect(runtime.plusValue17YearsRule).toBe(true);
      expect(runtime.jeanbrunEnabled).toBeUndefined();
    });
  });

  describe("getSeuilExonerationIR", () => {
    it("devrait retourner 22 ans par défaut", () => {
      expect(getSeuilExonerationIR()).toBe(22);
    });

    it("devrait retourner 17 ans si réforme activée", () => {
      setRuntimeFlags({ plusValue17YearsRule: true });
      expect(getSeuilExonerationIR()).toBe(17);
    });

    it("devrait accepter des flags en paramètre", () => {
      const customFlags: TaxFeatureFlags = {
        ...DEFAULT_FEATURE_FLAGS,
        plusValue17YearsRule: true,
      };
      expect(getSeuilExonerationIR(customFlags)).toBe(17);
    });
  });

  describe("getSeuilExonerationPS", () => {
    it("devrait retourner 30 ans par défaut", () => {
      expect(getSeuilExonerationPS()).toBe(30);
    });

    it("devrait retourner 25 ans si réforme activée", () => {
      setRuntimeFlags({ plusValuePS25YearsRule: true });
      expect(getSeuilExonerationPS()).toBe(25);
    });
  });

  describe("getPlafondDeficitFoncier", () => {
    it("devrait retourner 21400 si bonifié actif", () => {
      expect(getPlafondDeficitFoncier()).toBe(21400);
    });

    it("devrait retourner 10700 si bonifié désactivé", () => {
      setRuntimeFlags({ deficitFoncierBonifie: false });
      expect(getPlafondDeficitFoncier()).toBe(10700);
    });

    it("devrait vérifier la date limite si activé", () => {
      // Date avant la limite (31/12/2027)
      const dateAvant = new Date("2027-06-15");
      expect(getPlafondDeficitFoncier(undefined, dateAvant)).toBe(21400);

      // Date après la limite
      const dateApres = new Date("2028-01-15");
      expect(getPlafondDeficitFoncier(undefined, dateApres)).toBe(10700);
    });

    it("devrait ignorer la date si vérification désactivée", () => {
      setRuntimeFlags({ deficitFoncierBonifieDateCheck: false });
      const dateApres = new Date("2028-01-15");
      expect(getPlafondDeficitFoncier(undefined, dateApres)).toBe(21400);
    });
  });

  describe("isJeanbrunApplicable", () => {
    it("devrait retourner true si Jeanbrun actif sans date", () => {
      expect(isJeanbrunApplicable()).toBe(true);
    });

    it("devrait retourner false si Jeanbrun désactivé", () => {
      setRuntimeFlags({ jeanbrunEnabled: false });
      expect(isJeanbrunApplicable()).toBe(false);
    });

    it("devrait vérifier la période 2026-2028", () => {
      // Avant la période
      const dateAvant = new Date("2025-12-31");
      expect(isJeanbrunApplicable(undefined, dateAvant)).toBe(false);

      // Pendant la période
      const datePendant = new Date("2027-06-15");
      expect(isJeanbrunApplicable(undefined, datePendant)).toBe(true);

      // Après la période
      const dateApres = new Date("2029-01-01");
      expect(isJeanbrunApplicable(undefined, dateApres)).toBe(false);
    });

    it("devrait ignorer la période si vérification désactivée", () => {
      setRuntimeFlags({ jeanbrunDateCheck: false });
      const dateAvant = new Date("2025-01-01");
      expect(isJeanbrunApplicable(undefined, dateAvant)).toBe(true);
    });
  });
});
