/**
 * Tests pour le système de verrouillage de compte (Account Lockout)
 *
 * Vérifie que les erreurs de rate limit sont correctement détectées
 * et que les messages d'erreur sont formatés en français.
 *
 * @group auth
 */

import {
  isRateLimitError,
  parseAuthError,
  formatLockoutMessage,
  formatDuration,
  shouldShowLockoutMessage,
  AuthErrorType,
  LOCKOUT_CONFIG,
} from "../auth-lockout";

describe("auth-lockout: Détection d'erreurs de rate limit", () => {
  describe("isRateLimitError", () => {
    it("doit détecter 'too many requests'", () => {
      expect(isRateLimitError("Too many requests")).toBe(true);
    });

    it("doit détecter 'rate limit'", () => {
      expect(isRateLimitError("Rate limit exceeded")).toBe(true);
    });

    it("doit détecter le statut HTTP 429", () => {
      expect(isRateLimitError("Any message", 429)).toBe(true);
    });

    it("doit détecter 'verrouillé' en français", () => {
      expect(isRateLimitError("Compte verrouillé")).toBe(true);
    });

    it("doit détecter 'trop de' en français", () => {
      expect(isRateLimitError("Trop de tentatives")).toBe(true);
    });

    it("ne doit pas détecter les erreurs standard", () => {
      expect(isRateLimitError("Invalid credentials")).toBe(false);
    });
  });

  describe("parseAuthError", () => {
    it("doit parser une erreur de rate limit", () => {
      const error = parseAuthError({
        message: "Too many requests",
        status: 429,
      });

      expect(error.type).toBe(AuthErrorType.RATE_LIMITED);
      expect(error.isLocked).toBe(true);
      expect(error.message).toContain("verrouillé");
      expect(error.retryAfterSeconds).toBe(LOCKOUT_CONFIG.DURATION_SECONDS);
    });

    it("doit parser une erreur de credentials invalides", () => {
      const error = parseAuthError({
        message: "Invalid credentials",
      });

      expect(error.type).toBe(AuthErrorType.INVALID_CREDENTIALS);
      expect(error.isLocked).toBe(false);
      expect(error.message).toBe("Email ou mot de passe incorrect.");
    });

    it("doit parser une erreur de vérification email", () => {
      const error = parseAuthError({
        message: "Email not verified",
      });

      expect(error.type).toBe(AuthErrorType.VERIFICATION_REQUIRED);
      expect(error.isLocked).toBe(false);
    });

    it("doit parser une erreur inconnue", () => {
      const error = parseAuthError({
        message: "Some unknown error",
      });

      expect(error.type).toBe(AuthErrorType.UNKNOWN);
      expect(error.isLocked).toBe(false);
    });

    it("doit gérer les erreurs sans message", () => {
      const error = parseAuthError({});

      expect(error.type).toBe(AuthErrorType.UNKNOWN);
      expect(error.isLocked).toBe(false);
    });

    it("doit gérer les erreurs avec message undefined", () => {
      const error = parseAuthError({
        message: undefined,
        status: undefined,
      });

      expect(error.type).toBe(AuthErrorType.UNKNOWN);
      expect(error.message).toContain("erreur inattendue");
    });
  });

  describe("formatLockoutMessage", () => {
    it("doit formater le message avec 15 minutes", () => {
      const message = formatLockoutMessage(900); // 15 minutes

      expect(message).toContain("15 minutes");
      expect(message).toContain("verrouillé");
      expect(message).toContain("réessayer");
    });

    it("doit formater le message avec 1 minute au singulier", () => {
      const message = formatLockoutMessage(60);

      expect(message).toContain("1 minute.");
      expect(message).not.toContain("minutes.");
    });

    it("doit formater le message avec 2 minutes au pluriel", () => {
      const message = formatLockoutMessage(120);

      expect(message).toContain("2 minutes");
    });

    it("doit être en français", () => {
      const message = formatLockoutMessage(900);

      expect(message).toMatch(/[àâäèéêëïîôùûüçœæ]/i);
      expect(message).toContain("Compte verrouillé");
      expect(message).toContain("Veuillez");
    });
  });

  describe("formatDuration", () => {
    it("doit retourner la durée en minutes", () => {
      const { value, unit } = formatDuration(900);

      expect(value).toBe(15);
      expect(unit).toBe("minutes");
    });

    it("doit utiliser le singulier pour 1 minute", () => {
      const { value, unit } = formatDuration(60);

      expect(value).toBe(1);
      expect(unit).toBe("minute");
    });

    it("doit arrondir vers le haut", () => {
      const { value } = formatDuration(601); // Slightly over 10 minutes

      expect(value).toBe(11); // ceil(601/60) = 11
    });
  });

  describe("shouldShowLockoutMessage", () => {
    it("doit retourner true pour un compte verrouillé", () => {
      const error = parseAuthError({
        message: "Too many requests",
        status: 429,
      });

      expect(shouldShowLockoutMessage(error)).toBe(true);
    });

    it("doit retourner false pour une erreur standard", () => {
      const error = parseAuthError({
        message: "Invalid credentials",
      });

      expect(shouldShowLockoutMessage(error)).toBe(false);
    });
  });

  describe("LOCKOUT_CONFIG", () => {
    it("doit avoir une durée de 15 minutes", () => {
      expect(LOCKOUT_CONFIG.DURATION_SECONDS).toBe(15 * 60);
    });

    it("doit avoir 5 tentatives max", () => {
      expect(LOCKOUT_CONFIG.MAX_ATTEMPTS).toBe(5);
    });

    it("doit avoir une fenêtre de 15 minutes", () => {
      expect(LOCKOUT_CONFIG.WINDOW_MINUTES).toBe(15);
    });
  });
});

describe("auth-lockout: Types", () => {
  describe("AuthErrorType", () => {
    it("doit avoir tous les types d'erreur", () => {
      expect(AuthErrorType.INVALID_CREDENTIALS).toBeDefined();
      expect(AuthErrorType.RATE_LIMITED).toBeDefined();
      expect(AuthErrorType.ACCOUNT_LOCKED).toBeDefined();
      expect(AuthErrorType.VERIFICATION_REQUIRED).toBeDefined();
      expect(AuthErrorType.UNKNOWN).toBeDefined();
    });
  });
});
