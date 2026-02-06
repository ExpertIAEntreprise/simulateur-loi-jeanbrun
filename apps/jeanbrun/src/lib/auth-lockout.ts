/**
 * Account Lockout Utilities
 *
 * Gère la détection et le formatage des messages de verrouillage de compte
 * suite à trop de tentatives de connexion échouées.
 *
 * Configuration Better Auth:
 * - 5 tentatives max dans une fenêtre de 15 minutes
 * - Réinitialise après une connexion réussie
 *
 * @version 1.0
 * @date 30 janvier 2026
 */

/**
 * Constantes de lockout
 */
export const LOCKOUT_CONFIG = {
  // Durée du verrouillage en secondes (15 minutes)
  DURATION_SECONDS: 15 * 60,

  // Nombre de tentatives avant verrouillage
  MAX_ATTEMPTS: 5,

  // Fenêtre de temps en minutes pour compter les tentatives
  WINDOW_MINUTES: 15,
} as const;

/**
 * Types d'erreurs d'authentification
 */
export enum AuthErrorType {
  INVALID_CREDENTIALS = "INVALID_CREDENTIALS",
  RATE_LIMITED = "RATE_LIMITED",
  ACCOUNT_LOCKED = "ACCOUNT_LOCKED",
  VERIFICATION_REQUIRED = "VERIFICATION_REQUIRED",
  UNKNOWN = "UNKNOWN",
}

/**
 * Interface pour les erreurs d'authentification structurées
 */
export interface AuthError {
  type: AuthErrorType;
  message: string;
  messageKey?: string; // Pour i18n
  isLocked: boolean;
  retryAfterSeconds?: number;
  statusCode?: number;
}

/**
 * Détecte si une erreur provient d'un rate limit (lockout)
 *
 * Better Auth retourne une erreur HTTP 429 quand le rate limit est atteint.
 * Cette fonction vérifie les patterns courants d'erreurs de rate limit.
 *
 * @param errorMessage - Message d'erreur du serveur
 * @param statusCode - Code de statut HTTP (si disponible)
 * @returns true si c'est une erreur de rate limit
 *
 * @example
 * if (isRateLimitError("Too many requests", 429)) {
 *   // Afficher message de lockout
 * }
 */
export function isRateLimitError(
  errorMessage: string,
  statusCode?: number
): boolean {
  // Vérification du statut HTTP 429
  if (statusCode === 429) {
    return true;
  }

  // Patterns textuels courants pour les erreurs de rate limit
  const rateLimitPatterns = [
    /too many/i,
    /rate limit/i,
    /too many requests/i,
    /try again later/i,
    /locked|locked out/i,
    /temporarily blocked/i,
    /trop de/i, // Français
    /verrouill/i, // Français
    /réessayer plus tard/i, // Français
  ];

  return rateLimitPatterns.some((pattern) => pattern.test(errorMessage));
}

/**
 * Parse une erreur Better Auth et retourne une erreur structurée
 *
 * Analyse le message d'erreur et le code de statut pour déterminer
 * le type d'erreur et formatter le message approprié en français.
 *
 * @param error - Objet d'erreur de Better Auth
 * @returns AuthError structuré avec type et messages localisés
 *
 * @example
 * const authError = parseAuthError(signInResult.error);
 * if (authError.isLocked) {
 *   console.log(authError.message); // Message de lockout en français
 * }
 */
export function parseAuthError(error: {
  message?: string | undefined;
  status?: number | undefined;
  code?: string | undefined;
  statusText?: string | undefined;
}): AuthError {
  const message = error.message ?? "Erreur inconnue";
  const statusCode = error.status;

  // Détecte les erreurs de rate limit (lockout)
  if (isRateLimitError(message, statusCode)) {
    return {
      type: AuthErrorType.RATE_LIMITED,
      message: formatLockoutMessage(LOCKOUT_CONFIG.DURATION_SECONDS),
      messageKey: "auth.lockout.message",
      isLocked: true,
      retryAfterSeconds: LOCKOUT_CONFIG.DURATION_SECONDS,
      statusCode: 429,
    };
  }

  // Détecte les erreurs d'authentification standard
  if (
    message.toLowerCase().includes("invalid") ||
    message.toLowerCase().includes("incorrect") ||
    message.toLowerCase().includes("not found") ||
    message.toLowerCase().includes("invalid credentials")
  ) {
    return {
      type: AuthErrorType.INVALID_CREDENTIALS,
      message: "Email ou mot de passe incorrect.",
      messageKey: "auth.error.invalid_credentials",
      isLocked: false,
    };
  }

  // Détecte les erreurs de vérification email
  if (
    message.toLowerCase().includes("verify") ||
    message.toLowerCase().includes("verification") ||
    message.toLowerCase().includes("not verified")
  ) {
    return {
      type: AuthErrorType.VERIFICATION_REQUIRED,
      message:
        "Veuillez vérifier votre adresse email avant de vous connecter.",
      messageKey: "auth.error.verification_required",
      isLocked: false,
    };
  }

  // Erreur inconnue
  return {
    type: AuthErrorType.UNKNOWN,
    message: "Une erreur inattendue s'est produite. Veuillez réessayer.",
    messageKey: "auth.error.unknown",
    isLocked: false,
  };
}

/**
 * Formate le message de lockout avec compte à rebours lisible
 *
 * Convertit les secondes en minutes et formate un message français
 * indiquant quand l'utilisateur pourra réessayer.
 *
 * @param durationSeconds - Durée du lockout en secondes
 * @returns Message formaté en français
 *
 * @example
 * formatLockoutMessage(900) // "Compte verrouillé... dans 15 minutes."
 * formatLockoutMessage(60)  // "Compte verrouillé... dans 1 minute."
 */
export function formatLockoutMessage(durationSeconds: number): string {
  const minutes = Math.ceil(durationSeconds / 60);
  const minuteLabel = minutes > 1 ? "minutes" : "minute";

  return `Compte verrouillé suite à trop de tentatives de connexion échouées. Veuillez réessayer dans ${minutes} ${minuteLabel}.`;
}

/**
 * Formate le texte de verrouillage avec unité appropriée
 *
 * @param durationSeconds - Durée en secondes
 * @returns Objet avec durée et unité formatée
 *
 * @example
 * const { value, unit } = formatDuration(900);
 * // { value: 15, unit: 'minutes' }
 */
export function formatDuration(durationSeconds: number): {
  value: number;
  unit: string;
} {
  const minutes = Math.ceil(durationSeconds / 60);
  return {
    value: minutes,
    unit: minutes > 1 ? "minutes" : "minute",
  };
}

/**
 * Détermine si un utilisateur devrait voir l'écran de lockout
 *
 * Le lockout doit être affiché à la fois pour:
 * 1. Les erreurs de rate limit du serveur
 * 2. Les erreurs de lockout détectées par Better Auth
 *
 * @param authError - Erreur d'authentification
 * @returns true si le message de lockout doit être affiché
 */
export function shouldShowLockoutMessage(authError: AuthError): boolean {
  return authError.isLocked;
}

/**
 * Classe CSS Tailwind pour le message de lockout (sévérité haute)
 *
 * Combine couleur, bordure et fond pour un style d'erreur grave
 * différent des erreurs d'authentification standard.
 */
export const LOCKOUT_ERROR_STYLES = {
  container:
    "rounded-md p-3 text-sm bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400 border border-red-200 dark:border-red-800",
  standard:
    "rounded-md p-3 text-sm bg-amber-50 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400 border border-amber-200 dark:border-amber-800",
};
