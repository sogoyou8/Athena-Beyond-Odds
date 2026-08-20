/**
 * Erreurs de la couche Application.
 * Couche Application — dépend uniquement du domaine.
 *
 * Ces erreurs encapsulent les exceptions de la couche infrastructure
 * en les normalisant pour la couche application.
 *
 * Référence : sports-data-provider-contract.md §3 (Phase 2.5)
 */

export class ApplicationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

/** Levée quand l'API distante renvoie HTTP 429. */
export class ProviderRateLimitError extends ApplicationError {
  constructor(
    message: string,
    public readonly resetTimeMs: number
  ) {
    super(message);
  }
}

/** Levée quand le quota du plan gratuit est épuisé. */
export class ProviderQuotaExceededError extends ApplicationError {
  constructor(message: string) {
    super(message);
  }
}

/** Levée quand la clé API est manquante, expirée ou invalide. */
export class ProviderAuthError extends ApplicationError {
  constructor(message: string) {
    super(message);
  }
}

/** Levée quand l'API distante est indisponible (5xx). */
export class ProviderUnavailableError extends ApplicationError {
  constructor(message: string) {
    super(message);
  }
}

/**
 * Levée quand le fournisseur distant rejette explicitement la requête (HTTP 400).
 *
 * DEC-021 : classification interne dédiée pour les requêtes rejetées par football-data.org.
 * Le contrat HTTP public reste HTTP 503 côté routes (aucune modification du contrat client).
 *
 * Contraintes de sécurité (DEC-021.5 / DEC-021.6) :
 * - providerMessage : uniquement un texte sanitisé, tronqué à 256 caractères.
 * - providerCode    : uniquement un code court sanitisé, tronqué à 64 caractères.
 * - Aucune valeur de token ou d'en-tête ne doit figurer dans ces champs.
 * - Le corps de réponse brut n'est jamais stocké.
 */
export class ProviderRequestRejectedError extends ApplicationError {
  public readonly upstreamStatus: number;
  public readonly providerMessage: string | undefined;
  public readonly providerCode: string | undefined;

  constructor(
    message: string,
    options?: {
      upstreamStatus?: number;
      providerMessage?: string;
      providerCode?: string;
    }
  ) {
    super(message);
    this.upstreamStatus = options?.upstreamStatus ?? 400;
    this.providerMessage = options?.providerMessage;
    this.providerCode = options?.providerCode;
  }
}

/** Levée quand le payload du fournisseur ne correspond pas au contrat normalisé. */
export class ProviderDataMappingError extends ApplicationError {
  constructor(message: string) {
    super(message);
  }
}

/** Levée quand une opération n'est pas encore implémentée (frontière technique). */
export class NotImplementedError extends ApplicationError {
  constructor(methodName: string) {
    super(`Non implémenté — Phase suivante : ${methodName}`);
  }
}
